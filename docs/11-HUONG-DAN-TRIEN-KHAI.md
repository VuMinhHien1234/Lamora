# 11 — Hướng dẫn triển khai từng bước (dành cho chủ tiệm)

> Dựa trên `09-DEPLOYMENT.md` v2.0 · Phiên bản: v2.0 · 2026-10-07
>
> Bạn chỉ cần bấm theo thứ tự. Mỗi bước có “Kiểm tra”. Toàn bộ dịch vụ dùng gói **miễn phí**. Tạo tài khoản/dự án **mới** cho Bánh Mì Thanh Long, không dùng chung database hay bot với Lamora. Trước bước này, code phải đã chuyển đổi xong theo `12-KE-HOACH-CHUYEN-DOI.md`.

## Bước 0 — Chạy thử trên máy bạn

1. Cài Node (phiên bản trong `.nvmrc`), pnpm, PostgreSQL (hoặc Docker).
2. Sao chép `.env.example` thành `.env`, điền:
   - `DATABASE_URL`, `DIRECT_URL`: cùng địa chỉ Postgres trên máy, ví dụ `postgresql://postgres:matkhau@localhost:5432/thanhlong`.
   - `AUTH_SECRET`, `IP_HASH_SALT`, `CRON_SECRET`: mỗi cái một chuỗi ngẫu nhiên ≥ 32 ký tự (`openssl rand -base64 32`).
   - `ADMIN_EMAIL`, `ADMIN_INITIAL_PASSWORD`.
   - `TELEGRAM_ENABLED=false` (bật ở Bước 5).
3. Chạy: `pnpm install`, `pnpm prisma migrate deploy`, `pnpm prisma db seed`, `pnpm dev`.
4. **Kiểm tra**: http://localhost:3000 thấy trang chủ Bánh Mì Thanh Long; `/thuc-don` có món mẫu; `/admin` đăng nhập được và bị bắt đổi mật khẩu.

## Bước 1 — Neon (cơ sở dữ liệu)

1. neon.tech → tạo Project `banh-mi-thanh-long`, vùng **Singapore**.
2. Tạo nhánh `dev` và `preview` (nhánh `main` có sẵn).
3. Mỗi nhánh copy 2 địa chỉ: **pooled** (có `-pooler`) → `DATABASE_URL`, **direct** → `DIRECT_URL`.
4. **Kiểm tra**: có đủ 2 địa chỉ cho nhánh `main`.

## Bước 2 — Cloudinary (ảnh)

1. Dùng tài khoản cũ hoặc đăng ký mới (gói Free).
2. Lấy `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.
3. Khóa bí mật chỉ dán vào `.env` và Netlify, **không gửi cho ai**.

## Bước 3 — GitHub

1. Repo **private** `banh-mi-thanh-long`, có nhánh `develop` và `main`.
2. Settings → Secrets and variables → Actions, thêm: `PROD_DIRECT_URL` (direct của nhánh main), `BACKUP_PASSPHRASE`, `SITE_URL`, `CRON_SECRET` (giống Netlify), `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`.
3. **Kiểm tra**: tab Actions, workflow `CI` xanh.

## Bước 4 — Netlify (đưa web lên mạng)

1. netlify.com → Add new site → Import from GitHub → chọn repo. Nhánh production: `main`.
2. Lệnh build đã có trong `netlify.toml`.
3. Site configuration → Environment variables:
   - `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`, `IP_HASH_SALT`, `CRON_SECRET`
   - `NEXT_PUBLIC_SITE_URL` (có `https://`)
   - `ADMIN_EMAIL`, `ADMIN_INITIAL_PASSWORD` (chỉ dùng lần seed đầu)
   - `CLOUDINARY_*`
   - `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`; `TELEGRAM_ENABLED=true` **chỉ ở Production**, `false` ở Deploy Previews
   - `NEXT_PUBLIC_GA_ID` (tùy chọn)
   - Preview dùng địa chỉ nhánh Neon `preview`.
4. Deploy. Lần đầu, tạo tài khoản admin trên database thật (hỏi AI lệnh cụ thể, vì đây là thao tác ghi vào database thật).
5. **Kiểm tra**: `https://<tên>.netlify.app/api/health` thấy `{"ok":true}`.

## Bước 5 — Telegram (nhận yêu cầu đặt món)

1. @BotFather → `/newbot` → tên “Thanh Long – Đặt món” → lấy **token**.
2. Tạo nhóm “Thanh Long – Đặt món”, thêm bot và người trực quầy.
3. Trong nhóm gửi `/start@<username_bot>`, rồi mở `https://api.telegram.org/bot<token>/getUpdates`, lấy `chat.id` của nhóm (số âm, dạng `-100…`).
4. Điền vào Netlify và GitHub Secrets như Bước 3–4, deploy lại.
5. **Kiểm tra**: gửi một yêu cầu đặt món trên web → nhóm nhận tin trong vài giây → vào admin hủy yêu cầu thử.

Chi tiết và mẫu tin: `07-TELEGRAM-DAT-MON.md`.

## Bước 6 — Tên miền

Netlify → Domain management → Add domain, trỏ DNS theo hướng dẫn. Cập nhật `NEXT_PUBLIC_SITE_URL` (Netlify) và `SITE_URL` (GitHub), deploy lại.

## Bước 7 — Google (khách tìm thấy tiệm)

1. **Google Business Profile**: tạo/xác minh hồ sơ tiệm; điền trang web, link thực đơn `/thuc-don`, link đặt món `/dat-mon`; tên, địa chỉ, SĐT **giống hệt** trên web.
2. **Google Search Console**: xác minh tên miền, gửi `https://<tên-miền>/sitemap.xml`.
3. **Kiểm tra**: tìm tên tiệm trên Google Maps thấy nút “Trang web” dẫn về web.

## Bước 8 — Trước khi mở

- Điền thông tin thật trong `src/config/site.ts`: địa chỉ, giờ mở cửa, SĐT, Zalo, username Telegram của tiệm, link Google Maps, thông tin hộ kinh doanh.
- Đặt ảnh lớn trang chủ.
- Đăng nhập admin, **đổi mật khẩu**, nhập thực đơn thật (giá khớp bảng giá tại quầy).
- Chạy theo `10-TESTING-CHECKLIST.md`, đặc biệt mục 9.
- Khi trình duyệt không còn cảnh báo CSP, đổi `Content-Security-Policy-Report-Only` thành `Content-Security-Policy` trong `next.config.ts`.

## Việc hằng ngày sau khi mở

- Sáng: bật “Tạm hết” cho món hết trong ngày (admin → Tổng quan, 1 chạm/món); tắt khi có lại.
- Khi có tin Telegram: gọi khách → vào admin (hoặc bấm nút trên Telegram ở P1) chuyển “Đã liên hệ” → “Hoàn tất”.
- Cuối ngày: không còn yêu cầu “Mới”; không có thẻ “Chưa gửi được Telegram”.
