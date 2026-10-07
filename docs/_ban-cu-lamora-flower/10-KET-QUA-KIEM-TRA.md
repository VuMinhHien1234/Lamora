# Kết quả kiểm tra tự động (D3) — 2026-10-06

| Hạng mục | Kết quả |
|---|---|
| `eslint --max-warnings 0` | ✅ |
| `tsc --noEmit` | ✅ |
| Unit test (Vitest) | ✅ 368 test / 55 file |
| `next build` | ✅ |
| E2E Playwright (khách + admin, desktop 1280 và mobile 360) | ✅ 9/9 mỗi cấu hình (lần chạy gần nhất, trước khi thêm GA) |
| Không thanh cuộn ngang ở 360px, token giao diện | ✅ đã kiểm tra bằng trình duyệt các trang S0–S10, M0–M10 |
| Lộ SĐT khi tra cứu đơn | ✅ có test chặn |
| Header bảo mật, CSP | ✅ CSP đang Report-Only |

## Cần bạn tự kiểm tra (không tự động được)
- Mở thử trên điện thoại thật (iOS Safari, Android Chrome).
- PageSpeed / Lighthouse trên bản đã deploy (mục tiêu `08` mục hiệu năng).
- Đặt đơn thật bằng COD và chuyển khoản VietQR bằng app ngân hàng; kiểm tra Telegram báo đơn.
- Chạy workflow `backup` thủ công một lần và thử khôi phục.
- Kiểm tra email/SĐT liên hệ và bảng phí ship đã đúng thực tế.

## Chưa làm (P1/P2, cố ý)
- Cron nhắc đơn chờ (`pending-reminder`), `PRICE_CHANGED` trong giỏ, ô chọn có tìm kiếm (Combobox), gợi ý tìm kiếm trên header.
