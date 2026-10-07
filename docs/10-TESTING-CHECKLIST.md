# 10 — TESTING CHECKLIST: Kiểm thử trước khi ra mắt

> Dựa trên toàn bộ file `00`–`09` · Phiên bản: v2.0 · 2026-10-07
>
> Dùng trước mỗi lần phát hành lớn (`v1.0.0` ra mắt, `v1.1.0` P1…). Kiểm thử trên **deploy preview** với dữ liệu mẫu, riêng mục 9 làm trên production.
> Cách ghi: `[x]` đạt · `[!]` lỗi (ghi số ở mục 11) · `[-]` không áp dụng.
> Kết quả kiểm tra tự động của code Lamora cũ: `_ban-cu-lamora-flower/10-KET-QUA-KIEM-TRA.md` (không còn giá trị cho dự án mới).

---

## 0. Thiết bị kiểm thử tối thiểu

| Thiết bị | Trình duyệt | Bắt buộc |
|---|---|---|
| iPhone | Safari | ✔ |
| Android | Chrome | ✔ |
| Điện thoại bất kỳ | Trình duyệt trong **Zalo**, **Facebook**, mở từ **Google Maps** | ✔ |
| Máy tính | Chrome + Safari/Edge | ✔ |
| Điện thoại của người trực quầy | App **Telegram** (nhận thông báo, có chuông) | ✔ |

---

## 1. Kiểm tra tự động
- [ ] CI xanh: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`.
- [ ] Unit test có cho: tạm tính, chụp giá vào yêu cầu, gộp dòng trùng, món tạm hết bị từ chối, chuẩn hóa SĐT, sinh mã `TL-…`, kiểm tra giờ hẹn trong giờ mở cửa, chuyển trạng thái yêu cầu (hợp lệ và không), soạn tin Telegram + escape HTML, giới hạn tần suất, `priceFrom`, slug tiếng Việt.
- [ ] E2E Playwright xanh (`01` mục 11).
- [ ] `pnpm audit --prod` không còn lỗi từ mức `high`.
- [ ] Tìm trong code (trừ `docs/_ban-cu-lamora-flower/`): không còn “Lamora”, “LMR-”, “VietQR”, “gio-hang”, “thanh-toan” (`12` bước 9).

---

## 2. Web khách

### 2.1 Khung chung
- [ ] Logo về trang chủ; menu đủ mục; nút “Đặt món” luôn thấy trên header.
- [ ] `OpenStatus` đúng: thử đổi giờ máy sang trước giờ mở, trong giờ, 30 phút trước đóng, sau giờ đóng.
- [ ] Nút nổi Gọi (mở trình quay số), Zalo (mở đúng tài khoản), Telegram (mở đúng tài khoản tiệm, **không phải bot**); không che nút đặt món.
- [ ] Footer: địa chỉ, giờ, SĐT, thông tin hộ kinh doanh đúng.

### 2.2 Thực đơn
- [ ] Đủ danh mục, đúng thứ tự; tab nhảy đúng khối; tab dính khi cuộn.
- [ ] Giá hiển thị đúng định dạng `25.000₫`; món nhiều lựa chọn hiện “Từ …”.
- [ ] Món Nháp / Ngừng bán **không** xuất hiện; món “Tạm hết” vẫn hiện, mờ, không có nút `+`.
- [ ] Nhãn Bán chạy / Món mới / Cay / Chay hiện đúng.
- [ ] `/thuc-don/<slug>` sai → 404.

### 2.3 Chi tiết món
- [ ] Chọn lựa chọn → giá đổi đúng; món 1 giá không hiện ô chọn.
- [ ] “Đặt món này” mở `/dat-mon` với đúng món, đúng lựa chọn, đúng số lượng đã chọn sẵn.
- [ ] Món tạm hết: nút khóa, có gợi ý gọi tiệm.
- [ ] Ảnh vuốt được trên điện thoại; thành phần, lưu ý dị ứng hiển thị.

### 2.4 Đặt món
- [ ] Chưa chọn món → nút gửi khóa.
- [ ] +/− cập nhật tạm tính đúng; không vượt 50 phần mỗi dòng.
- [ ] Bỏ trống tên/SĐT → lỗi đúng trường; SĐT “+84 912 345 678” được chấp nhận và lưu `0912345678`.
- [ ] Chọn “Giao tận nơi” → ô địa chỉ hiện và bắt buộc; đổi lại “Lấy tại quầy” → ẩn, không gửi địa chỉ.
- [ ] Hẹn giờ: chỉ chọn được trong giờ mở cửa, từ hiện tại đến +7 ngày.
- [ ] Ngoài giờ mở cửa: hiện dải thông báo, vẫn gửi được.
- [ ] Tải lại trang giữa chừng → món đã chọn vẫn còn (`sessionStorage`).
- [ ] Bấm “Gửi” 2 lần liên tiếp chỉ tạo **1** yêu cầu.
- [ ] Admin bật “Tạm hết” một món khi khách đang mở form → khách gửi → báo lỗi đúng dòng món đó, giữ nguyên thông tin đã nhập.
- [ ] Gửi quá 3 lần trong 10 phút → bị chặn, thông báo lịch sự kèm SĐT tiệm.
- [ ] Điền trường bẫy `website` (qua công cụ) → trang báo thành công nhưng **không** có yêu cầu trong admin, **không** có tin Telegram.
- [ ] Gửi thành công → tới trang “Đã gửi”, mã đúng dạng `TL-YYMMDD-XXXX`, SĐT đã che.

### 2.5 Telegram
- [ ] Nhóm nhận tin trong < 10 giây, đúng mẫu `07` mục 4.1: tên, SĐT, link Zalo, cách nhận, giờ, món, tạm tính, ghi chú, link admin.
- [ ] Bấm SĐT trong tin trên điện thoại → gọi được; link Zalo mở đúng.
- [ ] Nhập `<b>test</b> & <script>` vào tên, ghi chú → tin hiện đúng nguyên chữ, không vỡ định dạng.
- [ ] Đặt `TELEGRAM_CHAT_ID` sai trên preview → yêu cầu vẫn lưu, admin hiện ⚠ “Chưa gửi được”; sửa lại → `telegram-retry` hoặc nút “Gửi lại” gửi thành công.
- [ ] Form liên hệ → nhóm nhận tin mẫu `07` mục 4.2.

### 2.6 Liên hệ, trang tĩnh, lỗi
- [ ] Bản đồ chỉ tải khi bấm; “Chỉ đường” mở Google Maps đúng địa điểm.
- [ ] Form liên hệ: validate, chống spam như form đặt món.
- [ ] Trang Giới thiệu và Chính sách bảo mật có nội dung thật.
- [ ] URL không tồn tại → 404 có món nổi bật.

---

## 3. Trang quản trị

### 3.1 Đăng nhập (giữ từ bản cũ)
- [ ] Chưa đăng nhập → chuyển tới đăng nhập, xong quay lại đúng trang.
- [ ] Sai 5 lần → khóa 15 phút; lần đầu bắt đổi mật khẩu; đổi mật khẩu đăng xuất thiết bị khác.
- [ ] Gọi trực tiếp server action admin khi chưa đăng nhập → bị từ chối.

### 3.2 Thực đơn
- [ ] Thêm/sửa/sắp xếp/bật-tắt danh mục; không xóa được danh mục còn món.
- [ ] Tạo món → Nháp, chưa hiện trên web; đăng thiếu ảnh/giá → báo thiếu gì.
- [ ] Thêm/sửa/tắt lựa chọn giá; “Giá từ” cập nhật; không tắt được lựa chọn cuối của món đang bán.
- [ ] Đổi giá → web khách cập nhật trong vài giây, **yêu cầu cũ vẫn giữ giá lúc gửi**.
- [ ] Công tắc “Tạm hết” trên điện thoại: 1 chạm, web cập nhật trong vài giây.
- [ ] Upload, sắp xếp, sửa alt, xóa ảnh.

### 3.3 Yêu cầu đặt món
- [ ] Tab trạng thái đúng số lượng; tìm theo mã (có/không gạch), SĐT, tên.
- [ ] Nút Gọi/Zalo trên dòng và trong chi tiết hoạt động trên điện thoại.
- [ ] Chỉ hiện nút cho bước chuyển hợp lệ; hủy bắt buộc lý do.
- [ ] Ghi chú nội bộ lưu được; lịch sử ghi đủ thời gian, người, nguồn.
- [ ] “Gửi lại Telegram” hoạt động.

### 3.4 Tin liên hệ, tổng quan
- [ ] Đánh dấu “Đã xử lý”; số chưa xử lý trên menu cập nhật.
- [ ] Số liệu tổng quan khớp dữ liệu mẫu (đối chiếu tay); món được đặt nhiều đúng.

---

## 4. Giao diện (đối chiếu `03`)
- [ ] Duyệt `/admin/ui-kit` trên điện thoại và máy tính.
- [ ] Không còn token cũ (`ivory`, `rose`, `sage`, `ink`…) và không có mã màu viết trực tiếp.
- [ ] Dấu tiếng Việt ở font Baloo 2 không bị cắt.
- [ ] Không thanh cuộn ngang ở **360px**.
- [ ] Ảnh món đúng 4:3, không méo, không nhảy bố cục.
- [ ] Toàn bộ luồng đặt món dùng được bằng bàn phím; vùng bấm đủ lớn.
- [ ] Giọng văn đúng `03` mục 1.3; không lỗi chính tả; mọi chỗ có giá đều có “giá tham khảo”.

---

## 5. Bảo mật (`08` Phần I)
- [ ] Checklist `08` mục 1–8 đã đánh dấu.
- [ ] Header bảo mật đạt mức tốt khi quét.
- [ ] Secret scanning không cảnh báo; preview không kết nối DB production, không gửi vào nhóm thật.

---

## 6. SEO (`08` Phần II)
- [ ] Title/description riêng từng trang.
- [ ] Gửi link món qua **Zalo** và Facebook hiện đúng ảnh, tên, giá.
- [ ] `/sitemap.xml` đủ trang, không có món Nháp; `/robots.txt` đúng.
- [ ] Rich Results Test / Schema Validator nhận `Restaurant`, `Menu`, `BreadcrumbList` không lỗi.
- [ ] NAP trên web khớp Google Business Profile.

---

## 7. Hiệu năng (`08` Phần III)
- [ ] PageSpeed (điện thoại): trang chủ, thực đơn, chi tiết món ≥ 90, LCP < 2.5s, CLS < 0.1.
- [ ] Xem trang khách không làm Neon thức dậy (kiểm tra bảng điều khiển Neon sau khi chỉ duyệt web).

---

## 8. Vận hành (`09`)
- [ ] Biến môi trường production đủ; `TELEGRAM_ENABLED=true`; `NEXT_PUBLIC_SITE_URL` là tên miền chính.
- [ ] Backup chạy thành công; **diễn tập khôi phục** vào branch Neon mới thành công.
- [ ] `monitor.yml`: cố ý làm hỏng health trên preview → nhận cảnh báo.
- [ ] Gọi `/api/cron/*` không có `CRON_SECRET` → bị từ chối.
- [ ] Quay lại bản deploy trước trên Netlify được.
- [ ] Ghi ngày kiểm tra gói dịch vụ vào `09` mục 10.

---

## 9. Ngày ra mắt

### 9.1 Trước khi mở
- [ ] Xóa dữ liệu mẫu trên production; chỉ giữ admin.
- [ ] Nhập thực đơn thật: ảnh thật, mô tả, giá khớp bảng giá tại quầy.
- [ ] `config/site.ts`: địa chỉ, giờ, SĐT, Zalo, Telegram, Maps, thông tin hộ kinh doanh thật.
- [ ] Nhóm Telegram đủ người trực; chuông bật.
- [ ] Đặt **3 yêu cầu thật** từ 3 điện thoại khác nhau (lấy tại quầy, giao, hẹn giờ) → tiệm gọi lại theo đúng quy trình `07` mục 1 → hoàn tất / hủy.
- [ ] Chính sách bảo mật, thông tin pháp lý ở chân trang đủ (`08` Phần IV).
- [ ] Tên miền, HTTPS, `www` chuyển hướng đúng; Search Console và Google Business Profile trỏ đúng web.
- [ ] Gắn tag `v1.0.0`, cập nhật `CHANGELOG.md`.

### 9.2 Tuần đầu
- [ ] Mỗi ngày: không có thẻ “Chưa gửi được Telegram”; không còn yêu cầu “Mới” cuối ngày.
- [ ] Ngày 3 và 7: credits Netlify, phút GitHub Actions.
- [ ] Ghi phản hồi khách vào mục 11.

---

## 10. Kiểm thử lại sau mỗi phát hành nhỏ
- [ ] CI xanh + E2E nếu chạm form đặt món, Telegram, admin yêu cầu.
- [ ] Kiểm tra nhanh `09` mục 5.2.
- [ ] Các mục liên quan trực tiếp phần vừa sửa.

---

## 11. Sổ ghi lỗi

| # | Mục | Mô tả lỗi | Thiết bị | Mức độ (Cao/Vừa/Thấp) | Trạng thái |
|---|---|---|---|---|---|
| 1 | | | | | |

**Quy tắc ra mắt:** không còn lỗi mức **Cao** (mất yêu cầu đặt món, không nhận tin Telegram, sai giá, lộ dữ liệu khách, không gửi được form). Lỗi Vừa/Thấp có thể ra mắt nếu đã ghi kế hoạch sửa.

---

## Nhật ký thay đổi

| Phiên bản | Ngày | Thay đổi |
|---|---|---|
| v2.0 | 2026-10-07 | Viết lại cho Bánh Mì Thanh Long: thực đơn, đặt món, Telegram, “Tạm hết”, liên hệ; bỏ giỏ hàng, thanh toán, VietQR, tồn kho, tra cứu đơn |
| v1.0 | 2026-10-05 | (Lamora) Bản đầu tiên |
