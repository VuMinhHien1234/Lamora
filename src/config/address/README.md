# Dữ liệu địa chỉ (tỉnh/thành → phường/xã)

- **Mô hình 2 cấp** theo đơn vị hành chính áp dụng từ 01/07/2025: **34 tỉnh, thành phố** và **3.321 phường/xã**.
- Nguồn: danh mục của Tổng cục Thống kê (NSO), lấy qua gói `vietnam-provinces` bản `2026.9.0`, dữ liệu ngày **2026-09-20** (file `nested-divisions.json`).
- Ngày nhập vào dự án: 2026-10-06.
- `provinces.json`: `{ code, name, nameAscii }`. `code` là mã tỉnh 2 chữ số theo NSO (ví dụ `01` Hà Nội, `79` TP. Hồ Chí Minh).
- `wards/<mã tỉnh>.json`: phường/xã của tỉnh đó, `{ code, name, nameAscii }`, `code` 5 chữ số. Tách theo tỉnh để trang thanh toán chỉ tải phần cần.
- `nameAscii` là tên không dấu, chữ thường, dùng để tìm kiếm.
- Không sửa tay. Cập nhật khi nhà nước điều chỉnh đơn vị hành chính: lấy bản dữ liệu mới, tạo lại các file này, rồi chạy test `src/features/shipping`.
