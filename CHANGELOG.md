# Changelog

## v0.1.0 — chưa phát hành (sẵn sàng gắn tag khi bạn yêu cầu)
- Web khách: trang chủ, danh mục, bộ sưu tập, lọc/sắp xếp/tìm kiếm, chi tiết sản phẩm, giỏ hàng, thanh toán COD + VietQR, xác nhận đơn, tra cứu đơn, trang tĩnh, SEO.
- Quản trị: tổng quan, đơn hàng, sản phẩm, danh mục, bộ sưu tập, ảnh (Cloudinary), đổi mật khẩu.
- Thiệp lời nhắn và gói quà theo từng sản phẩm (mỗi dòng giỏ một thiệp riêng; phí gói quà tính theo số sản phẩm được gói; Telegram và trang admin hiện thiệp dưới đúng sản phẩm). Migration `order_item_card`.
- Hạ tầng: Netlify, Neon, GitHub Actions (CI, E2E, backup, health, cron), Google Analytics tùy chọn.
