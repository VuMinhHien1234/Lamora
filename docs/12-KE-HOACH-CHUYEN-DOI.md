# 12 — KẾ HOẠCH CHUYỂN ĐỔI: Từ code Lamora Flower sang Bánh Mì Thanh Long

> Dựa trên `00-MASTER-PLAN.md` v1.0 và `01-TECH-STANDARDS.md` v2.0 · Phiên bản: v1.0 · 2026-10-07
>
> Code Lamora Flower đã viết xong phần lớn P0 (368 unit test, E2E xanh — `_ban-cu-lamora-flower/10-KET-QUA-KIEM-TRA.md`). File này chỉ cách **tận dụng nền tảng đó** thay vì viết lại từ đầu: giữ phần dùng chung, sửa phần thực đơn, gỡ phần bán hàng, thêm phần đặt món qua Telegram.
>
> **Nguyên tắc:** mỗi bước là một nhánh + một Pull Request; sau mỗi bước `pnpm lint && pnpm typecheck && pnpm test && pnpm build` phải xanh. Không làm nhiều bước trong một lần giao việc cho AI.

---

## 1. Bảng giữ / sửa / bỏ / thêm

> Tên file dưới đây theo cấu trúc trong `01` cũ. Đường dẫn thực tế có thể lệch đôi chút — AI kiểm tra bằng cách đọc repo trước khi làm.

### 1.1 Giữ nguyên (chỉ đổi tên thương hiệu nếu có)
| Phần | Ghi chú |
|---|---|
| Cấu hình dự án: Next.js, TypeScript, Tailwind, ESLint (kể cả quy tắc phụ thuộc), Prettier, Husky, commitlint, Vitest, Playwright | |
| `lib/`: `db`, `env`, `errors`, `result`, `money`, `slug`, `logger`, `rate-limit`, `markdown`, `utils` | `env.ts` bỏ `BANK_*` |
| `features/auth` + Better Auth, `proxy.ts`, `requireAdmin()`, đổi mật khẩu | |
| `features/media` | Đổi thư mục `lamora/` → `thanhlong/`, thêm folder `site` |
| `features/dashboard` → `checkHealth`, `/api/health` | |
| `/api/cron/cleanup`, `lib/telegram.ts` | |
| `components/ui` (Button, Input, Accordion, Drawer, Toast, Skeleton, EmptyState, CopyButton, Badge…) | Đổi token ở bước 8 |
| Admin: layout M0, đăng nhập M1, tài khoản, `ui-kit`, `DataTable`, `ImageUploader`, `SlugInput`, `ConfirmDialog` | |
| `StaticPageLayout`, `src/content/` | Thay nội dung |
| Workflow `ci`, `e2e`, `backup`, `cron`, `dependabot`, `netlify.toml` | `health.yml` → `monitor.yml` |

### 1.2 Sửa
| Phần | Thay đổi |
|---|---|
| `features/product` | `ProductVariant` → `ProductOption` (bỏ màu, cỡ, SKU, tồn kho, giá gốc); bỏ `searchText`, `generateSku`, lọc màu/giá, phân trang khách; thêm `tags`, `ingredients`, `allergyNote`, `isAvailable`, `sortOrder`, `setProductAvailability`, `getMenu`, `getOrderableOptions`; `ProductImage` bỏ `variantId` |
| `features/category` | Bỏ `parentId`, SEO riêng, kiểm tra vòng cây |
| `features/notification` | Mẫu tin mới (`07` mục 4); bỏ `notifyNewOrder` |
| `features/dashboard` | `getAdminSummary` theo `04` mục 9 |
| `config/site.ts` | Thông tin tiệm, `OPENING_HOURS` (`05` mục 2) |
| `config/admin-nav.ts` | Menu mới (`06` mục 2) |
| Admin M5/M6 sản phẩm → M6/M7 món | Bảng biến thể → bảng lựa chọn & giá; công tắc “Tạm hết” |
| Header, Footer, nút chat nổi | Theo `05` mục 2 (thêm `OpenStatus`, nút Gọi, Telegram) |
| `globals.css`, font | Token “Lò bánh phố” (`03`) |
| `prisma/schema.prisma`, `seed.ts` | Theo `02` v2.0 |
| `AGENTS.md`, `CLAUDE.md`, `README.md`, `package.json#name` | Theo `01` mục 13 |

### 1.3 Gỡ bỏ
| Nhóm | Gồm |
|---|---|
| Giỏ hàng | `features/cart`, `/gio-hang`, `MiniCartDrawer`, `CartButton`, `FreeShippingProgress` |
| Thanh toán | `features/payment`, `BankTransferBox`, `config/banks.ts`, biến `BANK_*` |
| Vận chuyển | `features/shipping`, `config/shipping.ts`, `config/address/` (dữ liệu tỉnh/xã), `config/inventory.ts` |
| Đơn hàng | `features/order` (kể cả `admin-*.ts`), `/thanh-toan`, `/dat-hang-thanh-cong`, `/tra-cuu-don`, `/admin/don-hang`, `OrderStatusTimeline`, cookie `lamora_order` |
| Bộ sưu tập | `features/collection`, `/bo-suu-tap`, `/admin/bo-suu-tap`, `ProductPicker` |
| Danh sách sản phẩm cũ | `/san-pham`, `/san-pham/[slug]`, `/danh-muc/[slug]`, `/tim-kiem` (tìm kiếm làm lại ở P1 nếu cần), `ProductFilters`, `ProductSort`, `ActiveFilterChips`, `Pagination` |
| Component chỉ dùng cho hoa | `ColorSwatch`, `SizeOption`, `AnnouncementBar` bản cũ (viết lại đơn giản) |
| Trang tĩnh | `chinh-sach-doi-tra`, `chinh-sach-van-chuyen` |
| Test | Unit test và E2E của các phần trên (xóa **cùng commit** với code của nó) |

### 1.4 Thêm mới
| Phần | Theo |
|---|---|
| `lib/phone.ts` (tách hàm chuẩn hóa SĐT từ `order` cũ), `config/ordering.ts`, `isWithinOpeningHours` | `04` K4 |
| `features/order-request` + bảng `OrderRequest*` | `04` mục 6 |
| `features/contact` + bảng `ContactMessage` | `04` mục 7 |
| `/api/cron/telegram-retry`, `monitor.yml` | `07` mục 5 |
| Trang `/thuc-don`, `/thuc-don/[slug]`, `/mon/[slug]`, `/dat-mon`, `/dat-mon/da-gui`, `/lien-he` (có form) | `05` |
| Admin `/admin/yeu-cau`, `/admin/lien-he` | `06` |
| JSON-LD `Restaurant`, `Menu` | `08` mục 11 |

---

## 2. Thứ tự thực hiện

| Bước | Nhánh | Việc | Kiểm tra xong |
|---|---|---|---|
| **0** | — | Tạo repo private `banh-mi-thanh-long` từ code Lamora (clone → đổi remote → push), giữ repo cũ nguyên vẹn. Chép bộ `docs/` mới. Cập nhật `AGENTS.md`, `CLAUDE.md`, `README.md`, `package.json#name` | Repo mới có CI chạy (vẫn xanh vì chưa đổi code) |
| **1** | `chore/rebrand` | Đổi thương hiệu: `config/site.ts`, metadata, logo chữ tạm, mọi chuỗi “Lamora” hiển thị, thư mục Cloudinary, tên cookie | CI xanh; trang chủ hiện “Bánh Mì Thanh Long” |
| **2** | `chore/remove-commerce` | Gỡ theo **thứ tự**, mỗi nhóm một commit: (a) trang + feature thanh toán & tra cứu đơn; (b) đơn hàng (khách + admin); (c) giỏ hàng; (d) vận chuyển & địa chỉ; (e) bộ sưu tập; (f) danh sách sản phẩm cũ & tìm kiếm; (g) component chỉ dùng cho hoa; (h) biến `BANK_*`. Tạm để trang chủ hiện món nổi bật bằng query cũ | CI xanh sau **mỗi** commit; `pnpm build` không còn import hỏng |
| **3** | `feat/schema-v2` | Tạo **Neon project mới**. Thay `schema.prisma` theo `02` v2.0. Vì DB mới chưa có dữ liệu thật: xóa thư mục migration cũ, tạo **một migration khởi tạo** + SQL bổ sung (`01` mục 12.4). Viết lại `seed.ts` | `prisma migrate dev` chạy sạch; Prisma Studio thấy dữ liệu mẫu |
| **4** | `refactor/product-options` | `product`: variant → option, các trường mới, `setProductAvailability`, `getMenu`, `getOrderableOptions`; `category` bỏ cấp con. Sửa test tương ứng | Unit test mới qua |
| **5** | `feat/admin-menu` | Admin M6/M7 món (bảng lựa chọn & giá, công tắc Tạm hết), M8 danh mục | Nhập được thực đơn thật trên preview |
| **6** | `feat/order-request` | `lib/phone.ts`, `config/ordering.ts`, giờ mở cửa; `order-request` backend; mẫu tin Telegram; `telegram-retry`; admin M3/M4 | Test 6.3 đủ ca; gửi yêu cầu bằng test → có bản ghi + tin (mock) |
| **7** | `feat/shop-pages` | Trang khách theo `05` thứ tự F1→F8; `contact` + admin M5; M2 tổng quan; JSON-LD, sitemap, robots | Gửi yêu cầu thật trên preview (nhóm Telegram thử) |
| **8** | `style/banh-mi-theme` | Token, font, component theo `03`; duyệt `/admin/ui-kit` | Chủ tiệm duyệt trên điện thoại |
| **9** | `test/e2e-v2` | E2E mới (`01` mục 11); dọn sót: tìm `Lamora`, `LMR`, `vietqr`, `variant`, `cart`, `shipping`, `gio-hang`, `thanh-toan` trong `src/`, `tests/`, `prisma/` → 0 kết quả (trừ migration lịch sử nếu còn) | `10` mục 1 xanh |
| **10** | — | Theo `11-HUONG-DAN-TRIEN-KHAI.md` để deploy; `10` mục 9 ngày ra mắt | Website chạy thật |

> Có thể làm bước 8 (giao diện) sớm hơn, ngay sau bước 2, nếu muốn xem “cảm giác” mới trước. Không làm song song với bước 4–7 trong cùng một nhánh.

---

## 3. Dữ liệu và tài khoản

| Hạng mục | Quyết định mặc định |
|---|---|
| Database | **Neon project mới**. Không chuyển dữ liệu Lamora |
| Cloudinary | Dùng lại tài khoản được, thư mục mới `thanhlong/`. Ảnh hoa cũ không dùng |
| Netlify | Site mới |
| Telegram | Bot mới + nhóm mới “Thanh Long – Đặt món” (không dùng bot Lamora) |
| GitHub Secrets | Tạo lại trong repo mới |
| Repo Lamora | Giữ nguyên, có thể chuyển sang Archived |

---

## 4. Mẫu giao việc cho AI (copy dùng lại)

```
Đọc AGENTS.md và docs/12-KE-HOACH-CHUYEN-DOI.md.
Làm BƯỚC 2(b): gỡ phần đơn hàng (khách + admin) theo mục 1.3.
- Chỉ gỡ đúng nhóm này, xóa test của nó cùng commit.
- Không sửa feature khác ngoài việc bỏ import hỏng.
- Chạy pnpm lint && pnpm typecheck && pnpm test && pnpm build đến khi xanh.
- Liệt kê file đã xóa/sửa và đề xuất commit message.
```

---

## 5. Rủi ro và cách tránh

| Rủi ro | Cách tránh |
|---|---|
| Xóa nhầm code dùng chung (ví dụ hàm chuẩn hóa SĐT nằm trong `order`) | Trước bước 2(b), tách hàm cần giữ sang `lib/` ở commit riêng |
| ESLint quy tắc phụ thuộc báo lỗi hàng loạt khi đổi tên feature | Cập nhật cấu hình boundaries cùng commit với việc thêm/xóa feature |
| Test E2E cũ hỏng làm CI đỏ | Xóa E2E của luồng mua hàng ở bước 2; E2E mới ở bước 9; giữa chừng chỉ chạy E2E admin đăng nhập |
| Quên biến môi trường cũ trên Netlify | Site Netlify mới, nhập biến theo `01` mục 14 |
| Lẫn thương hiệu (còn chữ “Lamora”) | Bước 9 tìm toàn văn; checklist `10` mục 1 |

---

## 6. Cần xác nhận
1. Tạo repo mới (mặc định) hay đổi tên repo Lamora?
2. Muốn xem giao diện mới (bước 8) trước khi làm logic không?

---

## Nhật ký thay đổi

| Phiên bản | Ngày | Thay đổi |
|---|---|---|
| v1.0 | 2026-10-07 | Bản đầu tiên |
