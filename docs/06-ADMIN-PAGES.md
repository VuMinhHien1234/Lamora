# 06 — ADMIN PAGES: Các màn hình trang quản trị

> Dựa trên `00-MASTER-PLAN.md` v1.0, `01-TECH-STANDARDS.md` v2.0, `02-DATABASE.md` v2.0, `03-UI-DESIGN.md` v2.0, `04-SERVER-LAYER.md` v2.0 · Phiên bản: v2.0 · 2026-10-07
>
> Thư mục code: `src/app/admin/`. Chỉ 1 người dùng là chủ tiệm. Mọi trang (trừ đăng nhập) được bảo vệ bằng `proxy.ts` **và** `requireAdmin()`. Trang admin `noindex`.
>
> Telegram là nơi chủ tiệm **nhận** yêu cầu; trang admin là nơi **quản lý thực đơn** và **xem lại / lưu vết** yêu cầu. Ưu tiên dùng tốt trên **điện thoại**.

---

## 1. Tổng hợp màn hình

| # | Màn hình | Đường dẫn | Ưu tiên | So với Lamora |
|---|---|---|---|---|
| M0 | Khung quản trị | layout `admin` | P0 | Đổi menu |
| M1 | Đăng nhập | `/admin/login` | P0 | Giữ |
| M2 | Tổng quan | `/admin` | P0 | Sửa nội dung |
| M3 | Yêu cầu đặt món | `/admin/yeu-cau` | P0 | Thay “Đơn hàng” |
| M4 | Chi tiết yêu cầu | `/admin/yeu-cau/[id]` | P0 | Thay “Chi tiết đơn” |
| M5 | Tin liên hệ | `/admin/lien-he` | P0 | Mới |
| M6 | Danh sách món | `/admin/mon` | P0 | Sửa từ “Sản phẩm” |
| M7 | Thêm / sửa món | `/admin/mon/moi`, `/admin/mon/[id]` | P0 | Sửa: biến thể → lựa chọn giá |
| M8 | Danh mục | `/admin/danh-muc` | P0 | Giữ, bỏ cấp con |
| M9 | Tài khoản | `/admin/tai-khoan` | P0 | Giữ |
| M10 | UI kit | `/admin/ui-kit` | P0 | Cập nhật theo `03` |
| M11 | Thông tin tiệm (giờ mở cửa, SĐT, banner) | `/admin/thong-tin-tiem` | P1 | Mới |
| M12 | Thống kê | `/admin/thong-ke` | P1 | |

**Đã bỏ:** bộ sưu tập, tồn kho, in phiếu giao hàng, mã giảm giá, banner riêng (gộp vào M11).

---

## 2. M0 — Khung quản trị

| Thành phần | Mô tả |
|---|---|
| `AdminSidebar` | Tổng quan · Yêu cầu đặt món (số yêu cầu Mới) · Tin liên hệ (số chưa xử lý) · Món · Danh mục · Tài khoản · “Xem website” · Đăng xuất. Điện thoại: menu trượt + thanh tab dưới đáy cho 3 mục dùng nhiều nhất (Yêu cầu · Món · Tổng quan) |
| `AdminTopbar` | Tiêu đề trang, nút hành động chính |
| `Toast`, `ConfirmDialog` | Giữ |

Cấu hình menu ở `src/config/admin-nav.ts` (giữ cơ chế `ready`).

---

## 3. M1 — Đăng nhập
Giữ nguyên bản cũ: lỗi chung, khóa tạm, bắt đổi mật khẩu lần đầu.

---

## 4. M2 — Tổng quan

| Khối | Nội dung | API |
|---|---|---|
| `StatCards` | Yêu cầu mới · Yêu cầu hôm nay · Tin liên hệ chưa xử lý · **Chưa gửi được Telegram** (chỉ hiện khi > 0, màu `warning-700`) | `getAdminSummary` |
| `NewRequestsList` | 5 yêu cầu mới nhất, bấm mở M4; nút gọi nhanh | `adminListOrderRequests` |
| `SoldOutToggles` | Danh sách món đang bán với công tắc **“Tạm hết”** — chỗ chủ tiệm dùng mỗi ngày | `setProductAvailability` |
| `TopItems` | 5 món được đặt nhiều nhất 7 ngày | `getAdminSummary` |

---

## 5. M3 — Danh sách yêu cầu đặt món

| Thành phần | Mô tả | API |
|---|---|---|
| `RequestStatusTabs` | Tất cả · Mới · Đã liên hệ · Hoàn tất · Đã hủy, kèm số lượng | `adminListOrderRequests` |
| `RequestFilters` | Tìm theo mã (có/không dấu gạch), SĐT, tên; lọc theo ngày | |
| `RequestTable` | Mã, thời gian gửi, khách + SĐT, số phần, tạm tính, cách nhận, giờ muốn nhận, trạng thái, biểu tượng ⚠ nếu chưa gửi Telegram | |
| `QuickActions` | Trên mỗi dòng: **Gọi** (`tel:`), **Zalo** (theo SĐT), “Đã liên hệ” (với yêu cầu Mới) | `updateOrderRequestStatus` |

Bộ lọc trên URL. Yêu cầu hẹn giờ trong 2 giờ tới được đánh dấu nổi bật. Mặc định mở tab “Mới”.

---

## 6. M4 — Chi tiết yêu cầu

| Khối | Nội dung | API |
|---|---|---|
| `RequestHeader` | Mã, thời gian gửi, `StatusBadge`, nhãn “Gửi ngoài giờ” nếu có | `adminGetOrderRequest` |
| `CustomerCard` | Tên, SĐT (nút Gọi, Zalo, sao chép) | |
| `ReceiveCard` | Lấy tại quầy / Giao tận nơi + địa chỉ (sao chép, mở Google Maps), giờ muốn nhận | |
| `ItemsTable` | Món, lựa chọn, đơn giá lúc gửi, số lượng, thành tiền; tạm tính | |
| `CustomerNote` | Ghi chú của khách, nổi bật | |
| `StatusActions` | Chỉ hiện nút hợp lệ: “Đã liên hệ & chốt”, “Hoàn tất”, “Hủy” (bắt buộc lý do: không liên lạc được / khách hủy / spam / khác) | `updateOrderRequestStatus` |
| `AdminNoteEditor` | Ghi chú nội bộ (giá chốt, phí giao…) | `updateOrderRequestNote` |
| `TelegramStatus` | “Đã gửi Telegram lúc …” hoặc “Chưa gửi được” + nút “Gửi lại” | `resendOrderRequestTelegram` |
| `StatusHistory` | Dòng thời gian, ghi nguồn (Admin / Telegram) | |

Điện thoại: 1 cột, thanh thao tác (Gọi · Đổi trạng thái) dính đáy.

---

## 7. M5 — Tin liên hệ
Danh sách thẻ: tên, SĐT (Gọi/Zalo), nội dung, thời gian, trạng thái; nút “Đã xử lý”, “Gửi lại Telegram”. Tab Chưa xử lý / Đã xử lý. API: `adminListContactMessages`, `markContactHandled`, `resendContactTelegram`.

---

## 8. M6 — Danh sách món

| Thành phần | Mô tả | API |
|---|---|---|
| `ProductStatusTabs` | Tất cả · Đang bán · Nháp · Ngừng bán | `adminListProducts` |
| `ProductFilters` | Tìm theo tên, lọc danh mục, lọc “Đang tạm hết” | |
| `ProductTable` | Ảnh, tên, danh mục, giá từ, số lựa chọn, trạng thái, **công tắc Tạm hết** ngay trên dòng | `setProductAvailability` |
| `RowActions` | Sửa · Xem trên web · Đổi trạng thái · ↑↓ sắp xếp trong danh mục | `setProductStatus`, `reorderProducts` |

---

## 9. M7 — Thêm / sửa món

Một trang, chia khối; nút “Lưu” dính đầu trang. Tạo mới luôn ở **Nháp**.

| Khối | Trường / chức năng | API |
|---|---|---|
| 1. Thông tin chung | Tên*, Slug, Danh mục*, Mô tả ngắn, Mô tả chi tiết, Thành phần, Lưu ý dị ứng, Nhãn (Bán chạy / Món mới / Cay / Chay), Nổi bật trang chủ | `createProduct`, `updateProduct` |
| 2. Lựa chọn & giá | Bảng sửa trực tiếp: Tên lựa chọn (để trống nếu chỉ 1 giá), Giá*, Bật/tắt, thứ tự. Nút “+ Thêm lựa chọn” | `upsertOptions` |
| 3. Ảnh | Kéo thả, sắp xếp (ảnh đầu là ảnh đại diện), sửa alt, xóa. Bỏ gắn ảnh theo màu | `getImageUploadSignature({ folder: 'products' })`, `saveProductImages`, `updateProductImages` |
| 4. SEO | Tiêu đề, mô tả, xem trước Google | `updateProduct` |
| `PublishPanel` | Trạng thái + “Đăng lên thực đơn” / “Về nháp” / “Ngừng bán” + công tắc “Tạm hết hôm nay” | `setProductStatus`, `setProductAvailability` |

Quy tắc giữ như bản cũ: hỏi lại khi rời trang chưa lưu; nén ảnh > 5 MB trước khi upload; lỗi trùng hiện tại ô.

---

## 10. M8 — Danh mục
Một trang, thêm/sửa trong hộp thoại. Danh sách phẳng, nút ↑↓ sắp xếp, số món, bật/tắt. Form: Tên*, Slug, Mô tả, Ảnh. Chỉ xóa khi không còn món.

---

## 11. M9 — Tài khoản
Giữ nguyên: tên, email, đổi mật khẩu.

---

## 12. Màn hình P1

| # | Màn hình | Ý chính |
|---|---|---|
| M11 | Thông tin tiệm | Sửa địa chỉ, SĐT, giờ mở cửa, link Zalo/Telegram/Maps, dải thông báo, ảnh lớn trang chủ (bảng `ShopSetting`, `Banner`) — thay việc sửa `config/site.ts` |
| M12 | Thống kê | Số yêu cầu theo ngày, tỉ lệ hoàn tất/hủy, món được đặt nhiều, khung giờ đặt nhiều |

---

## 13. Thứ tự code đề xuất

| Bước | Việc | Phụ thuộc (`04` mục 12) |
|---|---|---|
| G1 | M0 menu mới + M10 UI kit theo token mới | `03` |
| G2 | M8 Danh mục (gỡ cấp con) | K3 |
| G3 | M6 + M7 (lựa chọn & giá, công tắc Tạm hết) | K2 |
| G4 | M3 + M4 Yêu cầu đặt món | K7 |
| G5 | M5 Tin liên hệ | K8 |
| G6 | M2 Tổng quan | K9 |
| G7 | E2E: đăng nhập → bật Tạm hết → thấy yêu cầu → đổi trạng thái | Tất cả |

G2–G3 làm **trước** web khách để chủ tiệm nhập thực đơn thật song song.

---

## 14. Cần xác nhận
1. Có cần trang admin hiện thông báo/tiếng “ting” khi có yêu cầu mới lúc đang mở không? Mặc định: **không**, dùng Telegram.
2. Ngoài chủ tiệm có nhân viên cần xem yêu cầu không? Nếu có: thêm họ vào **nhóm Telegram** (không cần tài khoản admin) — xem `07` mục 3.

---

## Nhật ký thay đổi

| Phiên bản | Ngày | Thay đổi |
|---|---|---|
| v2.0 | 2026-10-07 | Viết lại cho Bánh Mì Thanh Long: yêu cầu đặt món, tin liên hệ, công tắc “Tạm hết”, lựa chọn & giá; bỏ đơn hàng, thanh toán, bộ sưu tập, tồn kho, in phiếu, mã giảm giá |
| v1.1 | 2026-10-05 | (Lamora) |
