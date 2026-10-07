# 08 — SECURITY & SEO: Bảo mật, chống spam, SEO địa phương, hiệu năng, pháp lý

> Dựa trên `00-MASTER-PLAN.md` v1.0, `01-TECH-STANDARDS.md` v2.0, `02-DATABASE.md` v2.0, `04-SERVER-LAYER.md` v2.0 · Phiên bản: v2.0 · 2026-10-07
>
> Mỗi mục là một **checklist**: đánh `[x]` khi đã làm và kiểm tra. Toàn bộ mục P0 phải xong trước khi ra mắt (`10`).

---

## Phần I — Bảo mật

### 1. Đăng nhập quản trị (giữ từ bản cũ)
- [ ] Better Auth, cookie `httpOnly`, `secure`, `sameSite=lax`; **tắt đăng ký**; admin chỉ tạo bằng seed.
- [ ] Phiên hết hạn sau 7 ngày; đổi mật khẩu thu hồi phiên khác.
- [ ] Mật khẩu ≥ 10 ký tự; mật khẩu ban đầu **phải đổi** sau lần đăng nhập đầu.
- [ ] Sai 5 lần / 15 phút theo email hoặc IP → khóa 15 phút.
- [ ] Lỗi chung “Email hoặc mật khẩu không đúng”.
- [ ] `proxy.ts` chặn `/admin/*` **và** mọi action/query admin gọi `requireAdmin()`.
- [ ] Gửi Telegram khi admin đăng nhập thành công.

### 2. Dữ liệu đầu vào
- [ ] Mọi input validate bằng Zod ở server.
- [ ] Prisma tham số hóa; `$queryRaw` chỉ dạng template tag.
- [ ] Mô tả món (Markdown) render **không cho HTML thô** (`lib/markdown.ts`).
- [ ] Giới hạn độ dài: tên ≤ 60, địa chỉ ≤ 200, ghi chú ≤ 500, tin liên hệ ≤ 1000.
- [ ] SĐT chuẩn hóa và kiểm tra định dạng Việt Nam.
- [ ] **Escape HTML mọi nội dung khách nhập trước khi gửi Telegram** (`parse_mode: HTML`); có unit test với chuỗi `<b>`, `&`, `<script>`.

### 3. Chống spam form

Form đặt món và liên hệ là cửa duy nhất khách ghi vào hệ thống và **làm rung điện thoại tiệm** — spam ở đây gây phiền trực tiếp.

| Lớp | Đặt món | Liên hệ |
|---|---|---|
| Trường bẫy `website` (ẩn bằng CSS, không `display:none`) | ✔ | ✔ |
| Gửi < 3 giây sau khi mở form → bỏ qua âm thầm | ✔ | ✔ |
| Giới hạn theo IP (`RateLimitHit`) | 3 lần / 10 phút | 3 lần / 10 phút |
| Giới hạn theo SĐT | 5 yêu cầu / ngày | 3 tin / ngày |
| Đăng nhập sai | 5 lần / 15 phút theo email và IP | — |

- [ ] `checkRateLimit({ key, limit, windowSeconds })` trong `lib/rate-limit.ts` (giữ từ bản cũ).
- [ ] `ipHash = SHA-256(IP + IP_HASH_SALT)`; IP lấy từ `x-nf-client-connection-ip`, dự phòng `x-forwarded-for`.
- [ ] Bản ghi bị chặn **không** gửi Telegram.
- [ ] P1 nếu vẫn bị spam: thêm **Cloudflare Turnstile** (miễn phí, không bắt khách giải đố) vào hai form. Cần thêm thư viện → hỏi trước.
- [ ] Admin hủy yêu cầu với lý do “Spam” → (P1) gợi ý chặn SĐT đó.

### 4. Upload ảnh
- [ ] Chỉ admin lấy được chữ ký upload; định dạng `jpg, jpeg, png, webp`, ≤ 5 MB; thư mục `thanhlong/<folder>`.
- [ ] `CLOUDINARY_API_SECRET` chỉ ở server.

### 5. Header bảo mật (`next.config` → `headers()`)
| Header | Giá trị |
|---|---|
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` |
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` |
| `Content-Security-Policy` | Bắt đầu `Report-Only`, cho phép: chính trang, `res.cloudinary.com`, `api.cloudinary.com`, Google Analytics, **`www.google.com` / `maps.google.com` trong `frame-src`** (bản đồ). Bỏ `img.vietqr.io`. Chuyển sang chặn thật khi hết cảnh báo |

### 6. Bí mật và biến môi trường
- [ ] `.env` trong `.gitignore`; chỉ commit `.env.example`.
- [ ] Biến bí mật trên Netlify đánh dấu **secret**.
- [ ] Bật GitHub secret scanning và Dependabot.
- [ ] Lộ token Telegram → `/revoke` với @BotFather ngay; lộ khóa khác → đổi trên dịch vụ tương ứng.
- [ ] Webhook Telegram (P1) kiểm tra `secret_token` và `chat.id`.

### 7. Phụ thuộc và cập nhật
- [ ] Dependabot hằng tháng, gộp nhóm, vào `develop`; bản vá bảo mật mở ngay.
- [ ] `pnpm audit --prod` trong CI, lỗi từ mức `high`.
- [ ] Gỡ hết thư viện chỉ dùng cho phần bán hàng cũ (`12` bước 2) để giảm bề mặt tấn công.

### 8. Dữ liệu khách hàng
- [ ] Chỉ thu thập: tên, SĐT, địa chỉ giao (nếu giao), ghi chú.
- [ ] Không lưu IP gốc; xóa `ipHash` sau 90 ngày.
- [ ] Yêu cầu và tin liên hệ cũ hơn **12 tháng**: xóa thông tin cá nhân (tên, SĐT, địa chỉ → “đã ẩn”), giữ số liệu món để thống kê (tác vụ `cleanup`, P1).
- [ ] Log che SĐT (`0912***678`), không ghi địa chỉ.
- [ ] Nhóm Telegram chỉ gồm người cần xử lý đơn (`07` mục 7).
- [ ] Sao lưu database được mã hóa (`09` mục 6).

---

## Phần II — SEO địa phương

Khách tìm tiệm bánh mì chủ yếu qua **Google Maps** và tìm “bánh mì gần đây”. Hồ sơ Google quan trọng ngang website.

### 9. Google Business Profile (việc của chủ tiệm, ngoài code)
- [ ] Tạo / xác minh hồ sơ “Bánh Mì Thanh Long” trên Google Business Profile.
- [ ] Tên, địa chỉ, SĐT **giống hệt** trên website (NAP thống nhất).
- [ ] Giờ mở cửa, ảnh món, ảnh mặt tiền; trường “Trang web” trỏ về trang chủ; trường “Thực đơn” / “Đặt món” trỏ về `/thuc-don` và `/dat-mon`.
- [ ] Mời khách quen đánh giá; trả lời đánh giá.

### 10. Cấu trúc URL và metadata
| Trang | URL | Title |
|---|---|---|
| Trang chủ | `/` | `Bánh Mì Thanh Long — Bánh mì giòn, nhân đầy tại {Phường/Quận}` |
| Thực đơn | `/thuc-don` | `Thực đơn & giá | Bánh Mì Thanh Long` |
| Danh mục | `/thuc-don/do-uong` | `{Danh mục} | Bánh Mì Thanh Long` |
| Món | `/mon/banh-mi-thit-nguoi` | `{seoTitle ?? tên món} – {giá từ} | Bánh Mì Thanh Long` |
| Liên hệ | `/lien-he` | `Địa chỉ & giờ mở cửa | Bánh Mì Thanh Long` |

- [ ] Description ≤ 160 ký tự, có khu vực (“bánh mì Quận 1”), không nhồi từ khóa.
- [ ] Ảnh chia sẻ (Open Graph) 1200×630: món dùng ảnh đầu tiên qua Cloudinary; trang khác dùng ảnh thương hiệu. Kiểm tra hiển thị khi gửi link qua **Zalo** và Facebook.
- [ ] `metadataBase` = `NEXT_PUBLIC_SITE_URL`; `lang="vi"`.
- [ ] `noindex`: `/dat-mon`, `/dat-mon/da-gui`, `/admin`.

### 11. Dữ liệu cấu trúc (JSON-LD)
- [ ] Mọi trang (trong layout): `Restaurant` (hoặc `Bakery`) — `name`, `image`, `address` (`PostalAddress`), `geo`, `telephone`, `url`, `servesCuisine: "Vietnamese"`, `priceRange: "₫"`, `openingHoursSpecification` (sinh từ `OPENING_HOURS`), `hasMenu` → `/thuc-don`, `sameAs` (Facebook, Zalo OA…).
- [ ] `/thuc-don`: `Menu` → `MenuSection` (danh mục) → `MenuItem` (tên, mô tả, `offers.price`, `priceCurrency: "VND"`).
- [ ] Trang món: `MenuItem` + `BreadcrumbList`.
- [ ] Kiểm tra bằng Rich Results Test và Schema Markup Validator.

### 12. Sitemap và robots
- [ ] `app/sitemap.ts`: trang chủ, thực đơn, mọi danh mục đang bật, mọi món `ACTIVE`, liên hệ, giới thiệu, chính sách.
- [ ] `app/robots.ts`: chặn `/admin`, `/api`, `/dat-mon/da-gui`; khai báo sitemap.
- [ ] Google Search Console: xác minh tên miền, gửi sitemap.

### 13. Nội dung
- [ ] Mỗi món có mô tả riêng 1–3 câu, nêu thành phần thật.
- [ ] Trang giới thiệu có câu chuyện tiệm, khu vực, năm mở cửa.
- [ ] `alt` ảnh mô tả thật: “Bánh mì thịt nguội cắt đôi, nhân pate, chả lụa và đồ chua”.

---

## Phần III — Hiệu năng

### 14. Mục tiêu (điện thoại, 4G, PageSpeed Insights)
| Chỉ số | Mục tiêu |
|---|---|
| LCP | < 2.5 giây |
| CLS | < 0.1 |
| INP | < 200ms |
| Điểm Performance | ≥ 90 cho trang chủ, thực đơn, chi tiết món |

### 15. Biện pháp
- [ ] Trang khách **render tĩnh**, làm mới theo tag khi admin sửa — khách xem web không đánh thức Neon.
- [ ] `OpenStatus` tính ở trình duyệt, không làm trang mất cache.
- [ ] Ảnh qua Cloudinary `f_auto,q_auto`, có `sizes`; ảnh lớn đầu trang có `priority`.
- [ ] **Bản đồ Google không tải sẵn**: hiện ảnh tĩnh, bấm mới tải iframe.
- [ ] Font qua `next/font`, chỉ độ đậm dùng ở `03` mục 3.1.
- [ ] Client Component chỉ ở chỗ cần (bộ chọn món, form, menu).
- [ ] Google Analytics `afterInteractive`.

---

## Phần IV — Pháp lý (tham khảo, cần tự kiểm tra)

> **Không phải tư vấn pháp lý.** Quy định thay đổi; hãy kiểm tra văn bản hiện hành hoặc hỏi người có chuyên môn / cơ quan quản lý địa phương trước khi ra mắt.

- [ ] **An toàn thực phẩm**: giấy chứng nhận cơ sở đủ điều kiện ATTP hoặc bản cam kết ATTP theo quy mô cơ sở; giấy xác nhận tập huấn / khám sức khỏe cho người chế biến. Có thể ghi số giấy ở chân trang.
- [ ] **Đăng ký kinh doanh**: hộ kinh doanh hoặc hình thức phù hợp; thông tin người bán ở chân trang (tên, địa chỉ, SĐT, mã số thuế nếu có).
- [ ] **Website thương mại điện tử**: website có chức năng đặt món trực tuyến có thể thuộc diện phải **thông báo với Bộ Công Thương** (`online.gov.vn`). Kiểm tra điều kiện áp dụng với mô hình “gửi yêu cầu, tiệm gọi lại chốt, không thanh toán online”.
- [ ] **Dữ liệu cá nhân**: Chính sách bảo mật nêu dữ liệu thu thập, mục đích, thời gian lưu (mục 8), người được xem (nhân viên trong nhóm Telegram), cách yêu cầu xóa. Ô đồng ý ở form đặt món và liên hệ. Đối chiếu quy định bảo vệ dữ liệu cá nhân hiện hành.
- [ ] **Giá**: ghi rõ “giá tham khảo, giá cuối do tiệm xác nhận”; cập nhật giá trên web khi đổi giá tại quầy.
- [ ] **Dị ứng**: ghi chú thành phần dễ gây dị ứng (đậu phộng, gluten, trứng…) ở món có liên quan.
- [ ] **Thuế**: tìm hiểu nghĩa vụ kê khai thuế với hộ kinh doanh.

---

## 16. Cần xác nhận
1. Tiệm đã có giấy ATTP, đăng ký hộ kinh doanh, mã số thuế chưa? (Ảnh hưởng chân trang và thủ tục ở Phần IV.)
2. Tiệm đã có hồ sơ Google Maps chưa? Nếu có, gửi link để gắn vào `site.ts`.
3. Bật Google Analytics từ đầu? Mặc định: **có**.

---

## Nhật ký thay đổi

| Phiên bản | Ngày | Thay đổi |
|---|---|---|
| v2.0 | 2026-10-07 | Chuyển sang Bánh Mì Thanh Long: chống spam form đặt món/liên hệ, escape tin Telegram, SEO địa phương (Google Business Profile, `Restaurant`, `Menu`), bản đồ tải khi bấm, pháp lý ngành thực phẩm; bỏ phần thanh toán, VietQR, giỏ hàng |
| v1.1 | 2026-10-05 | (Lamora) |
