# 08 — SECURITY & SEO: Bảo mật, SEO, hiệu năng, pháp lý

> Dựa trên `00-MASTER-PLAN.md` v0.2, `01-TECH-STANDARDS.md` v1.0, `02-DATABASE.md` v1.1, `04-SERVER-LAYER.md` v1.1 · Phiên bản: v1.1 · 2026-10-05
>
> Mỗi mục là một **checklist**: đánh `[x]` khi đã làm và kiểm tra. Toàn bộ mục P0 phải xong trước khi ra mắt (xem `10`).

---

## Phần I — Bảo mật

### 1. Đăng nhập quản trị
- [ ] Better Auth, đăng nhập email + mật khẩu, phiên lưu trong bảng `Session`, cookie `httpOnly`, `secure`, `sameSite=lax`.
- [ ] **Tắt đăng ký** tài khoản mới; tài khoản admin chỉ tạo bằng seed.
- [ ] Phiên hết hạn sau **7 ngày**; đổi mật khẩu thì thu hồi mọi phiên khác.
- [ ] Mật khẩu băm bằng thuật toán mặc định của Better Auth; không tự viết hàm băm.
- [ ] Mật khẩu tối thiểu 10 ký tự. Mật khẩu ban đầu từ `ADMIN_INITIAL_PASSWORD` **phải đổi** sau lần đăng nhập đầu.
- [ ] Sai 5 lần / 15 phút theo email hoặc IP → khóa 15 phút (mục 3).
- [ ] Thông báo lỗi chung “Email hoặc mật khẩu không đúng”.
- [ ] `proxy.ts` chặn `/admin/*` (trừ `/admin/login`) **và** mọi action/query admin gọi `requireAdmin()`.
- [ ] Ghi `lastLoginAt`; gửi Telegram khi có đăng nhập admin thành công (để phát hiện đăng nhập lạ).

### 2. Dữ liệu đầu vào
- [ ] Mọi input validate bằng Zod ở server (`01` mục 8).
- [ ] Prisma dùng truy vấn tham số hóa; câu SQL thô (`$queryRaw`) chỉ dùng dạng template tag, **không** ghép chuỗi.
- [ ] Mô tả sản phẩm (Markdown) render bằng thư viện **không cho phép HTML thô**; link ngoài thêm `rel="noopener noreferrer"`.
- [ ] Giới hạn độ dài mọi trường chữ (tên ≤ 100, ghi chú ≤ 500, lời nhắn ≤ 300…).
- [ ] Số điện thoại chuẩn hóa và kiểm tra định dạng Việt Nam (10 số, bắt đầu bằng 0).

### 3. Chống spam và giới hạn tần suất

Môi trường serverless không giữ bộ nhớ giữa các lần chạy, nên bộ đếm lưu trong database (bảng `RateLimitHit`, đã thêm vào `02` v1.1).

| Hành động | Khóa đếm | Giới hạn |
|---|---|---|
| Đặt hàng | `order:<ipHash>` | 3 lần / 10 phút |
| Tra cứu đơn | `lookup:<ipHash>` | 10 lần / 10 phút |
| Đăng nhập sai | `login:<email>` và `login:<ipHash>` | 5 lần / 15 phút |
| Gợi ý tìm kiếm | — | Không giới hạn ở server; phía trình duyệt chờ 250ms sau khi gõ |

- [ ] Hàm `checkRateLimit({ key, limit, windowSeconds })` trong `lib/rate-limit.ts`.
- [ ] `ipHash = SHA-256(IP + IP_HASH_SALT)`; IP lấy từ header của Netlify (`x-nf-client-connection-ip`), dự phòng `x-forwarded-for`.
- [ ] Trường bẫy bot `website` trong form đặt hàng.
- [ ] Dọn bản ghi `RateLimitHit` cũ hơn 1 ngày (tác vụ hằng ngày, `09` mục 7).

### 4. Upload ảnh
- [ ] Chỉ admin lấy được chữ ký upload; chữ ký hết hạn sau 10 phút.
- [ ] Giới hạn định dạng `jpg, jpeg, png, webp`, dung lượng ≤ 5 MB, thư mục cố định `lamora/products`.
- [ ] `CLOUDINARY_API_SECRET` chỉ ở server.

### 5. Header bảo mật (`next.config` → `headers()`)
| Header | Giá trị |
|---|---|
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` |
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` |
| `Content-Security-Policy` | Bắt đầu ở chế độ `Report-Only`, cho phép: chính trang, `res.cloudinary.com`, `img.vietqr.io`, `api.cloudinary.com` (upload), Google Analytics. Chuyển sang chặn thật khi không còn cảnh báo |

### 6. Bí mật và biến môi trường
- [ ] `.env` trong `.gitignore`; chỉ commit `.env.example`.
- [ ] Biến bí mật nhập trên Netlify, đánh dấu **secret**.
- [ ] Thêm biến `IP_HASH_SALT` (chuỗi ngẫu nhiên ≥ 32 ký tự) vào `01` mục 14.
- [ ] Bật **GitHub secret scanning** và **Dependabot** cho repository.
- [ ] Đổi toàn bộ khóa ngay nếu lỡ lộ (token Telegram, khóa Cloudinary, mật khẩu DB).

### 7. Phụ thuộc và cập nhật
- [ ] Dependabot mở PR cập nhật **hằng tháng, gộp nhóm** vào nhánh `develop` (tiết kiệm lần deploy); bản vá bảo mật mở ngay. Chỉ gộp khi CI xanh.
- [ ] `pnpm audit --prod` chạy trong CI, báo lỗi với mức `high` trở lên.
- [ ] Theo dõi thông báo bảo mật của Next.js và cập nhật bản vá trong vòng 1 tuần.

### 8. Dữ liệu khách hàng
- [ ] Chỉ thu thập dữ liệu cần cho giao hàng (`02` mục 3.8).
- [ ] Không lưu IP gốc, chỉ lưu `ipHash`. Xóa `ipHash` khỏi đơn sau 90 ngày.
- [ ] Trang admin không cho tải toàn bộ dữ liệu khách ra file ở P0.
- [ ] Log không ghi số điện thoại, địa chỉ đầy đủ (che bớt: `0912***678`).
- [ ] Sao lưu database được mã hóa (`09` mục 6).

---

## Phần II — SEO

### 9. Cấu trúc URL
| Trang | URL |
|---|---|
| Sản phẩm | `/san-pham/mau-don-hong-phan` |
| Danh mục | `/danh-muc/binh-hoa-cam-san` |
| Bộ sưu tập | `/bo-suu-tap/qua-tang-20-10` |

- [ ] Slug không dấu, chữ thường; đổi slug thì tạo chuyển hướng 301 từ slug cũ (P1: bảng `Redirect`; P0: hạn chế đổi slug sau khi đăng bán).
- [ ] URL có tham số lọc/sắp xếp đặt `canonical` về URL danh mục gốc.
- [ ] Trang tìm kiếm, giỏ hàng, thanh toán, đặt hàng thành công, tra cứu đơn, admin: `noindex`.

### 10. Metadata
| Trang | Title | Description |
|---|---|---|
| Trang chủ | `Lamora Flower — Hoa lụa cao cấp, bền đẹp như thật` | Câu giới thiệu thương hiệu (≤ 160 ký tự) |
| Danh mục | `{seoTitle ?? name} | Lamora Flower` | `seoDescription ?? description` (cắt 160 ký tự) |
| Sản phẩm | `{seoTitle ?? name} | Lamora Flower` | `seoDescription ?? shortDescription` |
| Trang tĩnh | `{Tên trang} | Lamora Flower` | Viết riêng |

- [ ] Ảnh chia sẻ (Open Graph) 1200×630: sản phẩm dùng ảnh đầu tiên qua Cloudinary (`c_pad,b_rgb:FCFAF6`); trang khác dùng ảnh thương hiệu mặc định.
- [ ] `metadataBase` = `NEXT_PUBLIC_SITE_URL`; `lang="vi"`.

### 11. Dữ liệu cấu trúc (JSON-LD)
- [ ] Trang chủ: `Organization` (tên, logo, mạng xã hội, SĐT) + `WebSite` (có `SearchAction` trỏ tới `/tim-kiem?q=`).
- [ ] Trang sản phẩm: `Product` + `Offer` cho từng biến thể (giá VND, tình trạng `InStock`/`OutOfStock`, `priceCurrency: "VND"`).
- [ ] Mọi trang có breadcrumb: `BreadcrumbList`.
- [ ] Kiểm tra bằng công cụ Rich Results Test của Google.

### 12. Sitemap và robots
- [ ] `app/sitemap.ts`: trang chủ, trang tĩnh, mọi danh mục và bộ sưu tập đang bật, mọi sản phẩm `ACTIVE` (kèm `lastModified = updatedAt`).
- [ ] `app/robots.ts`: chặn `/admin`, `/api`, `/gio-hang`, `/thanh-toan`, `/dat-hang-thanh-cong`, `/tra-cuu-don`; khai báo đường dẫn sitemap.
- [ ] Đăng ký **Google Search Console**, gửi sitemap sau khi có tên miền chính thức.

### 13. Nội dung
- [ ] Mỗi danh mục có đoạn mô tả 80–150 chữ, tự nhiên, có từ khóa (ví dụ “bình hoa lụa cắm sẵn”, “hoa lụa trang trí phòng khách”).
- [ ] Mỗi sản phẩm có mô tả riêng, không sao chép giữa các sản phẩm.
- [ ] `alt` ảnh mô tả thật: “Bình hoa mẫu đơn lụa màu hồng phấn đặt trên bàn gỗ”.
- [ ] P2: blog cẩm nang (cách chọn hoa lụa theo phòng, cách vệ sinh hoa lụa…) để kéo truy cập tự nhiên.

---

## Phần III — Hiệu năng

### 14. Mục tiêu (đo trên điện thoại, mạng 4G, PageSpeed Insights)
| Chỉ số | Mục tiêu |
|---|---|
| LCP (thời gian hiện nội dung chính) | < 2.5 giây |
| CLS (độ nhảy bố cục) | < 0.1 |
| INP (độ trễ phản hồi thao tác) | < 200ms |
| Điểm Performance | ≥ 85 cho trang chủ, danh sách, chi tiết sản phẩm |

### 15. Biện pháp
- [ ] Ảnh qua Cloudinary với `f_auto,q_auto` và kích thước theo `sizes`; ảnh banner và ảnh đầu trang chi tiết có `priority`.
- [ ] Mọi ảnh có `width/height` hoặc tỉ lệ cố định để tránh nhảy bố cục.
- [ ] Font tải qua `next/font`, chỉ subset `latin` + `vietnamese`, chỉ các độ đậm dùng ở `03` mục 3.1.
- [ ] Trang công khai dùng cache của Next.js và làm mới theo tag (`revalidateTag`) khi admin sửa dữ liệu, thay vì render lại mỗi lượt truy cập. Điều này cũng giảm số lần đánh thức database Neon.
- [ ] Client Component chỉ ở chỗ cần tương tác (`01` mục 9.3); kiểm tra kích thước JavaScript mỗi trang bằng báo cáo build.
- [ ] Không nhúng thư viện nặng (carousel, animation) khi CSS làm được.
- [ ] Google Analytics tải với chiến lược `afterInteractive`.

---

## Phần IV — Pháp lý (tham khảo, cần tự kiểm tra)

> Phần này **không phải tư vấn pháp lý**. Quy định có thể thay đổi; hãy kiểm tra văn bản hiện hành hoặc hỏi người có chuyên môn trước khi ra mắt.

- [ ] **Thông báo website thương mại điện tử bán hàng** với Bộ Công Thương (cổng `online.gov.vn`) nếu thuộc diện phải thông báo. Kiểm tra điều kiện áp dụng cho cá nhân kinh doanh.
- [ ] **Thông tin người bán** ở chân trang: tên chủ shop/hộ kinh doanh, địa chỉ, SĐT, email, mã số thuế (nếu có).
- [ ] **Chính sách bảo mật dữ liệu cá nhân**: dữ liệu thu thập, mục đích, thời gian lưu, cách khách yêu cầu xem/xóa. Đối chiếu quy định bảo vệ dữ liệu cá nhân hiện hành.
- [ ] **Chính sách đổi trả, vận chuyển, thanh toán** công khai, dễ tìm.
- [ ] Ô xác nhận ở trang thanh toán: “Tôi đồng ý với Chính sách bảo mật và Điều khoản mua hàng” (link tới trang tương ứng).
- [ ] **Thuế**: tìm hiểu nghĩa vụ kê khai thuế đối với cá nhân kinh doanh online.

---

## 16. Cập nhật các file khác

| File | Thay đổi |
|---|---|
| `02` | Thêm bảng `RateLimitHit`, cột `User.mustChangePassword` (v1.1–v1.2) |
| `01` mục 14 | Thêm biến `IP_HASH_SALT` |
| `05` mục 7 | Thêm ô đồng ý chính sách ở trang thanh toán |

---

## 17. Cần xác nhận

1. Bạn đã có đăng ký hộ kinh doanh hoặc mã số thuế cá nhân chưa? Điều này quyết định thông tin ở chân trang và thủ tục với Bộ Công Thương.
2. Bạn có muốn bật Google Analytics ngay từ đầu không? Mặc định: **có**.

---

## Nhật ký thay đổi

| Phiên bản | Ngày | Thay đổi |
|---|---|---|
| v1.1 | 2026-10-05 | Đăng nhập theo Better Auth; Dependabot hằng tháng vào `develop` |
| v1.0 | 2026-10-05 | Bản đầu tiên |
