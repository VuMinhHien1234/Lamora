# 10 — TESTING CHECKLIST: Kiểm thử trước khi ra mắt

> Dựa trên toàn bộ file `00`–`09` · Phiên bản: v1.0 · 2026-10-05
>
> Dùng file này **trước mỗi lần phát hành lớn** (MVP `v0.1.0`, P1 `v0.2.0`…). Kiểm thử trên **deploy preview** với dữ liệu mẫu, riêng mục 9 làm trên production.
>
> Cách ghi: `[x]` đạt · `[!]` lỗi (ghi số thứ tự lỗi ở mục 11) · `[-]` không áp dụng.

---

## 0. Thiết bị kiểm thử tối thiểu

| Thiết bị | Trình duyệt | Bắt buộc |
|---|---|---|
| iPhone (màn hình nhỏ nếu có) | Safari | ✔ |
| Điện thoại Android | Chrome | ✔ |
| Điện thoại bất kỳ | Trình duyệt trong Zalo và Facebook (mở link từ tin nhắn) | ✔ |
| Máy tính | Chrome | ✔ |
| Máy tính | Safari hoặc Edge | ✔ |
| Máy tính bảng | Bất kỳ | Nên có |

Khách thường mở link từ Zalo/Facebook, nên **trình duyệt bên trong ứng dụng** phải được kiểm tra kỹ (giỏ hàng có giữ được không, sao chép mã chuyển khoản có được không).

---

## 1. Kiểm tra tự động

- [ ] CI xanh: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`.
- [ ] Unit test có cho: tính phí ship (mọi vùng, mốc miễn phí), tổng tiền, gói quà, chuyển trạng thái đơn (mọi bước hợp lệ và không hợp lệ), cộng/trừ kho, sinh mã đơn, nội dung chuyển khoản, tạo slug tiếng Việt, URL VietQR, giới hạn tần suất.
- [ ] E2E Playwright xanh (`01` mục 11): luồng khách đặt COD → tra cứu; luồng admin xử lý đơn.
- [ ] `pnpm audit --prod` không còn lỗi mức `high` trở lên.

---

## 2. Web khách — chức năng

### 2.1 Khung chung
- [ ] Logo về trang chủ; menu danh mục đủ và đúng thứ tự.
- [ ] Menu điện thoại mở/đóng mượt, đóng khi chọn mục.
- [ ] Ô tìm kiếm: gõ “hoa hong” (không dấu) ra sản phẩm hoa hồng; gõ 1 ký tự không gợi ý.
- [ ] Biểu tượng giỏ hiện đúng số lượng, cập nhật ngay khi thêm.
- [ ] Nút Zalo/Messenger mở đúng tài khoản shop; không che nút mua hàng.
- [ ] Footer: mọi link hoạt động, thông tin liên hệ đúng.

### 2.2 Danh sách sản phẩm
- [ ] Lọc theo màu, khoảng giá, danh mục cho kết quả đúng; kết hợp nhiều bộ lọc đúng.
- [ ] Sắp xếp giá tăng/giảm đúng theo giá thấp nhất.
- [ ] Phân trang đúng; tải lại trang và bấm “Quay lại” giữ nguyên bộ lọc.
- [ ] Không có kết quả → hiện trạng thái rỗng và nút xóa bộ lọc.
- [ ] Sản phẩm Nháp và Ngừng bán **không** xuất hiện.
- [ ] Sản phẩm hết hàng hiện nhãn “Hết hàng”.

### 2.3 Chi tiết sản phẩm
- [ ] Chọn màu → đổi ảnh tương ứng và đổi giá (nếu khác).
- [ ] Biến thể hết hàng không chọn được.
- [ ] Số lượng không vượt tồn kho.
- [ ] “Thêm vào giỏ” mở giỏ nhỏ, số lượng đúng; thêm lại cùng biến thể thì cộng dồn.
- [ ] “Mua ngay” tới trang thanh toán với đúng sản phẩm.
- [ ] Gallery vuốt được trên điện thoại, phóng to được.
- [ ] Mở URL sản phẩm không tồn tại hoặc đang Nháp → trang 404.

### 2.4 Giỏ hàng
- [ ] Đổi số lượng, xóa dòng cập nhật tạm tính đúng.
- [ ] Thanh miễn phí ship hiện đúng số tiền còn thiếu.
- [ ] Admin đổi giá một sản phẩm đang có trong giỏ → giỏ hiện cảnh báo “giá thay đổi” và giá mới.
- [ ] Admin cho hết hàng / ngừng bán → giỏ cảnh báo và khóa nút thanh toán.
- [ ] Đóng trình duyệt, mở lại → giỏ vẫn còn.

### 2.5 Thanh toán và đặt hàng
- [ ] Bỏ trống trường bắt buộc → báo lỗi tại đúng trường, cuộn tới lỗi đầu tiên.
- [ ] Số điện thoại sai định dạng bị từ chối; nhập “+84 912 345 678” được chuẩn hóa thành `0912345678`.
- [ ] Chọn tỉnh → danh sách phường/xã đúng tỉnh; tìm “hoan kiem” ra “Hoàn Kiếm”.
- [ ] Phí ship đổi đúng khi đổi tỉnh: Hà Nội 25.000₫, miền Bắc 35.000₫, miền Trung–Nam 40.000₫.
- [ ] Đơn ≥ 800.000₫ → phí ship 0₫.
- [ ] Bật quà tặng → hiện trường người nhận, lời nhắn đếm ký tự, gói quà cộng 20.000₫.
- [ ] Ngày nhận chỉ chọn được từ ngày mai đến 30 ngày tới.
- [ ] Bấm “Đặt hàng” 2 lần liên tiếp chỉ tạo **1** đơn.
- [ ] Đặt hàng COD thành công → giỏ trống, tới trang cảm ơn, mã đơn đúng dạng `LMR-YYMMDD-XXXX`.
- [ ] Đặt hàng chuyển khoản → trang cảm ơn hiện QR; quét bằng app ngân hàng thấy **đúng số tiền, đúng nội dung `LMR…` (không dấu gạch), đúng tên chủ tài khoản**.
- [ ] Sao chép từng dòng thông tin chuyển khoản hoạt động (kể cả trong trình duyệt Zalo).
- [ ] Hai người cùng đặt sản phẩm chỉ còn 1 cái → chỉ 1 đơn thành công, người còn lại nhận thông báo hết hàng.
- [ ] Đặt quá 3 đơn trong 10 phút từ cùng một máy → bị chặn với thông báo lịch sự.
- [ ] Tồn kho giảm đúng sau khi đặt.
- [ ] Telegram nhận tin đơn mới đúng mẫu `07` mục 4.3, link mở đúng đơn trong admin.
- [ ] Ô đồng ý chính sách bắt buộc tích.

### 2.6 Sau đặt hàng
- [ ] Tải lại trang cảm ơn trong 1 giờ vẫn xem được; sau khi cookie hết hạn → chuyển tới tra cứu đơn.
- [ ] Tra cứu với mã đúng + SĐT đúng → thấy đơn; sai một trong hai → “Không tìm thấy đơn”.
- [ ] Tra cứu quá 10 lần/10 phút → bị chặn.
- [ ] Dòng thời gian trạng thái cập nhật khi admin đổi trạng thái; hiện mã vận đơn khi đang giao.

### 2.7 Trang tĩnh và lỗi
- [ ] 5 trang chính sách có nội dung thật, không còn chữ mẫu.
- [ ] URL bất kỳ không tồn tại → trang 404 đẹp, có tìm kiếm.

---

## 3. Trang quản trị — chức năng

### 3.1 Đăng nhập
- [ ] Vào `/admin` khi chưa đăng nhập → chuyển tới trang đăng nhập; đăng nhập xong quay lại đúng trang.
- [ ] Sai mật khẩu 5 lần → bị khóa tạm 15 phút.
- [ ] Lần đầu đăng nhập bằng mật khẩu ban đầu → bắt buộc đổi mật khẩu.
- [ ] Đổi mật khẩu → phiên trên thiết bị khác bị đăng xuất.
- [ ] Gọi trực tiếp một server action admin khi chưa đăng nhập → bị từ chối (AI viết một test cho việc này).

### 3.2 Danh mục, bộ sưu tập
- [ ] Thêm, sửa, sắp xếp, bật/tắt danh mục; thay đổi hiện ngay trên web khách.
- [ ] Không xóa được danh mục còn sản phẩm.
- [ ] Bộ sưu tập: chọn sản phẩm, sắp thứ tự, bật “Hiện trên trang chủ” → hiện đúng trên trang chủ.

### 3.3 Sản phẩm
- [ ] Tạo sản phẩm mới → trạng thái Nháp, chưa hiện trên web.
- [ ] Công cụ sinh biến thể màu × cỡ tạo đủ tổ hợp, SKU tự sinh không trùng.
- [ ] Upload nhiều ảnh, sắp xếp, gắn ảnh với màu, sửa alt, xóa ảnh.
- [ ] Đăng bán khi thiếu ảnh/giá → báo thiếu gì.
- [ ] Đăng bán đủ điều kiện → hiện trên web trong vài giây.
- [ ] Đổi giá biến thể → “Giá từ” trên thẻ sản phẩm cập nhật.
- [ ] Ngừng bán → biến khỏi web, đơn cũ vẫn hiện đúng tên và giá lúc đặt.
- [ ] Rời trang khi chưa lưu → được hỏi lại.

### 3.4 Đơn hàng
- [ ] Tab trạng thái hiện đúng số lượng; lọc, tìm theo mã đơn (cả dạng không dấu gạch), SĐT, tên hoạt động.
- [ ] Chỉ hiện nút cho bước chuyển hợp lệ; thử chuyển sai qua công cụ → bị từ chối.
- [ ] Chuyển “Đang giao” yêu cầu nhập đơn vị vận chuyển và mã vận đơn.
- [ ] COD chuyển “Đã giao” → tự thành “Đã thanh toán”.
- [ ] “Xác nhận đã nhận tiền” cho đơn chuyển khoản hoạt động.
- [ ] Hủy đơn bắt buộc lý do; tồn kho được cộng lại.
- [ ] Hủy đơn đã thanh toán → có tùy chọn “Đã hoàn tiền”.
- [ ] Ghi chú nội bộ lưu được, khách không thấy khi tra cứu.
- [ ] Lịch sử trạng thái ghi đủ thời gian và người thao tác.

### 3.5 Tổng quan
- [ ] Số đơn chờ, đơn chưa thanh toán, doanh thu hôm nay và 7 ngày khớp với dữ liệu (đối chiếu tay với 5–10 đơn mẫu).
- [ ] Danh sách sắp hết hàng đúng.

---

## 4. Giao diện và trải nghiệm (đối chiếu `03`)

- [ ] Duyệt trang `/admin/ui-kit`: mọi component đúng màu, chữ, khoảng cách.
- [ ] Không có màu, cỡ chữ, bo góc nằm ngoài token (AI tìm mã màu viết trực tiếp trong code: phải trả về 0 kết quả).
- [ ] Dấu tiếng Việt hiển thị đẹp ở mọi cỡ chữ Cormorant, không bị cắt.
- [ ] Không có thanh cuộn ngang ở chiều rộng **360px**.
- [ ] Ảnh sản phẩm đồng nhất tỉ lệ 4:5, không méo, không nhảy bố cục khi tải.
- [ ] Hiệu ứng chuyển động mượt; bật “Giảm chuyển động” trong máy → hiệu ứng trượt tắt.
- [ ] Dùng được toàn bộ luồng mua hàng **chỉ bằng bàn phím** trên máy tính.
- [ ] Vùng bấm trên điện thoại đủ lớn, không bấm nhầm.
- [ ] Mọi nút có trạng thái đang xử lý; mọi danh sách có trạng thái rỗng và khung tải.
- [ ] Nội dung chữ: không lỗi chính tả, giọng văn đúng `03` mục 1.3.

---

## 5. Bảo mật (đối chiếu `08` Phần I)

- [ ] Toàn bộ checklist `08` mục 1–8 đã đánh dấu.
- [ ] Kiểm tra header bảo mật bằng công cụ quét header trực tuyến: đạt mức tốt.
- [ ] Nhập `<script>alert(1)</script>` vào tên khách, ghi chú, lời nhắn → hiển thị dạng chữ ở web, admin và Telegram, không chạy.
- [ ] Mã nguồn và lịch sử Git không chứa khóa bí mật (bật secret scanning, không có cảnh báo).
- [ ] Preview không kết nối database production.

---

## 6. SEO (đối chiếu `08` Phần II)

- [ ] Mỗi trang có title và description riêng, đúng mẫu.
- [ ] Chia sẻ link sản phẩm lên Zalo và Facebook hiện đúng ảnh, tên, mô tả.
- [ ] `/sitemap.xml` liệt kê đủ trang công khai, không có trang Nháp; `/robots.txt` chặn đúng đường dẫn.
- [ ] Rich Results Test nhận diện `Product` và `BreadcrumbList` không lỗi.
- [ ] Trang thanh toán, giỏ, tìm kiếm, admin có `noindex`.

---

## 7. Hiệu năng (đối chiếu `08` Phần III)

- [ ] PageSpeed Insights (điện thoại) cho trang chủ, danh sách, chi tiết: Performance ≥ 85, LCP < 2.5s, CLS < 0.1.
- [ ] Trang danh sách 24 sản phẩm tải mượt trên 4G.
- [ ] Ảnh nhận từ Cloudinary ở định dạng hiện đại (WebP/AVIF) và đúng kích thước.

---

## 8. Vận hành (đối chiếu `09`)

- [ ] Biến môi trường production đầy đủ, `TELEGRAM_ENABLED=true`, `NEXT_PUBLIC_SITE_URL` là tên miền chính.
- [ ] Workflow sao lưu chạy thành công ít nhất 1 lần; **diễn tập khôi phục** bản sao lưu vào một branch Neon mới thành công.
- [ ] Health check gửi Telegram khi cố ý làm hỏng (thử trên preview).
- [ ] Tác vụ dọn dẹp chạy thành công; gọi `/api/cron/*` không có `CRON_SECRET` → bị từ chối.
- [ ] Quay lại bản deploy trước trên Netlify được (thử một lần).
- [ ] Đã ghi ngày kiểm tra gói dịch vụ vào `09` mục 10.

---

## 9. Ngày ra mắt

### 9.1 Trước khi mở cửa
- [ ] Xóa toàn bộ dữ liệu mẫu trên production (sản phẩm, đơn mẫu); chỉ giữ tài khoản admin.
- [ ] Nhập sản phẩm thật: ảnh thật, mô tả riêng, giá, tồn kho đúng.
- [ ] Thông tin ngân hàng thật; **chuyển thử 2.000₫** bằng QR trên một đơn thử để chắc chắn tiền về đúng tài khoản, rồi hủy đơn thử.
- [ ] Đặt một đơn COD thật giao cho chính mình hoặc người quen để kiểm tra toàn bộ quy trình.
- [ ] Nội dung chính sách, thông tin người bán ở chân trang đầy đủ (`08` Phần IV).
- [ ] Tên miền chính hoạt động, HTTPS, `www` chuyển hướng đúng.
- [ ] Google Search Console đã xác minh, đã gửi sitemap; Google Analytics nhận dữ liệu.
- [ ] Gắn tag `v0.1.0`, cập nhật `CHANGELOG.md`.

### 9.2 Tuần đầu sau ra mắt
- [ ] Mỗi ngày: kiểm tra Telegram, đơn chờ, log lỗi Netlify.
- [ ] Ngày 3 và ngày 7: xem credits Netlify, ước tính đủ dùng cả tháng không (`09` mục 2.1).
- [ ] Ghi lại phản hồi của khách vào mục 11 để đưa vào bản P1.

---

## 10. Kiểm thử lại sau mỗi lần phát hành nhỏ

Không cần chạy toàn bộ file. Tối thiểu:
- [ ] CI xanh + E2E nếu thay đổi chạm luồng đặt hàng hoặc admin đơn hàng.
- [ ] Kiểm tra nhanh `09` mục 5.2.
- [ ] Các mục trong file này liên quan trực tiếp tới phần vừa sửa.

---

## 11. Sổ ghi lỗi

| # | Mục | Mô tả lỗi | Thiết bị | Mức độ (Cao/Vừa/Thấp) | Trạng thái |
|---|---|---|---|---|---|
| 1 | | | | | |

**Quy tắc ra mắt:** không còn lỗi mức **Cao** (mất tiền, mất đơn, sai giá, lộ dữ liệu, không đặt được hàng). Lỗi Vừa/Thấp có thể ra mắt nếu đã ghi kế hoạch sửa.

---

## Nhật ký thay đổi

| Phiên bản | Ngày | Thay đổi |
|---|---|---|
| v1.0 | 2026-10-05 | Bản đầu tiên |
