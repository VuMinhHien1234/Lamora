# 00 — MASTER PLAN: Lamora Flower

> **Vai trò của file này:** File gốc của dự án. Mọi file hướng dẫn (`01-…` đến `10-…`) được sinh từ đây. Khi một quyết định ở đây thay đổi, cập nhật các file con phụ thuộc (xem Phần G) và ghi vào Nhật ký thay đổi.
>
> **Ký hiệu:** 🔒 = quyết định bắt buộc, chủ shop đã xác nhận, đổi sẽ ảnh hưởng lớn · 🔧 = mặc định tự chọn, có thể đổi sau mà không phải làm lại nhiều.

---

## Trạng thái

| Mục | Giá trị |
|---|---|
| Phiên bản | v0.4 |
| Cập nhật | 2026-10-05 |
| Quyết định bắt buộc | Đã chốt |
| File con đã sinh | 10 / 10 ✅ |

---

## PHẦN A — Kinh doanh

| Mục | Quyết định | Loại |
|---|---|---|
| Tên thương hiệu | **Lamora Flower** | 🔒 |
| Mô hình | Shop cá nhân. Chủ shop vừa bán hàng vừa quản trị, **chỉ 1 tài khoản quản trị** | 🔒 |
| Khách hàng | Khách lẻ mua trang trí nhà và làm quà tặng | 🔧 |
| Khu vực giao | Toàn quốc | 🔧 |
| Ngôn ngữ / tiền tệ | Tiếng Việt / VND | 🔧 |
| Tên miền | Tạm dùng subdomain miễn phí của hosting. Nên mua `lamoraflower.vn` hoặc `.com` khi ra mắt (cần cho email gửi khách) | 🔧 |
| Quy mô ban đầu | Dưới 300 sản phẩm, dưới 50 đơn/ngày | 🔧 |

**Danh mục ban đầu** 🔧: Cành hoa lẻ · Bình hoa cắm sẵn · Giỏ & lẵng hoa · Hoa trang trí treo tường · Phụ kiện (bình, lọ, ruy băng). Thêm/sửa trong trang quản trị, không cần sửa code.

**Đặc thù sản phẩm** 🔧: biến thể màu sắc và kích thước · lời nhắn thiệp kèm đơn · ngày giao mong muốn · tùy chọn gói quà có phí. Chưa có giá sỉ.

---

## PHẦN B — Tính năng

**P0** = bản ra mắt (MVP) · **P1** = ngay sau MVP · **P2** = mở rộng sau

### B1. Website khách hàng
| Tính năng | Ưu tiên |
|---|---|
| Trang chủ: banner, sản phẩm nổi bật, bộ sưu tập theo dịp | P0 |
| Danh sách sản phẩm, lọc theo danh mục / màu / khoảng giá, sắp xếp | P0 |
| Tìm kiếm sản phẩm | P0 |
| Chi tiết sản phẩm: nhiều ảnh, chọn biến thể, mô tả, sản phẩm liên quan | P0 |
| Giỏ hàng (lưu trên trình duyệt) | P0 |
| Đặt hàng **không cần tài khoản** | P0 |
| Tra cứu đơn bằng mã đơn + số điện thoại | P0 |
| Nút chat Zalo / Messenger | P0 |
| Trang tĩnh: giới thiệu, đổi trả, vận chuyển, liên hệ, chính sách bảo mật | P0 |
| Mã giảm giá | P1 |
| Tài khoản khách hàng, lịch sử đơn | P2 |
| Đánh giá sản phẩm, yêu thích, blog | P2 |

### B2. Trang quản trị (chỉ chủ shop dùng)
| Tính năng | Ưu tiên |
|---|---|
| Đăng nhập quản trị | P0 |
| Quản lý sản phẩm, danh mục, biến thể, ảnh | P0 |
| Quản lý đơn hàng và trạng thái đơn | P0 |
| Xác nhận đã nhận chuyển khoản | P0 |
| Tồn kho theo biến thể, cảnh báo sắp hết | P1 |
| Banner trang chủ, mã giảm giá | P1 |
| Báo cáo doanh thu, sản phẩm bán chạy | P1 |
| In phiếu giao hàng | P1 |

### B3. Phân quyền 🔒
Một vai trò `ADMIN` duy nhất. Cột `role` vẫn có trong bảng người dùng để sau này thêm nhân viên mà không phải đổi cấu trúc dữ liệu.

### B4. Thanh toán 🔒
- COD (thanh toán khi nhận hàng)
- Chuyển khoản ngân hàng qua mã VietQR. Nội dung chuyển khoản là mã đơn, chủ shop xác nhận thủ công trong trang quản trị.
- Cổng VNPay / MoMo: P2, khi có giấy phép kinh doanh.

### B5. Vận chuyển 🔧
Phí ship theo vùng (nội thành Hà Nội / miền Bắc / miền Trung–Nam), miễn phí ship từ một mức giá trị đơn. Bảng phí nằm trong file cấu hình, sửa được. Chưa kết nối API hãng vận chuyển.

### B6. Thông báo 🔧
- Đơn mới → báo chủ shop qua **Telegram bot** (miễn phí, tức thì).
- Email xác nhận cho khách: P1, khi đã có tên miền riêng.

---

## PHẦN C — Thiết kế giao diện 🔧

| Mục | Mặc định |
|---|---|
| Phong cách | “Atelier lụa”: thanh lịch, sang trọng, nhiều khoảng trắng, ảnh sản phẩm là trọng tâm |
| Màu | Nền ngà · chữ nâu mực · điểm nhấn hồng đất, vàng mảnh, xanh xám (xem `03` mục 2) |
| Font | Cormorant Garamond (tiêu đề) + Be Vietnam Pro (nội dung), đều hỗ trợ đủ dấu tiếng Việt |
| Thiết bị | Ưu tiên điện thoại (mobile-first) |
| Ảnh | Tạm dùng ảnh mẫu, thay bằng ảnh thật trước khi ra mắt |

Chi tiết sẽ nằm ở `03-UI-DESIGN.md`.

---

## PHẦN D — Kỹ thuật

| Mục | Quyết định | Loại |
|---|---|---|
| Người viết code | **Chủ yếu do AI viết**, chủ shop review và chạy | 🔒 |
| Kiến trúc | **Next.js fullstack**: web khách, trang quản trị và API trong **một** dự án | 🔒 |
| Ngân sách hạ tầng | **Gần 0đ/tháng**, chỉ dùng gói miễn phí cho phép dùng thương mại | 🔒 |
| Ngôn ngữ | TypeScript | 🔧 |
| Database | PostgreSQL trên Neon (gói Free) | 🔧 |
| Hosting | Netlify (gói Free, 300 credits/tháng, cần giới hạn số lần deploy). Không dùng gói Hobby của Vercel vì gói đó cấm dùng thương mại. Phương án dự phòng ở `09` mục 2.2 | 🔧 |
| Lưu ảnh | Cloudinary (gói Free) | 🔧 |
| Đăng nhập admin | Better Auth (email + mật khẩu) | 🔧 |
| Quy tắc cho AI viết code | File `AGENTS.md` ở thư mục gốc dự án | 🔒 |

Toàn bộ chuẩn kỹ thuật, cấu trúc thư mục, quy tắc code: xem **`01-TECH-STANDARDS.md`**.

---

## PHẦN E — Yêu cầu phi chức năng 🔧
SEO cơ bản (URL thân thiện, meta, sitemap, dữ liệu cấu trúc sản phẩm) · trang tải dưới 3 giây trên 4G · HTTPS · chống spam đơn · sao lưu database định kỳ · Google Analytics.

---

## PHẦN F — Lộ trình

| Giai đoạn | Nội dung | Kết quả |
|---|---|---|
| 0. Xác nhận | Master plan + chuẩn kỹ thuật | v1.0 |
| 1. Thiết kế | Database, giao diện, server | File 02–04 được duyệt |
| 2. Nền tảng | Khởi tạo dự án, lint, CI, DB, đăng nhập admin | Chạy được local + có CI |
| 3. Quản trị P0 | Sản phẩm, danh mục, đơn hàng | Nhập được sản phẩm |
| 4. Web khách P0 | Các trang P0, luồng đặt hàng | Đặt được đơn thật |
| 5. Kiểm thử | Test luồng mua hàng, test trên điện thoại | Sửa hết lỗi nghiêm trọng |
| 6. Deploy | Netlify, Neon, tên miền, backup | Website chạy thật |
| 7. Mở rộng | P1, rồi P2 | Theo nhu cầu |

---

## PHẦN G — Danh sách file hướng dẫn

| File | Nội dung | Phụ thuộc |
|---|---|---|
| `01-TECH-STANDARDS.md` ✅ | Stack, cấu trúc source, quy tắc clean code, quy tắc cho AI | D |
| `02-DATABASE.md` ✅ | ERD, bảng, cột, quan hệ, index, dữ liệu mẫu | A, B, 01 |
| `03-UI-DESIGN.md` ✅ | Design system, wireframe từng trang | B1, B2, C |
| `04-SERVER-LAYER.md` ✅ | Server actions, route handlers, service, xác thực, validation | B, 01, 02 |
| `05-SHOP-PAGES.md` ✅ | Các trang khách, luồng giỏ hàng và đặt hàng | B1, B4, B5, 03, 04 |
| `06-ADMIN-PAGES.md` ✅ | Các màn hình quản trị, luồng xử lý đơn | B2, B3, 03, 04 |
| `07-PAYMENT-SHIPPING.md` ✅ | VietQR, phí ship, thông báo Telegram | B4–B6 |
| `08-SECURITY-SEO.md` ✅ | Checklist bảo mật, SEO, hiệu năng | E |
| `09-DEPLOYMENT.md` ✅ | Netlify, Neon, Cloudinary, tên miền, CI/CD, backup | D, E |
| `10-TESTING-CHECKLIST.md` ✅ | Kịch bản kiểm thử trước ra mắt | Tất cả |

| `AGENTS.md` ✅ | Quy tắc làm việc và lộ trình việc cho AI viết code (đặt ở thư mục gốc dự án, không nằm trong `docs/`) | Tất cả |

**Quy tắc sinh file con**
1. Đầu mỗi file ghi: “Dựa trên 00-MASTER-PLAN.md v… và 01-TECH-STANDARDS.md v…”.
2. Chỉ chi tiết hóa tính năng P0; P1/P2 ghi điểm mở rộng.
3. Cuối mỗi file có mục “Cần xác nhận”.

---

## PHẦN H — Câu hỏi còn mở (tổng hợp từ mục “Cần xác nhận” của các file)

Câu nào chưa trả lời thì AI dùng **mặc định** ở cột cuối. Trả lời xong thì sửa file gốc và đánh dấu ✅ ở đây.

### H1. Cần trả lời trước khi bắt đầu code
| # | Câu hỏi | File | Mặc định |
|---|---|---|---|
| 1 | Đã có tài khoản GitHub chưa? | 01 | Tạo mới, repository private |
| 2 | Dùng công cụ AI nào để viết code? | 01 | Claude Code (đọc `CLAUDE.md` → `AGENTS.md`) |
| 3 | Comment trong code bằng tiếng Việt hay tiếng Anh? | 01 | Tiếng Việt |

### H2. Cần trả lời trước khi dựng giao diện (bước G1/F1)
| # | Câu hỏi | File | Mặc định |
|---|---|---|---|
| 4 | Đồng ý hướng “Atelier lụa” (ngà, nâu mực, hồng đất, vàng mảnh)? | 03 | Đồng ý |
| 5 | Website/Instagram tham khảo phong cách | 03 | Không có |
| 6 | Logo | 03 | Logo chữ tạm (`03` mục 5.2) |

### H3. Có mặc định, đổi được sau
| # | Câu hỏi | File | Mặc định |
|---|---|---|---|
| 7 | Phí gói quà | 02 | 20.000₫ |
| 8 | Dùng danh mục cấp con? | 02 | Hỗ trợ sẵn, ban đầu chỉ dùng 1 cấp |
| 9 | Bán khi hết hàng (đặt trước)? | 02 | Không |
| 10 | Bảng phí ship, mức miễn phí ship | 04, 07 | 25k / 35k / 40k; miễn phí từ 800.000₫ |
| 11 | Tự hủy đơn chuyển khoản chưa trả? | 04 | Không, hủy thủ công |
| 12 | Khách tự hủy đơn? | 04 | Không, nhắn Zalo cho shop |
| 13 | Nút “Mua ngay” | 05 | Có |
| 14 | Thông báo đơn mới trên trình duyệt (admin) | 06 | Không, dùng Telegram |
| 15 | Xuất đơn ra Excel | 06 | P1 |
| 16 | Bật Google Analytics | 08 | Có |

### H4. Cần trước ngày ra mắt
| # | Câu hỏi | File |
|---|---|---|
| 17 | Ngân hàng, tên chủ tài khoản nhận chuyển khoản (chỉ nhập vào biến môi trường) | 07 |
| 18 | Phí ship có khớp đơn vị vận chuyển thực tế? | 07 |
| 19 | Đăng ký hộ kinh doanh / mã số thuế (thông tin chân trang, thủ tục Bộ Công Thương) | 08 |
| 20 | Tên miền `.vn` hay `.com` | 09 |
| 21 | Nơi lưu bản sao lưu hằng tuần (Google Drive) | 09 |
| 22 | Nội dung 5 trang chính sách (đổi trả mặc định 7 ngày) | 05 |

---

## Nhật ký thay đổi

| Phiên bản | Ngày | Thay đổi |
|---|---|---|
| v0.1 | 2026-10-05 | Bản nháp đầu |
| v0.4 | 2026-10-05 | Rà soát toàn bộ: đổi đăng nhập sang Better Auth, cập nhật theo Next.js 16 / Prisma 7, thêm nhánh `develop` để tiết kiệm credits Netlify, sửa ràng buộc biến thể, thêm feature `media`, `queries.ts`, trang UI kit. Thêm Phần H tổng hợp câu hỏi mở. Thêm `AGENTS.md` |
| v0.3 | 2026-10-05 | Hoàn tất 10 file con. Cập nhật phần C theo `03`, ghi chú giới hạn credits Netlify. Cập nhật `01` v1.1, `02` v1.1, `04` v1.1, `05` v1.1 theo `03`, `07`, `08`, `09` |
| v0.2 | 2026-10-05 | Chốt tên Lamora Flower, 1 admin, AI viết code, Next.js fullstack, ngân sách ~0đ, COD + VietQR. Điền các mặc định 🔧. Thêm `01-TECH-STANDARDS.md`, đánh số lại file con |
