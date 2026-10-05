# 03 — UI DESIGN: Hệ thống thiết kế Lamora Flower

> Dựa trên `00-MASTER-PLAN.md` v0.2, `01-TECH-STANDARDS.md` v1.0, `05-SHOP-PAGES.md` v1.0, `06-ADMIN-PAGES.md` v1.0 · Phiên bản: v1.0 · 2026-10-05
>
> File này là **nguồn duy nhất** cho màu, chữ, khoảng cách, component và bố cục. AI viết giao diện PHẢI dùng token ở đây, KHÔNG ĐƯỢC tự đặt mã màu, cỡ chữ hay bo góc mới (xem `01` mục 9.4).

---

## 1. Định hướng thẩm mỹ

### 1.1 Ý tưởng chủ đạo: “Atelier lụa”

Lamora Flower được thể hiện như **một xưởng hoa lụa cao cấp**, không phải một cửa hàng online thông thường. Website giống một cuốn tạp chí ảnh về hoa: ảnh lớn, nhiều khoảng trắng, chữ có chân thanh mảnh, chi tiết tiết chế.

| Nên có | Không nên có |
|---|---|
| Khoảng trắng rộng rãi, nhịp chậm | Nhồi nhiều sản phẩm, banner chồng banner |
| Ảnh là nhân vật chính | Hình minh họa hoạt hình, icon màu mè |
| Nền ngà ấm, chữ nâu mực | Trắng tinh lạnh lẽo, đen tuyệt đối |
| Góc vuông, đường kẻ mảnh 1px | Bo tròn lớn, đổ bóng đậm |
| Một điểm nhấn màu duy nhất mỗi khu vực | Nhiều màu nổi tranh nhau |
| Chữ in hoa giãn rộng cho nhãn nhỏ | Chữ đậm to cho mọi tiêu đề |
| Chuyển động chậm, mềm | Popup, nhấp nháy, đếm ngược khuyến mãi |

### 1.2 Ba nguyên tắc khi phân vân
1. **Bớt đi một thứ.** Nếu một khối có thể bỏ mà trang vẫn hiểu được, hãy bỏ.
2. **Ảnh trước, chữ sau.** Chữ chỉ dẫn dắt; ảnh mới là thứ bán hàng.
3. **Nhất quán hơn sáng tạo.** Dùng lại component có sẵn trước khi tạo cái mới.

### 1.3 Giọng văn
- Xưng “bạn”, câu ngắn, nhẹ nhàng, không dùng dấu chấm than liên tiếp.
- Tiêu đề gợi cảm xúc, nội dung nói rõ thông tin.

| Tình huống | Viết | Không viết |
|---|---|---|
| Nút thêm giỏ | “Thêm vào giỏ” | “MUA NGAY KẺO HẾT!!!” |
| Giỏ trống | “Giỏ hàng của bạn đang trống. Dạo một vòng bộ sưu tập nhé.” | “Không có dữ liệu” |
| Đặt hàng xong | “Cảm ơn bạn đã chọn Lamora. Chúng tôi sẽ gọi xác nhận trong giờ làm việc.” | “Đặt hàng thành công!” |
| Lỗi | “Có chút trục trặc. Bạn thử lại giúp chúng tôi, hoặc nhắn Zalo để được hỗ trợ ngay.” | “Error 500” |

---

## 2. Màu sắc

### 2.1 Bảng màu

| Token | Mã | Vai trò |
|---|---|---|
| `ivory-50` | `#FCFAF6` | **Nền trang chính** |
| `ivory-100` | `#F6F1EA` | Nền khối xen kẽ, nền ảnh sản phẩm |
| `sand-200` | `#E9E0D4` | Đường viền, đường kẻ, nền ô input khi tắt |
| `sand-300` | `#D9CCBC` | Viền khi hover |
| `stone-500` | `#6E625A` | Chữ phụ, chú thích, placeholder |
| `ink-900` | `#2A2422` | **Chữ chính**, nút chính, footer |
| `blush-100` | `#F3E4E0` | Nền nhấn nhẹ (dải thông báo, nhãn) |
| `rose-400` | `#C08A86` | Điểm nhấn trang trí: đường gạch dưới, ô màu đang chọn |
| `rose-700` | `#9A5B58` | Giá khuyến mãi, chữ nhấn, link khi hover |
| `sage-100` | `#E7EBE2` | Nền thông báo thành công |
| `sage-700` | `#5E6B57` | Chữ trạng thái thành công, “Còn hàng” |
| `gold-500` | `#B39566` | Đường kẻ mảnh trang trí, viền focus, ký hiệu nhỏ |
| `error-700` | `#A3433B` | Lỗi |
| `warning-700` | `#8E6420` | Cảnh báo (sắp hết hàng, giá thay đổi) |

### 2.2 Quy tắc dùng màu
- Tỉ lệ trên một màn hình: **khoảng 80% ngà**, 15% nâu mực, tối đa 5% hồng/vàng.
- Chữ chỉ dùng `ink-900`, `stone-500`, `rose-700`, `sage-700`, `error-700`, `warning-700`. Các màu này đều đạt độ tương phản ≥ 4.5:1 trên nền `ivory-50`.
- `rose-400`, `gold-500`, `sand-*` **không dùng làm màu chữ** (tương phản thấp), chỉ dùng cho đường kẻ và trang trí.
- KHÔNG dùng đen `#000` hoặc trắng `#FFF` thuần. Chữ trên nền tối dùng `ivory-50`.
- Không làm chế độ tối (dark mode) cho web khách: thương hiệu giữ một diện mạo duy nhất.

### 2.3 Khai báo token (Tailwind CSS v4, `src/app/globals.css`)

```css
@import "tailwindcss";

@theme {
  --color-ivory-50: #FCFAF6;
  --color-ivory-100: #F6F1EA;
  --color-sand-200: #E9E0D4;
  --color-sand-300: #D9CCBC;
  --color-stone-500: #6E625A;
  --color-ink-900: #2A2422;
  --color-blush-100: #F3E4E0;
  --color-rose-400: #C08A86;
  --color-rose-700: #9A5B58;
  --color-sage-100: #E7EBE2;
  --color-sage-700: #5E6B57;
  --color-gold-500: #B39566;
  --color-error-700: #A3433B;
  --color-warning-700: #8E6420;

  --font-display: var(--font-cormorant), "Times New Roman", serif;
  --font-sans: var(--font-be-vietnam), system-ui, sans-serif;

  --radius-none: 0;
  --radius-xs: 2px;

  --ease-soft: cubic-bezier(0.22, 1, 0.36, 1);
}
```

> Nếu phiên bản Tailwind lúc khởi tạo dùng cách khai báo khác, giữ nguyên **tên và giá trị token**, chỉ đổi cú pháp.

---

## 3. Chữ

### 3.1 Font

| Vai trò | Font | Độ đậm dùng | Ghi chú |
|---|---|---|---|
| Tiêu đề, tên sản phẩm, giá lớn | **Cormorant Garamond** | 400, 500, 600; *italic 400* | Serif cổ điển, thanh mảnh, sang trọng |
| Nội dung, nút, form, admin | **Be Vietnam Pro** | 300, 400, 500 | Sans thiết kế cho tiếng Việt, dấu rõ |

- Tải bằng `next/font/google`, chỉ lấy subset `latin` + `vietnamese`, `display: swap`.
- **Kiểm tra dấu tiếng Việt** ở cỡ lớn với chuỗi mẫu: “Hoa lụa Lamora — Những đóa mẫu đơn ửng hồng, dịu dàng và bền lâu”. Dấu chồng (ẫ, ộ, ữ, ở) không được chạm dòng trên.

### 3.2 Thang cỡ chữ

| Token | Font | Điện thoại | Máy tính | Line-height | Dùng cho |
|---|---|---|---|---|---|
| `display` | Cormorant 500 | 40px | 64px | 1.05 | Tiêu đề banner trang chủ |
| `h1` | Cormorant 500 | 32px | 44px | 1.1 | Tiêu đề trang, tên sản phẩm |
| `h2` | Cormorant 500 | 28px | 34px | 1.15 | Tiêu đề khối |
| `h3` | Cormorant 600 | 22px | 24px | 1.25 | Tiêu đề nhỏ, tên sản phẩm trong thẻ (máy tính) |
| `lead` | Be Vietnam Pro 300 | 17px | 19px | 1.6 | Đoạn mở đầu |
| `body` | Be Vietnam Pro 400 | 15px | 16px | 1.7 | Nội dung |
| `small` | Be Vietnam Pro 400 | 13px | 14px | 1.5 | Chú thích, thông tin phụ |
| `eyebrow` | Be Vietnam Pro 500, IN HOA, giãn 0.2em | 11px | 12px | 1.4 | Nhãn trên tiêu đề, menu, nút |
| `price` | Cormorant 600 | 20px | 24px | 1 | Giá |

### 3.3 Quy tắc chữ
- Tiêu đề lớn có thể dùng *italic* cho **một** từ để tạo điểm nhấn: “Bộ sưu tập *Thu*”.
- Độ dài dòng nội dung tối đa ~68 ký tự (`max-w-prose`).
- Số tiền định dạng `350.000₫` qua `lib/money.ts`, không viết “350k”.
- Nhãn dạng `eyebrow` đặt **trên** tiêu đề, cách 12px: `BỘ SƯU TẬP` → “Quà tặng mùa Thu”.

---

## 4. Lưới, khoảng cách, hình khối

### 4.1 Khoảng cách
Thang bội số 4px: `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128`.

| Mục | Điện thoại | Máy tính |
|---|---|---|
| Lề hai bên trang | 16px | 32px (≥1280px: 48px) |
| Khoảng cách giữa các khối lớn | 64px | 112px |
| Khoảng cách tiêu đề khối → nội dung | 24px | 40px |
| Khe lưới sản phẩm | 12px ngang · 32px dọc | 24px ngang · 48px dọc |

### 4.2 Lưới
- Chiều rộng nội dung tối đa **1320px**, căn giữa.
- Lưới 4 cột (điện thoại) / 8 cột (tablet ≥ 768px) / 12 cột (máy tính ≥ 1024px).
- Breakpoint: `sm 640` · `md 768` · `lg 1024` · `xl 1280`.

### 4.3 Hình khối
| Mục | Quy định |
|---|---|
| Bo góc | **0** cho ảnh, thẻ, nút. Input và ô chọn: `2px` |
| Đường viền | 1px `sand-200`; hover `sand-300`; đang chọn `ink-900` |
| Đổ bóng | Không dùng cho thẻ. Chỉ ngăn trượt (drawer) và menu xổ: `0 12px 40px rgba(42,36,34,0.08)` |
| Đường kẻ trang trí | 1px `gold-500`, dài 48px, đặt giữa dưới tiêu đề khối quan trọng |

### 4.4 Tỉ lệ ảnh
| Ảnh | Tỉ lệ |
|---|---|
| Ảnh sản phẩm (thẻ và chi tiết) | **4:5** (dọc) |
| Banner trang chủ | 16:9 máy tính · 4:5 điện thoại (ảnh riêng) |
| Ảnh danh mục | 1:1 |
| Ảnh bộ sưu tập | 3:2 |

---

## 5. Hình ảnh và biểu tượng

### 5.1 Phong cách ảnh (hướng dẫn khi chụp)
- Ánh sáng tự nhiên, dịu, từ bên cạnh. Không dùng đèn flash.
- Nền đồng nhất: vải linen ngà, giấy mỹ thuật, tường vữa sáng hoặc đá. **Toàn bộ ảnh sản phẩm dùng chung một tông nền** để lưới sản phẩm đồng đều.
- Mỗi sản phẩm tối thiểu 3 ảnh: (1) toàn thân trên nền trơn, (2) cận chi tiết cánh hoa thấy chất lụa, (3) ảnh đặt trong không gian sống (bàn ăn, kệ sách, cửa sổ).
- Ảnh đầu tiên luôn là ảnh nền trơn, sản phẩm chiếm ~70% khung, căn giữa.
- Xuất ảnh dài cạnh ≥ 2000px; Cloudinary tự nén và đổi định dạng (`f_auto,q_auto`).

### 5.2 Logo tạm (dạng chữ)
Trong lúc chưa có logo chính thức:

```
          L A M O R A
         ─────  ✿  ─────
            F L O W E R
```
- “LAMORA”: Cormorant Garamond 500, in hoa, giãn chữ 0.3em.
- “FLOWER”: Be Vietnam Pro 400, cỡ bằng 40% chữ trên, giãn chữ 0.5em.
- Đường kẻ và biểu tượng nhỏ ở giữa màu `gold-500`. Trên header chỉ dùng dòng “LAMORA” khi không đủ chỗ.

### 5.3 Biểu tượng
- Bộ icon **Lucide**, nét `1.25`, cỡ 20px (điện thoại) / 22px (máy tính), màu `ink-900`.
- Chỉ dùng icon cho: tìm kiếm, giỏ hàng, menu, đóng, mũi tên, cộng/trừ, Zalo/Messenger, sao chép. Không trang trí bằng icon.

---

## 6. Chuyển động

| Tình huống | Hiệu ứng |
|---|---|
| Khối xuất hiện khi cuộn | Mờ → rõ + trượt lên 12px, 600ms, `ease-soft`, mỗi thẻ trễ 60ms |
| Hover ảnh sản phẩm | Phóng to 1.03 trong 900ms; nếu có ảnh thứ hai thì chuyển mờ sang ảnh đó |
| Hover link chữ | Đường gạch dưới `rose-400` chạy từ trái sang, 300ms |
| Ngăn trượt (giỏ, menu, bộ lọc) | Trượt vào 400ms, nền phía sau phủ `ink-900` 30% |
| Chuyển ảnh trong gallery | Mờ chéo 400ms |
| Thông báo (toast) | Trượt lên từ dưới, tự ẩn sau 3 giây |

- Tôn trọng cài đặt giảm chuyển động (`prefers-reduced-motion`): tắt trượt và phóng to, chỉ giữ đổi độ mờ.
- KHÔNG dùng: hiệu ứng nảy, xoay, parallax mạnh, popup tự bật.

---

## 7. Component cơ bản (`src/components/ui`)

### 7.1 Nút (`Button`)
| Biến thể | Kiểu | Dùng cho |
|---|---|---|
| `primary` | Nền `ink-900`, chữ `ivory-50`, `eyebrow` | Hành động chính: Thêm vào giỏ, Đặt hàng |
| `secondary` | Viền 1px `ink-900`, nền trong suốt, chữ `ink-900` | Hành động phụ: Mua ngay, Xem tất cả |
| `ghost` | Chỉ chữ + gạch dưới mảnh | Link hành động trong đoạn văn |
| `subtle` (admin) | Nền `ivory-100`, chữ `ink-900` | Nút phụ trong admin |
| `danger` (admin) | Viền + chữ `error-700` | Hủy đơn, xóa |

- Chiều cao: 48px (điện thoại) / 52px (máy tính); admin 40px. Lề ngang 28px.
- Hover `primary`: nền chuyển `rose-700`, 300ms. Hover `secondary`: nền `ink-900`, chữ `ivory-50`.
- Trạng thái đang xử lý: giữ nguyên chiều rộng, thay chữ bằng 3 chấm nhịp nhàng; khóa bấm.
- Bấm được bằng bàn phím, viền focus 1px `gold-500` cách 3px.

### 7.2 Ô nhập (`Input`, `Textarea`, `Select`, `Combobox`)
- Nhãn phía trên: `small` 500, màu `ink-900`. Trường bắt buộc có dấu `*` màu `rose-700`.
- Ô: cao 48px, viền 1px `sand-200`, nền `ivory-50`, bo 2px. Focus: viền `ink-900`.
- Lỗi: viền `error-700`, dòng lỗi `small` màu `error-700` ngay dưới ô.
- Gợi ý (hint): `small` màu `stone-500`.
- `Combobox` (chọn tỉnh/xã): có ô tìm kiếm không dấu (“ha noi” tìm được “Hà Nội”).

### 7.3 Các component khác

- **`Pagination`** — phân trang bằng liên kết: ‹ Trước · 1 … 4 5 6 … 10 · Sau ›, trang hiện tại có viền `ink-900`, ô chạm ≥ 44px; ẩn khi chỉ có 1 trang. Có trong `/admin/ui-kit`.
- **`Switch`** — công tắc bật/tắt (`role="switch"`), ô 44×24px bo 2px, nút gạt vuông bo 2px; bật: nền `ink-900`, tắt: nền `sand-200`. Dùng cho “Hiển thị trên website”, “Đây là quà tặng”. Có trong `/admin/ui-kit`.
| Component | Mô tả ngắn |
|---|---|
| `Price` | Giá hiện tại (`price`, `ink-900`); giá gốc gạch ngang (`small`, `stone-500`); nếu giảm giá thì giá hiện tại màu `rose-700` |
| `ColorSwatch` | Ô tròn 24px (ngoại lệ duy nhất được bo tròn), viền trong 1px `sand-200`. Đang chọn: vòng ngoài 1px `ink-900` cách 3px. Hết hàng: đường chéo mảnh |
| `SizeOption` | Ô chữ nhật viền 1px, chữ `small`. Đang chọn: viền `ink-900` dày 1.5px |
| `QuantityStepper` | [ − ] số [ + ], cao 44px, viền `sand-200` |
| `Badge` | Chữ `eyebrow` trên nền `blush-100` (“Mới”, “Bán chạy”) hoặc `ivory-50` viền `ink-900` (“Hết hàng”). Đặt góc trên trái ảnh, cách 12px |
| `Drawer` | Ngăn trượt: giỏ (phải), menu (trái), bộ lọc (dưới trên điện thoại). Rộng 420px trên máy tính |
| `Accordion` | Đường kẻ trên/dưới `sand-200`, tiêu đề `eyebrow`, dấu `+` xoay thành `−` |
| `Tabs` | Chữ `eyebrow`, tab đang chọn có gạch dưới 1px `ink-900` |
| `Breadcrumb` | `small`, `stone-500`, phân cách bằng `/` |
| `Toast` | Nền `ink-900`, chữ `ivory-50`, góc dưới giữa (điện thoại) / dưới phải (máy tính) |
| `Skeleton` | Khối `ivory-100` nhấp nháy rất nhẹ (độ mờ 100% ↔ 60%, 1.6s) |
| `EmptyState` | Đường kẻ vàng mảnh + tiêu đề `h3` + một câu + một nút |
| `Divider` | 1px `sand-200`; biến thể trang trí: đường vàng 48px có ✿ ở giữa |

---

## 8. Component thương mại

### 8.1 Thẻ sản phẩm (`ProductCard`)
```
┌─────────────────────┐
│ MỚI                 │  ← Badge
│                     │
│      [ảnh 4:5]      │  ← nền ivory-100, hover đổi ảnh 2
│                     │
└─────────────────────┘
  BÌNH HOA CẮM SẴN        ← eyebrow, stone-500 (danh mục)
  Mẫu đơn hồng phấn       ← h3 (máy tính) / body 500 (điện thoại)
  ● ● ●  +2               ← ColorSwatch nhỏ 14px, tối đa 4
  Từ 650.000₫  ̶7̶2̶0̶.̶0̶0̶0̶₫   ← Price
```
- Không có nút “Thêm vào giỏ” trên thẻ: bấm cả thẻ để vào chi tiết (giữ vẻ tinh gọn).
- Hết hàng: ảnh giảm độ mờ 70%, badge “Hết hàng”.

### 8.2 Dải miễn phí ship
`FreeShippingProgress`: dòng chữ `small` + thanh mảnh 2px (nền `sand-200`, phần đã đạt `rose-400`). Khi đạt: chữ `sage-700` “Đơn của bạn được miễn phí giao hàng”.

### 8.3 Ô chuyển khoản (`BankTransferBox`)
Khung viền 1px `gold-500`, nền `ivory-50`, chia 2 cột trên máy tính (QR trái, thông tin phải), 1 cột trên điện thoại (QR trên). Mỗi dòng thông tin có nút sao chép nhỏ; sao chép xong đổi thành “Đã chép” trong 2 giây.

### 8.4 Dòng thời gian đơn hàng (`OrderStatusTimeline`)
Các chấm tròn 10px nối bằng đường 1px. Bước đã qua: chấm `ink-900` đặc; bước hiện tại: chấm `rose-700` có vòng ngoài; bước chưa tới: chấm rỗng `sand-300`. Đơn hủy: một dòng riêng màu `error-700`.

---

## 9. Bố cục từng trang (wireframe)

Ký hiệu: `[ ]` vùng ảnh · `▭` nút · `═` đường kẻ · số trong ngoặc là khoảng cách.

### 9.1 Khung chung
**Header (máy tính, cao 88px, dính khi cuộn và thu còn 64px)**
```
┌────────────────────────────────────────────────────────────────┐
│  Miễn phí giao hàng cho đơn từ 800.000₫          (blush-100)  │  ← AnnouncementBar 36px
├────────────────────────────────────────────────────────────────┤
│  SẢN PHẨM  BỘ SƯU TẬP  QUÀ TẶNG        L A M O R A        ⌕   🛍 2│
└────────────────────────────────────────────────────────────────┘
```
- Logo ở **giữa**; menu bên trái; tìm kiếm và giỏ bên phải. Nền `ivory-50`, đường kẻ dưới 1px `sand-200` chỉ hiện khi đã cuộn.
- “SẢN PHẨM” mở menu lớn (mega menu): cột danh mục + 1 ảnh bộ sưu tập nổi bật.

**Header (điện thoại, cao 56px)**
```
│ ☰                 L A M O R A                 ⌕   🛍 2 │
```

**Footer**: nền `ink-900`, chữ `ivory-50`. Bốn cột (máy tính) / accordion (điện thoại): Về Lamora · Hỗ trợ (tra cứu đơn, đổi trả, vận chuyển) · Liên hệ (SĐT, Zalo, giờ làm việc) · Mạng xã hội. Dòng dưới cùng: logo nhỏ, © năm, thông tin chủ shop.

**Nút chat nổi**: hai nút tròn 48px chồng dọc ở góc phải dưới (cách đáy 24px; trên trang chi tiết sản phẩm điện thoại đẩy lên trên thanh mua hàng). Nền `ivory-50`, viền `sand-200`, icon gốc của Zalo/Messenger thu nhỏ.

### 9.2 Trang chủ
```
MÁY TÍNH                                            ĐIỆN THOẠI
┌──────────────────────────────────────────┐        ┌──────────────┐
│                                          │        │              │
│  [ảnh banner full chiều ngang, 16:9]     │        │ [banner 4:5] │
│                                          │        │              │
│   BỘ SƯU TẬP MÙA THU                     │        │ BỘ SƯU TẬP   │
│   Vẻ đẹp *không tàn phai*     (display)  │        │ Vẻ đẹp       │
│   ▭ KHÁM PHÁ                             │        │ không tàn    │
└──────────────────────────────────────────┘        │ ▭ KHÁM PHÁ   │
                  (112)                             └──────────────┘
        DANH MỤC  ── đường vàng ──                  ○ ○ ○ ○ →  (cuộn ngang)
   [1:1]  [1:1]  [1:1]  [1:1]  [1:1]
   Cành   Bình   Giỏ    Treo   Phụ
   lẻ     hoa    hoa    tường  kiện
                  (112)
   SẢN PHẨM NỔI BẬT                    Xem tất cả →
   [4:5] [4:5] [4:5] [4:5]                          [4:5] [4:5]
   [4:5] [4:5] [4:5] [4:5]                          [4:5] [4:5]
                  (112)
┌──────────────────┬───────────────────────┐        ┌──────────────┐
│                  │ BỘ SƯU TẬP            │        │ [ảnh 3:2]    │
│  [ảnh 3:2 lớn]   │ Quà tặng 20/10        │        │ Quà tặng     │
│                  │ Mô tả ngắn 2 dòng     │        │ 20/10        │
│                  │ [4:5][4:5][4:5] →     │        │ [4:5][4:5] → │
└──────────────────┴───────────────────────┘        └──────────────┘
   (mỗi bộ sưu tập đảo vị trí ảnh trái/phải xen kẽ)
                  (112)
┌──────────────────────────────────────────┐
│ ✿ Lụa cao cấp │ ✿ Thiệp lời nhắn │ ✿ Giao │ ✿ Đổi │   ← BrandPromise, nền ivory-100
└──────────────────────────────────────────┘
```

### 9.3 Danh sách sản phẩm (S2–S5)
```
MÁY TÍNH
  Trang chủ / Bình hoa cắm sẵn                        (breadcrumb)
  Bình hoa cắm sẵn                                    (h1)
  Mô tả danh mục 1–2 dòng                             (lead, stone-500)
  ═══════════════════════════════════════════════════
  BỘ LỌC ▾   Màu ▾   Giá ▾        24 sản phẩm   Sắp xếp: Mới nhất ▾
  [Hồng ×] [200–500k ×]  Xóa tất cả
  [4:5] [4:5] [4:5] [4:5]
  [4:5] [4:5] [4:5] [4:5]
                 ← 1  2  3 →

ĐIỆN THOẠI
  Bình hoa cắm sẵn
  ┌──────────────┬──────────────┐
  │  ⚙ BỘ LỌC    │  SẮP XẾP ▾   │   ← dính dưới header khi cuộn
  └──────────────┴──────────────┘
  [4:5] [4:5]
  [4:5] [4:5]
```
- Bộ lọc trên máy tính là các menu xổ ngang (không dùng cột bên trái) để lưới ảnh rộng rãi.

### 9.4 Chi tiết sản phẩm (S6)
```
MÁY TÍNH (ảnh 7 cột · thông tin 5 cột, thông tin dính khi cuộn)
┌───────────────────────────────┬──────────────────────────┐
│ [ảnh 4:5]       [ảnh 4:5]     │ BÌNH HOA CẮM SẴN         │
│                               │ Mẫu đơn hồng phấn  (h1)  │
│ [ảnh 4:5]       [ảnh 4:5]     │ 650.000₫                 │
│ (lưới 2 cột, cuộn dọc)        │ Mô tả ngắn 2 dòng        │
│                               │ ═══                      │
│                               │ MÀU — Hồng phấn          │
│                               │ ● ● ●                    │
│                               │ KÍCH THƯỚC               │
│                               │ [Nhỏ 30cm] [Vừa 45cm]    │
│                               │ [−  1  +]                │
│                               │ ▭ THÊM VÀO GIỎ (rộng hết)│
│                               │ ▭ MUA NGAY (viền)        │
│                               │ ✿ Thiệp lời nhắn miễn phí│
│                               │ ✿ Giao toàn quốc 1–5 ngày│
│                               │ ═══                      │
│                               │ + MÔ TẢ                  │
│                               │ + CHẤT LIỆU & BẢO QUẢN   │
│                               │ + GIAO HÀNG & ĐỔI TRẢ    │
│                               │ Cần tư vấn? Nhắn Zalo →  │
└───────────────────────────────┴──────────────────────────┘
                  BẠN CÓ THỂ THÍCH
        [4:5]   [4:5]   [4:5]   [4:5]

ĐIỆN THOẠI
  [ảnh 4:5 toàn chiều ngang, vuốt ngang]
  ● ○ ○ ○                              (chấm vị trí ảnh)
  Mẫu đơn hồng phấn
  650.000₫
  MÀU / KÍCH THƯỚC / SỐ LƯỢNG
  + MÔ TẢ  + CHẤT LIỆU  + GIAO HÀNG
  ┌────────────────────────────────────┐
  │ 650.000₫     ▭ THÊM VÀO GIỎ        │  ← StickyBuyBar dính đáy
  └────────────────────────────────────┘
```
- Dùng **accordion** thay cho tab ngang (gọn và dễ đọc trên điện thoại). Cập nhật `05` mục 5: `ProductDetailsTabs` → `ProductDetailsAccordion`.

### 9.5 Giỏ nhỏ (Drawer, phải, rộng 420px)
```
  GIỎ HÀNG (2)                          ✕
  ════════════════════════════════════════
  Mua thêm 150.000₫ để được miễn phí giao hàng
  ───────────────────── (thanh 2px)
  [ảnh]  Mẫu đơn hồng phấn
         Hồng phấn / Nhỏ
         [− 1 +]                650.000₫
         Xóa
  ────────────────────────────────────────
  Tạm tính                      650.000₫
  ▭ THANH TOÁN
  Xem giỏ hàng
```

### 9.6 Thanh toán (S8)
```
MÁY TÍNH (form 7 cột · tóm tắt 5 cột nền ivory-100, dính khi cuộn)
  L A M O R A   (header rút gọn: chỉ logo + "Quay lại giỏ hàng")

  1  THÔNG TIN NGƯỜI ĐẶT                 │ ĐƠN HÀNG CỦA BẠN
     Họ tên*        Số điện thoại*       │ [ảnh] Mẫu đơn ×1   650.000₫
     Email                               │ ───────────────────────
  2  ĐÂY LÀ QUÀ TẶNG  ( ○ công tắc )     │ Tạm tính           650.000₫
     Người nhận* · SĐT người nhận*       │ Giao hàng           35.000₫
     Lời nhắn trên thiệp   (0/300)       │ Gói quà             20.000₫
     ☐ Gói quà cao cấp (+20.000₫)        │ ───────────────────────
  3  ĐỊA CHỈ GIAO HÀNG                   │ TỔNG CỘNG          705.000₫
     Tỉnh/Thành* · Phường/Xã*            │
     Số nhà, đường*                      │
  4  THỜI GIAN NHẬN                      │
     Ngày mong muốn · Ghi chú            │
  5  THANH TOÁN                          │
     ◉ Thanh toán khi nhận hàng (COD)    │
     ○ Chuyển khoản qua mã QR            │
     ▭ ĐẶT HÀNG · 705.000₫               │
```
- Header và footer rút gọn ở trang thanh toán để khách tập trung.
- Trên điện thoại: tóm tắt đơn thu gọn thành một dòng “Đơn hàng (2) · 705.000₫ ▾” ở đầu trang.
- Mỗi khối đánh số bằng chữ Cormorant lớn màu `rose-400`.

### 9.7 Đặt hàng thành công (S9)
```
                ✿  (đường vàng)
      Cảm ơn bạn đã chọn Lamora       (h1, giữa)
      Mã đơn của bạn: LMR-261005-K7QF  [Sao chép]
  ┌───────────────────────────────────────────┐
  │ [QR]   Ngân hàng · Số TK · Chủ TK         │  ← chỉ với chuyển khoản
  │        Số tiền · Nội dung CK  [Chép]      │
  └───────────────────────────────────────────┘
      Tóm tắt đơn · Địa chỉ giao
      ▭ TIẾP TỤC MUA SẮM     Tra cứu đơn hàng →
```

### 9.8 Trang tĩnh
Cột nội dung giữa rộng tối đa 720px; tiêu đề `h1` căn giữa, đường vàng phía dưới; nội dung `body`, tiêu đề mục `h3`.

---

## 10. Giao diện quản trị

Trang quản trị **dùng chung token** nhưng ưu tiên rõ ràng và mật độ thông tin cao hơn web khách.

| Mục | Quy định |
|---|---|
| Nền | Khung `ivory-100`, vùng nội dung thẻ `ivory-50` viền `sand-200` |
| Chữ | Toàn bộ Be Vietnam Pro; chỉ tiêu đề trang dùng Cormorant `h2` |
| Cỡ chữ | Bảng 14px, nhãn 13px |
| Nút | Cao 40px, dùng `primary` / `subtle` / `danger` |
| Menu bên | Rộng 240px, nền `ink-900`, chữ `ivory-50` 80% độ mờ, mục đang chọn 100% + vạch trái 2px `gold-500` |
| Bảng | Dòng cao 56px, đường kẻ ngang `sand-200`, hover nền `ivory-100`. Trên điện thoại chuyển thành thẻ |

**Màu trạng thái đơn (`StatusBadge`)**
| Trạng thái | Nền | Chữ |
|---|---|---|
| Chờ xác nhận | `blush-100` | `rose-700` |
| Đã xác nhận | `ivory-100` | `ink-900` |
| Đang giao | `#EAE6F0` | `#4F4868` |
| Đã giao | `sage-100` | `sage-700` |
| Đã hủy / Hoàn hàng | `sand-200` | `stone-500` |
| Chưa thanh toán | viền `warning-700` | `warning-700` |
| Đã thanh toán | viền `sage-700` | `sage-700` |

(Hai màu tím nhạt của “Đang giao” chỉ dùng trong admin; khai báo thêm token `admin-shipping-bg`, `admin-shipping-fg`.)

**Bố cục admin (máy tính)**
```
┌──────────┬───────────────────────────────────────────────┐
│ LAMORA   │ Đơn hàng                       ▭ + Thêm …     │
│ ──────── │ ───────────────────────────────────────────── │
│ Tổng quan│ [Tất cả 128][Chờ 3][Đã XN 5][Đang giao 4]…    │
│▌Đơn hàng3│ ⌕ Tìm mã đơn, SĐT…   Thanh toán ▾  Ngày ▾     │
│ Sản phẩm │ ┌───────────────────────────────────────────┐ │
│ Danh mục │ │ Mã đơn │ Khách │ Tổng │ TT │ Trạng thái    │ │
│ Bộ sưu tập│ │ ...                                      │ │
│ Tài khoản│ └───────────────────────────────────────────┘ │
│ ──────── │                                               │
│ Xem web ↗│                                               │
└──────────┴───────────────────────────────────────────────┘
```

---

## 11. Khả năng truy cập (bắt buộc)

- Tương phản chữ ≥ 4.5:1 (chữ lớn ≥ 3:1). Bảng màu mục 2 đã tính sẵn; không tự đổi màu chữ.
- Mọi ảnh có `alt` mô tả bằng tiếng Việt; ảnh trang trí dùng `alt=""`.
- Mọi ô nhập có nhãn hiển thị (không chỉ dùng placeholder).
- Dùng được hoàn toàn bằng bàn phím; viền focus luôn nhìn thấy (`gold-500`).
- Vùng bấm tối thiểu 44×44px trên điện thoại.
- Ô màu có tên màu cho trình đọc màn hình (“Màu Hồng phấn, hết hàng”).

---

## 12. Cách AI dựng giao diện theo file này

1. Bước F1/G1 (`05`, `06` mục thứ tự code): tạo token mục 2–4 trong `globals.css`, tải font mục 3, dựng **toàn bộ component mục 7** trước, kèm một trang `/admin/ui-kit` (chỉ admin xem) hiển thị mọi component và trạng thái để duyệt.
2. Chủ shop duyệt trang `ui-kit` trên điện thoại và máy tính. Chỉnh token tại đây trước khi dựng trang.
3. Mỗi trang dựng theo wireframe mục 9, chỉ dùng component có sẵn. Cần component mới → thêm vào mục 7 của file này trước.

---

## 13. Cần xác nhận

1. Bạn có thích hướng “Atelier lụa” (ngà – nâu mực – hồng đất – vàng mảnh) không? Nếu muốn tông khác (ví dụ xanh lá rêu chủ đạo, hoặc đen – trắng – vàng sang trọng hơn), chỉ cần đổi bảng màu mục 2.
2. Có 3 website hoặc tài khoản Instagram nào bạn thích phong cách không? Tôi sẽ đối chiếu và tinh chỉnh.
3. Logo: tạm dùng logo chữ ở mục 5.2. Khi có logo thật, gửi file SVG.

---

## Nhật ký thay đổi

| Phiên bản | Ngày | Thay đổi |
|---|---|---|
| v1.0 | 2026-10-05 | Bản đầu tiên |
