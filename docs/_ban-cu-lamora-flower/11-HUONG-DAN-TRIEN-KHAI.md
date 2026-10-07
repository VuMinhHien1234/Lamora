# 11 — Hướng dẫn triển khai từng bước (dành cho chủ shop)

> Bạn chỉ cần bấm theo thứ tự. Mỗi bước có "Kiểm tra" để biết đã đúng chưa. Toàn bộ dịch vụ dùng gói **miễn phí**. Chi tiết kỹ thuật xem `09-DEPLOYMENT.md`.

## Bước 0 — Chạy thử trên máy bạn (không cần Neon)

1. Cài Node 22 (file `.nvmrc`), pnpm, và PostgreSQL (hoặc dùng Docker).
2. Sao chép `.env.example` thành `.env`. Điền:
   - `DATABASE_URL` và `DIRECT_URL`: cùng một địa chỉ Postgres trên máy, ví dụ `postgresql://postgres:matkhau@localhost:5432/lamora`.
   - `AUTH_SECRET`, `IP_HASH_SALT`, `CRON_SECRET`: mỗi cái một chuỗi ngẫu nhiên ≥ 32 ký tự (chạy `openssl rand -base64 32`).
   - `ADMIN_EMAIL`, `ADMIN_INITIAL_PASSWORD`: tài khoản admin đầu tiên.
3. Chạy: `pnpm install`, `pnpm prisma migrate deploy`, `pnpm prisma db seed`, `pnpm dev`.
4. **Kiểm tra**: mở http://localhost:3000 thấy trang chủ; mở /admin đăng nhập được, hệ thống bắt đổi mật khẩu.

## Bước 1 — Neon (cơ sở dữ liệu)

1. Vào neon.tech → đăng ký → tạo Project, vùng **Singapore**.
2. Tạo 3 nhánh (branch): `main` (thật), `dev`, `preview`.
3. Ở mỗi nhánh, copy 2 địa chỉ: **pooled** (có `-pooler`) cho `DATABASE_URL`, **direct** cho `DIRECT_URL`.
4. **Kiểm tra**: có đủ 2 địa chỉ cho nhánh `main`.

## Bước 2 — Cloudinary (ảnh)

1. cloudinary.com → đăng ký gói Free.
2. Lấy `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` ở Dashboard.
3. Khóa bí mật chỉ dán vào `.env` của bạn và vào Netlify, **không gửi cho ai, không đưa vào code**.

## Bước 3 — GitHub

1. Tạo repo **private** `lamora-flower`, đẩy code lên nhánh `develop` (và `main`).
2. Vào Settings → Secrets and variables → Actions, thêm:
   `BACKUP_DATABASE_URL` (địa chỉ direct của nhánh main), `BACKUP_PASSPHRASE` (chuỗi bí mật để mã hóa bản sao lưu), `SITE_URL`, `CRON_SECRET` (giống Netlify), `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` (để nhận cảnh báo).
3. **Kiểm tra**: tab Actions chạy workflow `CI` xanh.

## Bước 4 — Netlify (đưa web lên mạng)

1. netlify.com → Add new site → Import from GitHub → chọn repo. Nhánh production: `main`.
2. Lệnh build đã có trong `netlify.toml`, không cần sửa.
3. Site configuration → Environment variables, thêm các biến sau (mỗi biến chọn phạm vi Production; bản Preview dùng địa chỉ nhánh Neon `preview`):
   - `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`, `IP_HASH_SALT`, `CRON_SECRET`
   - `NEXT_PUBLIC_SITE_URL` (địa chỉ web thật, có `https://`)
   - `ADMIN_EMAIL`, `ADMIN_INITIAL_PASSWORD` (chỉ dùng lần seed đầu)
   - `CLOUDINARY_*`
   - `BANK_BIN`, `BANK_ACCOUNT_NO`, `BANK_ACCOUNT_NAME` (VietQR)
   - `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `TELEGRAM_ENABLED=true`
   - `NEXT_PUBLIC_GA_ID` (tùy chọn, dạng `G-XXXXXXXXXX`)
4. Bấm Deploy. Lần đầu, chạy seed một lần trên máy bạn với địa chỉ nhánh `main` để tạo admin (hỏi tôi lệnh cụ thể, vì đây là thao tác ghi vào database thật).
5. **Kiểm tra**: mở `https://<tên>.netlify.app/api/health` thấy `{"ok":true}`.

## Bước 5 — Telegram (nhận thông báo đơn mới)

1. Nhắn @BotFather → `/newbot` → lấy token.
2. Nhắn bot một tin bất kỳ, rồi mở `https://api.telegram.org/bot<token>/getUpdates` để lấy `chat.id`.
3. **Kiểm tra**: đặt thử một đơn → Telegram báo có đơn mới.

## Bước 6 — Tên miền

Netlify → Domain management → Add domain, làm theo hướng dẫn trỏ DNS. Sau đó cập nhật `NEXT_PUBLIC_SITE_URL` và biến `SITE_URL` trên GitHub, deploy lại.

## Bước 7 — Trước khi mở bán

- Điền thông tin thật trong `src/config/site.ts` (SĐT, Zalo, Messenger, tên người bán, mã số thuế).
- Đặt ảnh banner trang chủ (`HOME_HERO.imagePublicId`).
- Duyệt bảng phí ship (`07`).
- Đăng nhập admin, **đổi mật khẩu**, nhập sản phẩm thật.
- Chạy theo `10-TESTING-CHECKLIST.md`, đặc biệt các mục thủ công ghi trong `docs/10-KET-QUA-KIEM-TRA.md`.
- Khi trình duyệt không còn cảnh báo CSP, đổi `Content-Security-Policy-Report-Only` thành `Content-Security-Policy` trong `next.config.ts`.
