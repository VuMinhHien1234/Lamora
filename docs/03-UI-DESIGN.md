# 03 — UI DESIGN: Hệ thống thiết kế Bánh Mì Thanh Long

> Dựa trên `00-MASTER-PLAN.md` v1.0, `01-TECH-STANDARDS.md` v2.0, `05-SHOP-PAGES.md` v2.0, `06-ADMIN-PAGES.md` v2.0 · Phiên bản: v2.0 · 2026-10-07
>
> File này là **nguồn duy nhất** cho màu, chữ, khoảng cách, component và bố cục. AI viết giao diện PHẢI dùng token ở đây, KHÔNG ĐƯỢC tự đặt mã màu, cỡ chữ hay bo góc mới (`01` mục 9.4).
> Thay toàn bộ hướng “Atelier lụa” của Lamora. Cấu trúc component cũ được giữ, chỉ đổi token và một số component (mục 8).

---

## 1. Định hướng thẩm mỹ

### 1.1 Ý tưởng chủ đạo: “Lò bánh phố”

Bánh Mì Thanh Long là **tiệm bánh mì quen của khu phố**: vỏ bánh vàng giòn, nhân đầy đặn, chủ tiệm niềm nở. Website phải làm người xem **thấy đói** trong 3 giây đầu và **tìm được nút đặt món / số điện thoại** trong 5 giây.

| Nên có | Không nên có |
|---|---|
| Ảnh món chụp cận, ánh sáng ấm, thấy rõ nhân | Ảnh tối, chụp xa, nền lộn xộn |
| Nền kem ấm như bột mì, chữ nâu đậm | Trắng lạnh, đen tuyệt đối |
| Một màu nhấn mạnh: **hồng thanh long** cho nút hành động | Nhiều màu nổi tranh nhau |
| Góc bo tròn thân thiện, nút dạng viên thuốc | Góc vuông sắc lạnh kiểu cao cấp |
| Giá to, rõ, dễ so sánh | Giấu giá, chữ giá nhỏ |
| Giờ mở cửa và SĐT luôn trong tầm tay | Bắt khách tìm thông tin liên hệ |
| Chi tiết vui nhẹ: hình vẽ nét lá, lát thanh long | Hoạt hình lòe loẹt, popup, đếm ngược |

### 1.2 Ba nguyên tắc khi phân vân
1. **Ảnh món trước, chữ sau.** Ảnh bán món; chữ chỉ nói thành phần và giá.
2. **Một chạm tới tiệm.** Mọi màn hình đều có đường tới: đặt món, gọi, Zalo, Telegram.
3. **Nhất quán hơn sáng tạo.** Dùng lại component có sẵn trước khi tạo cái mới.

### 1.3 Giọng văn
- Xưng “bạn”, tiệm tự xưng “Thanh Long” hoặc “tiệm”. Câu ngắn, ấm, có chút vui.

| Tình huống | Viết | Không viết |
|---|---|---|
| Nút chính | “Đặt món” | “MUA NGAY!!!” |
| Món tạm hết | “Hôm nay tạm hết, mai quay lại nhé” | “Out of stock” |
| Gửi xong | “Thanh Long đã nhận yêu cầu của bạn. Tiệm sẽ gọi lại trong ít phút để chốt món.” | “Đặt hàng thành công!” |
| Ngoài giờ | “Tiệm đang nghỉ. Bạn vẫn gửi yêu cầu được, sáng mai 6:00 tiệm gọi lại.” | “Shop đóng cửa” |
| Lỗi | “Có chút trục trặc. Bạn gọi thẳng 09xx xxx xxx giúp tiệm nhé.” | “Error 500” |
| Giá | “Giá tham khảo, chưa gồm phí giao” | (không ghi gì) |

---

## 2. Màu sắc

### 2.1 Bảng màu

| Token | Mã | Vai trò |
|---|---|---|
| `flour-50` | `#FFF8EE` | **Nền trang chính** (kem bột mì) |
| `flour-100` | `#F7EBD9` | Nền khối xen kẽ, nền ảnh món |
| `crust-200` | `#EAD7BC` | Đường viền, đường kẻ |
| `crust-300` | `#D9BF9A` | Viền khi hover |
| `crust-500` | `#C98A3D` | Vỏ bánh vàng nâu: trang trí, gạch dưới tiêu đề (**không làm chữ**) |
| `cocoa-500` | `#7A5A44` | Chữ phụ, chú thích, placeholder |
| `espresso-900` | `#2B1A12` | **Chữ chính**, footer |
| `dragon-600` | `#B5175A` | **Hồng thanh long**: nút chính, giá nhấn, link hover |
| `dragon-700` | `#951048` | Hover của nút chính |
| `dragon-100` | `#FBE3EC` | Nền nhấn nhẹ (dải thông báo, nhãn “Bán chạy”) |
| `leaf-700` | `#2F6B3A` | Xanh lá thanh long: “Đang mở cửa”, thành công, nhãn “Chay” |
| `leaf-100` | `#E3F0E1` | Nền thông báo thành công |
| `butter-400` | `#F2B33D` | Vàng bơ: nhãn “Món mới”, hình trang trí (**không làm chữ**) |
| `chili-700` | `#B3261E` | Nhãn “Cay”, lỗi |
| `warning-700` | `#8A5A00` | Cảnh báo (“Sắp đóng cửa”) |

### 2.2 Quy tắc dùng màu
- Tỉ lệ trên một màn hình: ~75% kem, 15% nâu, ≤ 10% hồng thanh long. **Hồng chỉ dành cho hành động** (nút đặt món, giá), không dùng làm nền khối lớn.
- Chữ chỉ dùng `espresso-900`, `cocoa-500`, `dragon-600`, `leaf-700`, `chili-700`, `warning-700` — đều đạt tương phản ≥ 4.5:1 trên `flour-50`. Chữ trên nền `dragon-600` hoặc `espresso-900` dùng `flour-50`.
- `crust-*`, `butter-400` chỉ trang trí, không làm màu chữ.
- KHÔNG dùng `#000`, `#FFF` thuần. Không làm dark mode cho web khách.

### 2.3 Khai báo token (Tailwind CSS v4, `src/app/globals.css`)

```css
@import "tailwindcss";

@theme {
  --color-flour-50: #FFF8EE;
  --color-flour-100: #F7EBD9;
  --color-crust-200: #EAD7BC;
  --color-crust-300: #D9BF9A;
  --color-crust-500: #C98A3D;
  --color-cocoa-500: #7A5A44;
  --color-espresso-900: #2B1A12;
  --color-dragon-100: #FBE3EC;
  --color-dragon-600: #B5175A;
  --color-dragon-700: #951048;
  --color-leaf-100: #E3F0E1;
  --color-leaf-700: #2F6B3A;
  --color-butter-400: #F2B33D;
  --color-chili-700: #B3261E;
  --color-warning-700: #8A5A00;

  --font-display: var(--font-baloo), "Trebuchet MS", sans-serif;
  --font-sans: var(--font-be-vietnam), system-ui, sans-serif;

  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 20px;
  --radius-pill: 999px;

  --ease-soft: cubic-bezier(0.22, 1, 0.36, 1);
}
```

> Khi chuyển đổi (`12` bước 8): thay khối `@theme` cũ, rồi tìm–thay tên token cũ (`ivory-50` → `flour-50`, `ink-900` → `espresso-900`, `rose-700` → `dragon-600`, `sage-700` → `leaf-700`, `stone-500` → `cocoa-500`, `sand-200` → `crust-200`, `error-700` → `chili-700`…). Trang `/admin/ui-kit` dùng để duyệt kết quả.

---

## 3. Chữ

### 3.1 Font

| Vai trò | Font | Độ đậm | Ghi chú |
|---|---|---|---|
| Tiêu đề, tên món, giá | **Baloo 2** | 600, 700, 800 | Tròn, đậm, thân thiện, hợp đồ ăn đường phố |
| Nội dung, nút, form, admin | **Be Vietnam Pro** | 400, 500, 600 | Giữ từ bản cũ, dấu tiếng Việt rõ |

- Tải bằng `next/font/google`, subset `latin` + `vietnamese`, `display: swap`. **Kiểm tra Baloo 2 có subset `vietnamese` ở phiên bản đang cài**; nếu không, dùng `Lexend` 600–800 thay thế.
- Chuỗi kiểm tra dấu: “Bánh mì Thanh Long — giòn rụm, nhân đầy, nước sốt nhà làm ửng đỏ”. Dấu chồng (ẫ, ộ, ữ, ở) không chạm dòng trên.

### 3.2 Thang cỡ chữ

| Token | Font | Điện thoại | Máy tính | Line-height | Dùng cho |
|---|---|---|---|---|---|
| `display` | Baloo 800 | 40px | 64px | 1.05 | Tiêu đề ảnh lớn trang chủ |
| `h1` | Baloo 700 | 30px | 44px | 1.15 | Tiêu đề trang, tên món |
| `h2` | Baloo 700 | 26px | 34px | 1.2 | Tiêu đề khối, tên danh mục |
| `h3` | Baloo 600 | 19px | 22px | 1.3 | Tên món trên thẻ |
| `lead` | Be Vietnam 400 | 17px | 19px | 1.6 | Đoạn mở đầu |
| `body` | Be Vietnam 400 | 15px | 16px | 1.65 | Nội dung |
| `small` | Be Vietnam 400 | 13px | 14px | 1.5 | Thành phần, chú thích |
| `label` | Be Vietnam 600 | 13px | 14px | 1.3 | Nhãn form, nút, nhãn món |
| `price` | Baloo 700 | 20px | 24px | 1 | Giá, màu `dragon-600` |

### 3.3 Quy tắc chữ
- Giá định dạng `25.000₫` qua `lib/money.ts`. Món nhiều lựa chọn: “Từ 25.000₫”.
- Nội dung tối đa ~68 ký tự mỗi dòng.
- Không viết toàn bộ tiêu đề bằng chữ in hoa.

---

## 4. Lưới, khoảng cách, hình khối

### 4.1 Khoảng cách
Thang bội số 4px: `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96`.

| Mục | Điện thoại | Máy tính |
|---|---|---|
| Lề hai bên trang | 16px | 32px |
| Khoảng cách giữa các khối lớn | 48px | 96px |
| Tiêu đề khối → nội dung | 16px | 32px |
| Khe lưới thẻ món | 12px | 24px |

### 4.2 Lưới
- Nội dung rộng tối đa **1200px**, căn giữa.
- Breakpoint: `sm 640` · `md 768` · `lg 1024` · `xl 1280`.

### 4.3 Hình khối
| Mục | Quy định |
|---|---|
| Bo góc | Thẻ món, ảnh: `radius-lg` (20px). Input: `radius-md`. Nút: `radius-pill` |
| Viền | 1px `crust-200`; hover `crust-300`; đang chọn 2px `dragon-600` |
| Đổ bóng | Thẻ món khi hover và thanh dính đáy: `0 8px 24px rgba(43,26,18,0.10)` |
| Trang trí | Nét vẽ lá / lát thanh long dạng SVG đơn sắc `crust-500` hoặc `dragon-100`, đặt góc khối, không che chữ |

### 4.4 Tỉ lệ ảnh
| Ảnh | Tỉ lệ |
|---|---|
| Ảnh món (thẻ và chi tiết) | **4:3** (ngang, thấy rõ ổ bánh cắt đôi) |
| Ảnh món trong danh sách gọn | 1:1, 72px |
| Ảnh lớn trang chủ | 16:9 máy tính · 4:5 điện thoại |
| Ảnh danh mục | 1:1 |

---

## 5. Hình ảnh và biểu tượng

### 5.1 Hướng dẫn chụp ảnh món
- Ánh sáng tự nhiên, ấm; chụp ổ bánh **cắt đôi** để thấy lớp nhân, hơi nghiêng 30–45°.
- Nền thống nhất: mặt gỗ sáng hoặc giấy gói bánh mì nâu. Toàn bộ ảnh món dùng chung một nền.
- Mỗi món tối thiểu 2 ảnh: (1) cận ổ bánh trên nền thống nhất, (2) cảnh tại tiệm hoặc cầm trên tay.
- Thêm 3–5 ảnh không gian tiệm và người làm bánh cho trang chủ / giới thiệu.
- Xuất ảnh cạnh dài ≥ 1600px; Cloudinary tự nén (`f_auto,q_auto`).

### 5.2 Logo tạm (dạng chữ)
```
   🥖  BÁNH MÌ
       THANH LONG
```
- “BÁNH MÌ”: Be Vietnam Pro 600, giãn chữ 0.15em, màu `cocoa-500`.
- “THANH LONG”: Baloo 2 800, màu `dragon-600`.
- Biểu tượng: lát thanh long tròn đơn giản (SVG, `dragon-600` + chấm `espresso-900`) thay cho emoji. Trên header điện thoại chỉ dùng biểu tượng + “Thanh Long”.

### 5.3 Biểu tượng
- Bộ icon **Lucide**, nét `1.75`, cỡ 20px / 22px, màu `espresso-900`.
- Dùng cho: menu, đóng, điện thoại, bản đồ, đồng hồ, cộng/trừ, sao chép, mũi tên; Zalo và Telegram dùng logo gốc thu nhỏ.

---

## 6. Chuyển động

| Tình huống | Hiệu ứng |
|---|---|
| Khối xuất hiện khi cuộn | Mờ → rõ + trượt lên 12px, 400ms |
| Hover thẻ món | Nhấc lên 2px + đổ bóng, ảnh phóng 1.03 trong 500ms |
| Bấm nút +/− số lượng | Số nảy nhẹ 1.1 trong 150ms |
| Thanh đặt món dính đáy | Trượt lên khi có món đầu tiên, 300ms |
| Toast | Trượt lên từ dưới, tự ẩn sau 3 giây |

Tôn trọng `prefers-reduced-motion`. KHÔNG dùng: parallax, xoay, popup tự bật.

---

## 7. Component cơ bản (`src/components/ui`)

### 7.1 Nút (`Button`)
| Biến thể | Kiểu | Dùng cho |
|---|---|---|
| `primary` | Nền `dragon-600`, chữ `flour-50`, `label` | Đặt món, Gửi yêu cầu |
| `secondary` | Viền 1.5px `espresso-900`, nền trong suốt | Xem thực đơn, Chỉ đường |
| `ghost` | Chữ + gạch dưới | Link hành động trong đoạn văn |
| `call` | Nền `leaf-700`, chữ `flour-50`, icon điện thoại | Gọi tiệm |
| `subtle` (admin) | Nền `flour-100` | Nút phụ admin |
| `danger` (admin) | Viền + chữ `chili-700` | Hủy, xóa |

- Cao 48px (điện thoại) / 52px (máy tính); admin 40px. Lề ngang 24px. Bo `radius-pill`.
- Hover `primary`: `dragon-700`. Đang xử lý: giữ chiều rộng, hiện vòng xoay nhỏ, khóa bấm.
- Viền focus 2px `dragon-600` cách 2px.

### 7.2 Ô nhập (`Input`, `Textarea`, `Select`, `RadioCards`)
- Nhãn trên ô: `label`, `espresso-900`. Trường bắt buộc có `*` màu `dragon-600`.
- Ô cao 48px, viền 1px `crust-200`, nền `flour-50`, bo `radius-md`. Focus: viền `espresso-900`.
- Lỗi: viền `chili-700`, dòng lỗi `small` màu `chili-700`.
- Ô số điện thoại: `inputMode="tel"`, `autoComplete="tel"`.
- `RadioCards`: lựa chọn dạng thẻ lớn (dùng cho “Lấy tại quầy / Giao tận nơi”, chọn lựa chọn giá của món).

### 7.3 Các component khác
| Component | Mô tả |
|---|---|
| `Price` | Giá `price` màu `dragon-600`; “Từ” đứng trước khi món có nhiều lựa chọn |
| `TagBadge` | Viên thuốc cao 24px: Bán chạy (`dragon-100`/`dragon-600`), Món mới (`butter-400`/`espresso-900`), Cay (`chili-700` viền), Chay (`leaf-100`/`leaf-700`) |
| `AvailabilityBadge` | “Tạm hết hôm nay”: nền `flour-100`, chữ `cocoa-500`; ảnh món giảm độ đậm 50% |
| `OpenStatus` | Chấm tròn + chữ: “Đang mở cửa · đến 21:00” (`leaf-700`), “Sắp đóng cửa” (`warning-700`), “Đang nghỉ · mở lại 6:00” (`cocoa-500`). Tính theo giờ `Asia/Ho_Chi_Minh` **ở trình duyệt** để trang vẫn cache được |
| `QuantityStepper` | [ − ] số [ + ], cao 44px, nút tròn |
| `Drawer` | Menu (trái); danh sách món đã chọn trên điện thoại (dưới) |
| `Accordion` | Thành phần · Lưu ý dị ứng |
| `Toast` | Nền `espresso-900`, chữ `flour-50` |
| `Skeleton` | Khối `flour-100` nhấp nháy nhẹ |
| `EmptyState` | Hình lát thanh long + tiêu đề `h3` + một câu + một nút |
| `CopyButton` | Sao chép mã yêu cầu, SĐT, địa chỉ; xong đổi thành ✓ trong 2 giây |

---

## 8. Component riêng của tiệm

### 8.1 Thẻ món (`MenuItemCard`) — dùng ở trang chủ và lưới thực đơn
```
┌─────────────────────────┐
│ BÁN CHẠY      🌶 CAY      │  ← TagBadge
│     [ảnh 4:3]           │
└─────────────────────────┘
  Bánh mì thịt nguội          ← h3
  Pate gan, chả lụa, đồ chua  ← small, cocoa-500, 1 dòng
  Từ 25.000₫        ( + )     ← Price · nút tròn “Đặt món này”
```
- Bấm thẻ → chi tiết món. Bấm `( + )` → tới `/dat-mon?mon=<slug>` với món đã được chọn sẵn.
- Món tạm hết: ảnh mờ, `AvailabilityBadge` thay cho nút `( + )`.

### 8.2 Dòng món gọn (`MenuRow`) — dùng ở trang thực đơn trên điện thoại và trong form đặt món
```
[ảnh 1:1]  Bánh mì thịt nguội            25.000₫
           Pate, chả lụa, đồ chua        [− 2 +]
```

### 8.3 Thẻ thông tin tiệm (`StoreInfoCard`)
Địa chỉ (bấm mở Google Maps), `OpenStatus`, bảng giờ mở cửa theo thứ, SĐT, nút `call` + Zalo + Telegram. Nền `flour-100`, bo `radius-lg`.

### 8.4 Nút liên hệ nổi (`ContactFloatingButtons`)
Ba nút tròn 52px chồng dọc góc phải dưới: **Gọi** (`leaf-700`), **Zalo**, **Telegram**. Trên trang đặt món và chi tiết món (điện thoại) thu thành một nút “Liên hệ” để không che thanh dính đáy.

### 8.5 Thanh đặt món dính đáy (`OrderBar`) — trang đặt món, điện thoại
```
┌───────────────────────────────────────┐
│ 3 phần · 75.000₫ (tham khảo) ▴  ▭ GỬI  │
└───────────────────────────────────────┘
```
Bấm ▴ mở `Drawer` liệt kê món đã chọn.

---

## 9. Bố cục từng trang (wireframe)

### 9.1 Khung chung
**Header điện thoại (cao 56px, dính khi cuộn)**
```
│ ☰    (●) Thanh Long                ▭ Đặt món │
```
**Header máy tính (cao 72px)**
```
│ (●) BÁNH MÌ THANH LONG   Thực đơn  Giới thiệu  Liên hệ   ● Đang mở · đến 21:00   ▭ ĐẶT MÓN │
```
**Dải thông báo (tùy chọn, config)**: nền `dragon-100`: “Nhận đặt bánh mì số lượng lớn cho văn phòng — gọi 09xx”.

**Footer**: nền `espresso-900`, chữ `flour-50`. Logo, địa chỉ, giờ mở cửa, SĐT, Zalo, Telegram, Facebook; link Thực đơn · Giới thiệu · Liên hệ · Chính sách bảo mật; thông tin hộ kinh doanh.

### 9.2 Trang chủ
```
ĐIỆN THOẠI                                   MÁY TÍNH
┌──────────────────┐                         ┌──────────────────────────────────────┐
│ [ảnh 4:5 ổ bánh] │                         │ [ảnh 16:9]   Giòn rụm, nhân đầy      │
│ Giòn rụm,        │  (display)              │              mỗi sáng (display)      │
│ nhân đầy mỗi sáng│                         │              ● Đang mở · đến 21:00   │
│ ● Đang mở cửa    │                         │              ▭ ĐẶT MÓN  ▭ XEM THỰC ĐƠN│
│ ▭ ĐẶT MÓN        │                         └──────────────────────────────────────┘
│ ▭ XEM THỰC ĐƠN   │
└──────────────────┘
  MÓN NỔI BẬT                    Xem thực đơn →
  [thẻ][thẻ] → (cuộn ngang)      [thẻ][thẻ][thẻ][thẻ]
  THỰC ĐƠN THEO DANH MỤC
  (Bánh mì kẹp)(Combo)(Đồ uống)(Món thêm)   ← ô ảnh 1:1, bấm tới /thuc-don/<slug>
  CÂU CHUYỆN THANH LONG
  [ảnh tiệm]  Đoạn 2–3 câu + “Đọc thêm →”
  3 CAM KẾT
  🥖 Bánh nướng mỗi sáng · 🥫 Pate & sốt nhà làm · ⏱ Gọi lại trong 10 phút
  GHÉ TIỆM
  [StoreInfoCard]  [ảnh bản đồ tĩnh → mở Google Maps]
```

### 9.3 Thực đơn (`/thuc-don`)
```
  Thực đơn                                (h1)
  Giá tham khảo · chưa gồm phí giao        (small)
  [Tất cả][Bánh mì kẹp][Combo][Đồ uống][Món thêm]   ← tab dính dưới header, cuộn ngang
  ── Bánh mì kẹp ──                        (h2, có id để nhảy tới)
  Điện thoại: danh sách MenuRow
  Máy tính:   lưới 3 cột MenuItemCard
  ── Combo ── …
```
Một trang dài, tab cuộn tới khối tương ứng. `/thuc-don/<slug>` hiện riêng một danh mục (cho SEO và chia sẻ link).

### 9.4 Chi tiết món (`/mon/[slug]`)
```
ĐIỆN THOẠI                               MÁY TÍNH (ảnh 7 cột · thông tin 5 cột)
[ảnh 4:3 vuốt ngang] ● ○                 [ảnh lớn]        │ BÁNH MÌ KẸP
BÁN CHẠY · CAY                           [ảnh nhỏ][ảnh nhỏ]│ Bánh mì thịt nguội (h1)
Bánh mì thịt nguội                                         │ Từ 25.000₫
Từ 25.000₫                                                 │ Mô tả ngắn
Mô tả ngắn                                                 │ CHỌN LOẠI
CHỌN LOẠI                                                  │ (◉ Thường 25.000₫)(○ Đặc biệt 35.000₫)
(◉ Thường 25.000₫) (○ Đặc biệt 35.000₫)                    │ [− 1 +]  ▭ ĐẶT MÓN NÀY
+ Thành phần                                               │ + Thành phần
+ Lưu ý dị ứng                                             │ + Lưu ý dị ứng
CÓ THỂ BẠN THÍCH  [thẻ][thẻ] →                             │ Hỏi tiệm qua Zalo →
┌──────────────────────────────────┐
│ 25.000₫  [− 1 +]   ▭ ĐẶT MÓN NÀY  │  ← dính đáy
└──────────────────────────────────┘
```
“Đặt món này” → `/dat-mon?mon=<slug>&loai=<optionId>&sl=<số>`.

### 9.5 Đặt món (`/dat-mon`)
```
MÁY TÍNH (chọn món 7 cột · thông tin 5 cột dính khi cuộn)
  Đặt món                                │ THÔNG TIN NHẬN MÓN
  Chọn món, tiệm sẽ gọi lại để chốt       │ Họ tên*         Số điện thoại*
  [tab danh mục]                          │ (◉ Lấy tại quầy) (○ Giao tận nơi)
  MenuRow có [− 0 +] cho từng lựa chọn    │ Địa chỉ giao*  (khi chọn giao)
  …                                       │ Nhận lúc: (◉ Sớm nhất) (○ Hẹn giờ ▾)
                                          │ Ghi chú (không hành, ít cay…)
                                          │ ── Món đã chọn ──
                                          │ Bánh mì thịt nguội · Thường ×2  50.000₫
                                          │ Tạm tính (tham khảo)            50.000₫
                                          │ ☐ Đồng ý Chính sách bảo mật
                                          │ ▭ GỬI YÊU CẦU ĐẶT MÓN
                                          │ Hoặc gọi 09xx · Zalo · Telegram
ĐIỆN THOẠI: bước 1 chọn món (OrderBar dính đáy) → bấm “Tiếp tục” → bước 2 thông tin nhận món, cùng một trang (cuộn tới).
```

### 9.6 Đã gửi (`/dat-mon/da-gui`)
```
            (●) hình lát thanh long
   Thanh Long đã nhận yêu cầu của bạn     (h1)
   Mã yêu cầu: TL-261007-K7QF  [Sao chép]
   Tiệm sẽ gọi số 0912***678 trong ít phút để chốt món.
   (Ngoài giờ: “Tiệm đang nghỉ, sẽ gọi lại lúc 6:00”)
   ┌ Tóm tắt: món, cách nhận, giờ nhận, tạm tính ┐
   Cần gấp? ▭ GỌI TIỆM   Zalo   Telegram
   Xem thực đơn →
```

### 9.7 Liên hệ (`/lien-he`)
```
  Ghé Thanh Long                       (h1)
  [StoreInfoCard]                      [Bản đồ: ảnh tĩnh, bấm để tải Google Maps]
  ── Gửi lời nhắn cho tiệm ──
  Họ tên* · Số điện thoại* · Nội dung*  ▭ GỬI
  Đặt món? → dùng trang Đặt món (link)
```

### 9.8 Trang tĩnh
Cột nội dung giữa rộng tối đa 720px; tiêu đề `h1`, nội dung `body`.

---

## 10. Giao diện quản trị

Dùng chung token, ưu tiên mật độ thông tin và **dùng tốt trên điện thoại** (chủ tiệm xem yêu cầu khi đang đứng quầy).

| Mục | Quy định |
|---|---|
| Nền | Khung `flour-100`, vùng nội dung `flour-50` viền `crust-200` |
| Chữ | Be Vietnam Pro; chỉ tiêu đề trang dùng Baloo `h2` |
| Nút | Cao 40px (điện thoại 44px) |
| Menu bên | Rộng 240px, nền `espresso-900`, mục đang chọn có vạch trái 3px `dragon-600` |
| Bảng | Dòng cao 56px; điện thoại chuyển thành thẻ |

**Màu trạng thái yêu cầu (`StatusBadge`)**
| Trạng thái | Nền | Chữ |
|---|---|---|
| Mới | `dragon-100` | `dragon-600` |
| Đã liên hệ | `flour-100` | `espresso-900` |
| Hoàn tất | `leaf-100` | `leaf-700` |
| Đã hủy | `crust-200` | `cocoa-500` |
| Chưa gửi Telegram | viền `warning-700` | `warning-700` |

---

## 11. Khả năng truy cập (bắt buộc)
- Tương phản chữ ≥ 4.5:1 (đã tính sẵn ở mục 2).
- Mọi ảnh có `alt` tiếng Việt mô tả món; ảnh trang trí `alt=""`.
- Mọi ô nhập có nhãn hiển thị.
- Dùng được bằng bàn phím; viền focus luôn thấy.
- Vùng bấm ≥ 44×44px.
- Nút +/− có nhãn cho trình đọc màn hình: “Thêm một Bánh mì thịt nguội, loại Thường”.
- Nhãn “Cay”, “Chay” có chữ, không chỉ dựa vào màu.

---

## 12. Cách AI dựng giao diện theo file này
1. Thay token mục 2–4 trong `globals.css`, đổi font mục 3, cập nhật component mục 7 (giữ API component cũ khi có thể). Duyệt ở `/admin/ui-kit`.
2. Chủ tiệm duyệt `ui-kit` trên điện thoại và máy tính, chỉnh token trước khi dựng trang.
3. Dựng component mục 8, rồi từng trang theo wireframe mục 9.

---

## 13. Cần xác nhận
1. Đồng ý hướng “Lò bánh phố” với màu nhấn hồng thanh long? Nếu muốn khác (ví dụ vàng – đỏ truyền thống), chỉ cần đổi bảng màu mục 2.
2. Có logo thật chưa? Gửi file SVG khi có.
3. Có Fanpage / Instagram / TikTok của tiệm để đặt link và tham khảo ảnh?

---

## Nhật ký thay đổi

| Phiên bản | Ngày | Thay đổi |
|---|---|---|
| v2.0 | 2026-10-07 | Thay toàn bộ hướng “Atelier lụa” bằng “Lò bánh phố” cho Bánh Mì Thanh Long: bảng màu, font Baloo 2, bo góc tròn, component thực đơn/đặt món/thông tin tiệm, wireframe mới; bỏ component giỏ hàng, thanh toán, chuyển khoản, timeline đơn |
| v1.0 | 2026-10-05 | (Lamora) Bản đầu tiên |
