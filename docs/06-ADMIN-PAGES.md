# 06 — ADMIN PAGES: Các màn hình trang quản trị

> Dựa trên `00-MASTER-PLAN.md` v0.2, `01-TECH-STANDARDS.md` v1.0, `02-DATABASE.md` v1.0, `03-UI-DESIGN.md` v1.0, `04-SERVER-LAYER.md` v1.2 · Phiên bản: v1.1 · 2026-10-05
>
> Thư mục code: `src/app/admin/`. Chỉ 1 người dùng là chủ shop. Mọi trang (trừ đăng nhập) được bảo vệ bằng `proxy.ts` **và** `requireAdmin()` ở server. Trang admin đặt `noindex`.
>
> Ưu tiên dùng tốt trên **điện thoại**, vì chủ shop thường xử lý đơn khi đang di chuyển: bảng chuyển thành danh sách thẻ ở màn hình nhỏ.

---

## 1. Tổng hợp màn hình

| # | Màn hình | Đường dẫn | Ưu tiên |
|---|---|---|---|
| M0 | Khung quản trị (menu, thanh trên) | layout `admin` | P0 |
| M1 | Đăng nhập | `/admin/login` | P0 |
| M2 | Tổng quan | `/admin` | P0 |
| M3 | Danh sách đơn hàng | `/admin/don-hang` | P0 |
| M4 | Chi tiết đơn hàng | `/admin/don-hang/[id]` | P0 |
| M5 | Danh sách sản phẩm | `/admin/san-pham` | P0 |
| M6 | Thêm / sửa sản phẩm | `/admin/san-pham/moi`, `/admin/san-pham/[id]` | P0 |
| M7 | Danh mục | `/admin/danh-muc` | P0 |
| M8 | Danh sách bộ sưu tập | `/admin/bo-suu-tap` | P0 |
| M9 | Chi tiết bộ sưu tập | `/admin/bo-suu-tap/[id]` | P0 |
| M10 | Tài khoản | `/admin/tai-khoan` | P0 |
| M16 | Bộ component (UI kit) | `/admin/ui-kit` | P0 — dùng để duyệt giao diện (`03` mục 12) |
| M11 | In phiếu giao hàng | `/admin/don-hang/[id]/in` | P1 |
| M12 | Tồn kho | `/admin/ton-kho` | P1 |
| M13 | Banner trang chủ | `/admin/banner` | P1 |
| M14 | Mã giảm giá | `/admin/ma-giam-gia` | P1 |
| M15 | Báo cáo | `/admin/bao-cao` | P1 |

---

## 2. M0 — Khung quản trị

| Thành phần | Mô tả |
|---|---|
| `AdminSidebar` | Tổng quan · Đơn hàng (số đơn chờ xác nhận) · Sản phẩm · Danh mục · Bộ sưu tập · Tài khoản · “Xem website” · Đăng xuất. Trên điện thoại thành menu trượt |
| `AdminTopbar` | Tiêu đề trang, nút hành động chính của trang (ví dụ “+ Thêm sản phẩm”) |
| `Toast` | Thông báo thành công/lỗi sau mỗi thao tác |
| `ConfirmDialog` | Hỏi lại trước thao tác khó hoàn tác: hủy đơn, xóa, ngừng bán |

**Component dùng chung cho admin**: `DataTable` (tự chuyển thành thẻ trên điện thoại), `StatusBadge` (màu riêng cho từng trạng thái đơn/sản phẩm), `MoneyText`, `EmptyState`, `ImageUploader`, `SlugInput` (tự sinh từ tên, sửa được).

---

## 3. M1 — Đăng nhập

| Thành phần | Mô tả | API |
|---|---|---|
| `LoginForm` | Email, mật khẩu, nút đăng nhập | Better Auth (`/api/auth/[...all]`) |

Sai thông tin → “Email hoặc mật khẩu không đúng” (không nói rõ sai cái nào). Bị khóa tạm → báo thời gian chờ. Đăng nhập xong → về trang đang định mở hoặc M2. Lần đầu đăng nhập (`mustChangePassword = true`) → bắt buộc đổi mật khẩu ở M10 trước khi dùng các trang khác.

---

## 4. M2 — Tổng quan

| Khối | Nội dung | API |
|---|---|---|
| `StatCards` | Đơn chờ xác nhận · Đơn chuyển khoản chưa thanh toán · Doanh thu hôm nay · Doanh thu 7 ngày | `getAdminSummary` |
| `PendingOrdersList` | 5 đơn chờ xác nhận mới nhất, bấm vào mở M4 | `adminListOrders` |
| `LowStockList` | Biến thể còn ≤ 3, bấm vào mở M6 | `getAdminSummary` |

Mỗi thẻ số liệu bấm vào được, dẫn tới M3 đã lọc sẵn.

---

## 5. M3 — Danh sách đơn hàng

| Thành phần | Mô tả | API |
|---|---|---|
| `OrderStatusTabs` | Tất cả · Chờ xác nhận · Đã xác nhận · Đang giao · Đã giao · Đã hủy · Hoàn hàng, kèm số lượng | `adminListOrders` |
| `OrderFilters` | Tìm theo mã đơn/SĐT/tên; lọc thanh toán (Chưa/Đã), phương thức (COD/CK), khoảng ngày | |
| `OrderTable` | Mã đơn, thời gian, khách + SĐT, số sản phẩm, tổng tiền, thanh toán, trạng thái, ngày muốn nhận | |
| `QuickActions` | Trên mỗi dòng: “Xác nhận” (đơn chờ), “Đã nhận tiền” (CK chưa trả) | `updateOrderStatus`, `markOrderPaid` |

Bộ lọc nằm trên URL. Đơn có ngày muốn nhận trong 2 ngày tới được đánh dấu nổi bật.

---

## 6. M4 — Chi tiết đơn hàng

Bố cục: máy tính 2 cột (trái: nội dung đơn, phải: thao tác); điện thoại 1 cột, thanh thao tác dính dưới đáy.

| Khối | Nội dung | API |
|---|---|---|
| `OrderHeader` | Mã đơn, thời gian đặt, `StatusBadge` trạng thái và thanh toán | `adminGetOrder` |
| `OrderItemsTable` | Ảnh, tên, biến thể, SKU, đơn giá, số lượng, thành tiền (giá **lúc đặt**) | |
| `OrderTotals` | Tạm tính, ship, gói quà, giảm giá, tổng | |
| `CustomerCard` | Người đặt: tên, SĐT (bấm để gọi), email, link Zalo theo SĐT | |
| `ShippingCard` | Người nhận, địa chỉ đầy đủ (nút sao chép), ngày muốn nhận, đơn vị vận chuyển, mã vận đơn. Nút “Sửa” khi đơn còn chờ/đã xác nhận | `updateOrderShippingInfo` |
| `GiftCard` | Lời nhắn thiệp, gói quà (chỉ hiện nếu là quà tặng) | |
| `CustomerNote` | Ghi chú của khách | |
| `StatusActions` | Chỉ hiện nút cho bước chuyển hợp lệ. Chuyển sang “Đang giao” mở hộp nhập đơn vị vận chuyển + mã vận đơn | `updateOrderStatus` |
| `PaymentActions` | “Xác nhận đã nhận tiền” (đơn CK chưa trả) | `markOrderPaid` |
| `CancelOrderButton` | Bắt buộc nhập lý do | `cancelOrder` |
| `AdminNoteEditor` | Ghi chú nội bộ, tự lưu | `updateAdminNote` |
| `StatusHistory` | Dòng thời gian thay đổi trạng thái | |

---

## 7. M5 — Danh sách sản phẩm

| Thành phần | Mô tả | API |
|---|---|---|
| `ProductStatusTabs` | Tất cả · Đang bán · Nháp · Ngừng bán | `adminListProducts` |
| `ProductFilters` | Tìm theo tên/SKU, lọc danh mục, “Sắp hết hàng” | |
| `ProductTable` | Ảnh, tên, danh mục, giá từ, tổng tồn kho, số biến thể, trạng thái, ngày cập nhật | |
| `RowActions` | Sửa · Xem trên web · Đổi trạng thái | `setProductStatus` |

Ghi chú triển khai (3b): bộ lọc, tab trạng thái và số trang nằm trên địa chỉ (`?q=&status=&categoryId=&lowStock=1&page=`) nên tải lại hoặc gửi link vẫn giữ nguyên. Bảng gọn 5 cột trên máy tính, chuyển thành thẻ dưới 768px. Tab chưa hiện số lượng sản phẩm từng trạng thái. “Sửa” và “+ Thêm sản phẩm” dẫn tới M6 (làm ở 3c); “Xem trên web” dẫn tới trang chi tiết khách (làm ở F3).

---

## 8. M6 — Thêm / sửa sản phẩm

Một trang, chia khối. Nút “Lưu” dính ở đầu trang. Tạo mới luôn lưu ở trạng thái **Nháp**.

| Khối | Trường / chức năng | API |
|---|---|---|
| 1. Thông tin chung | Tên*, Slug (tự sinh), Danh mục*, Mô tả ngắn, Mô tả chi tiết (soạn Markdown có xem trước), Chất liệu, Hướng dẫn bảo quản, Nổi bật | `createProduct`, `updateProduct` |
| 2. Biến thể | Bảng sửa trực tiếp: Màu (tên + chọn mã màu), Kích thước, SKU (tự sinh), Giá*, Giá gốc, Tồn kho*, Bật/tắt. Nút “+ Thêm biến thể”. Công cụ nhanh: nhập danh sách màu × danh sách cỡ → sinh tất cả tổ hợp | `upsertVariants` |
| 3. Ảnh | Kéo thả nhiều ảnh, thanh tiến trình upload, kéo để sắp xếp (ảnh đầu là ảnh đại diện), sửa alt, gắn ảnh với màu, xóa | `getImageUploadSignature({ folder: 'products' })`, `saveProductImages`, `updateProductImages` |
| 4. Bộ sưu tập | Chọn nhiều bộ sưu tập | `setCollectionProducts` |
| 5. SEO | Tiêu đề SEO, mô tả SEO, khung xem trước kết quả Google | `updateProduct` |
| `PublishPanel` | Trạng thái hiện tại; nút “Đăng bán” / “Chuyển về nháp” / “Ngừng bán”. Thiếu điều kiện → hiện danh sách còn thiếu | `setProductStatus` |

**Quy tắc**
- Rời trang khi có thay đổi chưa lưu → hỏi lại.
- Ảnh tự nén ở trình duyệt trước khi upload nếu > 5 MB.
- Lỗi trùng slug/SKU hiện ngay tại ô tương ứng.

---

## 9. M7 — Danh mục

Một trang duy nhất, thêm/sửa trong hộp thoại.

| Thành phần | Mô tả | API |
|---|---|---|
| `CategoryTree` | Danh sách dạng cây (1 cấp con), nút ↑↓ để sắp xếp (thay cho kéo-thả vì kéo-thả không dùng được trên điện thoại và cần thêm thư viện), số sản phẩm mỗi danh mục, công tắc bật/tắt | `adminListCategories`, `reorderCategories` |
| `CategoryFormDialog` | Tên*, Slug, Danh mục cha, Mô tả, Ảnh (`ImageUploader` một ảnh — làm ở G4), SEO | `createCategory`, `updateCategory`, `getImageUploadSignature({ folder: 'categories' })` |
| Xóa | Chỉ cho xóa khi rỗng; nếu không thì báo số sản phẩm còn lại | `deleteCategory` |

---

## 10. M8, M9 — Bộ sưu tập

| Màn hình | Thành phần | API |
|---|---|---|
| M8 Danh sách | Thẻ bộ sưu tập: ảnh, tên, số sản phẩm, “Hiện trên trang chủ”, bật/tắt; kéo để sắp xếp | `adminListCollections`, `reorderCollections` |
| M9 Chi tiết | Form: Tên*, Slug, Mô tả, Ảnh banner, Hiện trên trang chủ, Bật/tắt | `createCollection`, `updateCollection`, `getImageUploadSignature({ folder: 'collections' })` |
| M9 Chi tiết | `ProductPicker`: tìm và chọn sản phẩm, kéo để sắp thứ tự | `setCollectionProducts` |
| M9 Chi tiết | Xóa bộ sưu tập (không xóa sản phẩm) | `deleteCollection` |

---

## 11. M10 — Tài khoản

Hiện tên, email; form đổi mật khẩu (mật khẩu hiện tại, mật khẩu mới, nhập lại). API: `changePassword`.

---

## 12. Màn hình P1 (thiết kế sau)

| # | Màn hình | Ý chính |
|---|---|---|
| M11 | In phiếu giao hàng | Khổ A5/A6: mã đơn, người nhận, địa chỉ, SĐT, sản phẩm, tiền thu hộ (COD), lời nhắn thiệp |
| M12 | Tồn kho | Bảng tất cả biến thể, sửa tồn kho nhanh, lịch sử nhập/xuất |
| M13 | Banner | Thêm/sửa banner trang chủ, ảnh riêng cho điện thoại, lịch hiển thị |
| M14 | Mã giảm giá | Tạo mã, điều kiện, thời hạn, số lượt dùng |
| M15 | Báo cáo | Doanh thu theo ngày/tháng, sản phẩm bán chạy, tỉ lệ hủy |

---

## 13. Thứ tự code đề xuất

| Bước | Việc | Phụ thuộc backend (`04` mục 14) |
|---|---|---|
| G1 | M0 khung quản trị + component dùng chung + M16 UI kit + M1 đăng nhập + đổi mật khẩu lần đầu | A7 |
| G2 | M7 Danh mục | B1 |
| G3 | M5 + M6 (thông tin chung, biến thể) | B3 |
| G4 | M6 phần ảnh (`ImageUploader`) | B4 |
| G5 | M8, M9 Bộ sưu tập | B2 |
| G6 | M3 Danh sách đơn | C6 |
| G7 | M4 Chi tiết đơn + đổi trạng thái + thanh toán | C4, C6 |
| G8 | M2 Tổng quan + M10 Tài khoản | C8 |
| G9 | E2E Playwright: đăng nhập → xác nhận đơn → chuyển đang giao → đã giao | Tất cả |

G1–G4 nên làm **trước** phần web khách, để bạn nhập được sản phẩm thật trong lúc làm giao diện shop.

---

## 14. Cần xác nhận

1. Bạn có muốn thông báo trên trình duyệt (hiện cảnh báo khi có đơn mới lúc đang mở trang admin) không? Mặc định: **không**, vì đã có Telegram.
2. Có cần xuất danh sách đơn ra file Excel không? Mặc định: P1.

---

## Ghi chú triển khai G1 (2026-10-05)

- Đã có: khung admin M0 (menu bên / menu trượt trên điện thoại), M1 đăng nhập, M10 đổi mật khẩu (bắt buộc lần đầu), trang `/admin/ui-kit`.
- Mục menu chưa có màn hình hiện "Sắp có" (cấu hình ở `src/config/admin-nav.ts`, đổi `ready` khi làm xong).
- Hoãn: DataTable và Combobox, sẽ làm cùng màn hình đầu tiên cần tới (G2/G3).
- Layout admin không chạy lại khi chuyển trang trong admin, nên mọi query/action vẫn tự gọi `requireAdmin()`.

## Nhật ký thay đổi

| Phiên bản | Ngày | Thay đổi |
|---|---|---|
| v1.1 | 2026-10-05 | Thêm M16 UI kit; đăng nhập theo Better Auth; ảnh danh mục/bộ sưu tập dùng `media`; bắt đổi mật khẩu lần đầu |
| v1.0 | 2026-10-05 | Bản đầu tiên |
