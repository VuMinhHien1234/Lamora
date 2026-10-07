# 05 — SHOP PAGES: Các màn hình web khách

> Dựa trên `00-MASTER-PLAN.md` v1.0, `01-TECH-STANDARDS.md` v2.0, `03-UI-DESIGN.md` v2.0, `04-SERVER-LAYER.md` v2.0 · Phiên bản: v2.0 · 2026-10-07
>
> Thư mục code: `src/app/(shop)/`. Mobile-first (từ 360px). Wireframe ở `03` mục 9. **S** = Server Component · **C** = Client Component.
>
> Mục tiêu mọi trang: khách **thấy món ngon → biết giá → đặt món hoặc gọi tiệm** trong ít bước nhất.

---

## 1. Tổng hợp màn hình

| # | Màn hình | Đường dẫn | Ưu tiên |
|---|---|---|---|
| S0 | Khung chung (header, footer, nút liên hệ nổi) | layout `(shop)` | P0 |
| S1 | Trang chủ | `/` | P0 |
| S2 | Thực đơn | `/thuc-don` | P0 |
| S3 | Thực đơn một danh mục | `/thuc-don/[slug]` | P0 |
| S4 | Chi tiết món | `/mon/[slug]` | P0 |
| S5 | Đặt món | `/dat-mon` | P0 |
| S6 | Đã gửi yêu cầu | `/dat-mon/da-gui` | P0 |
| S7 | Liên hệ | `/lien-he` | P0 |
| S8 | Trang tĩnh | `/gioi-thieu`, `/chinh-sach-bao-mat` | P0 |
| S9 | 404 / lỗi | `not-found.tsx`, `error.tsx` | P0 |
| — | Tìm kiếm món | `/tim-kiem` | P1 |
| — | Đặt tiệc / số lượng lớn | `/dat-tiec` | P2 |

**Đã bỏ so với Lamora:** giỏ hàng, thanh toán, đặt hàng thành công, tra cứu đơn, bộ sưu tập, danh sách sản phẩm có lọc/sắp xếp/phân trang, chính sách đổi trả và vận chuyển.

---

## 2. S0 — Khung chung

| Thành phần | Mô tả | Loại | Nguồn |
|---|---|---|---|
| `AnnouncementBar` | Dải thông báo tùy chọn (bật/tắt trong config) | S | `site.ts` |
| `Header` | Logo, menu (Thực đơn · Giới thiệu · Liên hệ), `OpenStatus`, nút “Đặt món” luôn hiện | S + C | `site.ts` |
| `MobileMenu` | Menu trượt trái + SĐT + giờ mở cửa | C | |
| `OpenStatus` | “Đang mở cửa · đến 21:00”, tính **ở trình duyệt** theo giờ Việt Nam để trang cache được | C | `site.ts → OPENING_HOURS` |
| `Footer` | Địa chỉ, giờ mở cửa, liên hệ, mạng xã hội, link trang tĩnh, thông tin hộ kinh doanh | S | `site.ts` |
| `ContactFloatingButtons` | Gọi · Zalo · Telegram (ẩn nút chưa có link) | C | `site.ts` |

**`src/config/site.ts`** (chủ tiệm điền thật trước ra mắt):
```ts
export const SITE = {
  name: 'Bánh Mì Thanh Long',
  tagline: 'Giòn rụm, nhân đầy mỗi sáng',
  phone: '09xxxxxxxx',
  zaloUrl: 'https://zalo.me/09xxxxxxxx',
  telegramUrl: 'https://t.me/<username_tiem>',   // chat trực tiếp với tiệm
  facebookUrl: '',
  address: 'Số …, đường …, phường …, TP …',
  googleMapsUrl: 'https://maps.app.goo.gl/…',
  geo: { lat: 0, lng: 0 },                       // cho JSON-LD
  businessInfo: 'Hộ kinh doanh … · MST …',
  announcement: '',                              // để trống = ẩn dải thông báo
};
export const OPENING_HOURS = [                   // 0 = Chủ nhật
  { days: [1, 2, 3, 4, 5, 6, 0], open: '06:00', close: '21:00' },
];
```

**`src/config/ordering.ts`**: `MAX_QUANTITY_PER_LINE = 50`, `MAX_LINES = 20`, `MAX_DAYS_AHEAD = 7`, `DELIVERY_RADIUS_TEXT = 'trong bán kính 3 km'`, `CALLBACK_PROMISE = 'trong ít phút'`, `AUTO_RESET_AVAILABILITY = false`.

---

## 3. S1 — Trang chủ

| Khối (từ trên xuống) | Nội dung | Nguồn |
|---|---|---|
| `Hero` | Ảnh lớn, tagline, `OpenStatus`, nút “Đặt món” + “Xem thực đơn” | `site.ts` (P1: bảng `Banner`) |
| `FeaturedMenu` | 4–8 món nổi bật dạng `MenuItemCard`; cuộn ngang trên điện thoại | `listFeaturedProducts` |
| `CategoryShortcuts` | Ô ảnh từng danh mục → `/thuc-don/<slug>` | `listMenuCategories` |
| `StoryTeaser` | Ảnh tiệm + 2–3 câu chuyện + link `/gioi-thieu` | `content/` |
| `Promises` | 3 cam kết (bánh nướng mỗi sáng, pate & sốt nhà làm, gọi lại nhanh) | config |
| `VisitUs` | `StoreInfoCard` + ảnh bản đồ tĩnh bấm mở Google Maps | `site.ts` |

Trang render tĩnh, cache theo tag `products`, `categories`.

---

## 4. S2, S3 — Thực đơn

| Thành phần | Mô tả | Loại | Nguồn |
|---|---|---|---|
| `MenuHeader` | Tiêu đề + “Giá tham khảo, chưa gồm phí giao” | S | |
| `CategoryTabs` | Tab dính dưới header, bấm cuộn tới khối danh mục (S2) hoặc chuyển trang (S3) | C | |
| `MenuSection` | Mỗi danh mục: tiêu đề `h2` + mô tả + danh sách món | S | `getMenu` |
| `MenuRow` / `MenuItemCard` | Điện thoại dạng dòng gọn; máy tính lưới 3 cột. Có giá, nhãn, “Tạm hết”, nút `+` → `/dat-mon?mon=<slug>` | S | |

**Quy tắc**
- Món “Tạm hết” vẫn hiện (khách biết tiệm có món này), không có nút `+`.
- Danh mục không có món đang bán → ẩn.
- S3 slug không tồn tại → 404. S3 có metadata riêng (“Đồ uống | Bánh Mì Thanh Long”).
- JSON-LD `Menu` (`08` mục 11).

---

## 5. S4 — Chi tiết món

| Thành phần | Mô tả | Loại | Nguồn |
|---|---|---|---|
| `Breadcrumb` | Thực đơn › Danh mục › Món | S | |
| `ProductGallery` | Ảnh 4:3, vuốt trên điện thoại | C | |
| `ProductInfo` | Tên, nhãn, giá (“Từ …” nếu nhiều lựa chọn), mô tả ngắn | S | `getProductBySlug` |
| `OptionPicker` | `RadioCards` các lựa chọn + giá. Ẩn nếu chỉ 1 lựa chọn | C | |
| `QuantityStepper` | 1 → 50 | C | |
| `OrderThisButton` | “Đặt món này” → `/dat-mon?mon=<slug>&loai=<optionId>&sl=<n>`. Món tạm hết: nút khóa + “Hôm nay tạm hết” + gợi ý gọi tiệm | C | |
| `StickyOrderBar` | Điện thoại: giá + số lượng + nút dính đáy | C | |
| `ProductDetailsAccordion` | Mô tả · Thành phần · Lưu ý dị ứng | S | |
| `AskShop` | “Hỏi tiệm qua Zalo / Telegram” | S | `site.ts` |
| `RelatedProducts` | 4 món cùng danh mục | S | `listRelatedProducts` |

SEO: `generateMetadata` (tên, mô tả, ảnh) + JSON-LD `MenuItem` có giá (`08` mục 11).

---

## 6. S5 — Đặt món (trang quan trọng nhất)

Một trang, hai phần. Máy tính: chọn món bên trái, thông tin nhận món bên phải (dính khi cuộn). Điện thoại: chọn món → bấm “Tiếp tục” → cuộn tới thông tin (`03` mục 9.5).

### 6.1 Phần chọn món
| Thành phần | Mô tả | Loại | Nguồn |
|---|---|---|---|
| `OrderPicker` | Danh mục → món → mỗi lựa chọn có `[− 0 +]`. Món tạm hết hiện mờ, không bấm được | C | `getOrderableOptions` (truyền từ Server Component) |
| `OrderBar` | Điện thoại: “3 phần · 75.000₫ (tham khảo)” + nút Tiếp tục; bấm mở danh sách đã chọn | C | |

- Mở từ `?mon=<slug>&loai=<optionId>&sl=<n>` → chọn sẵn món đó và cuộn tới.
- Lựa chọn đang chọn giữ trong state của trang (và `sessionStorage` để không mất khi lỡ tải lại). **Không** có giỏ hàng dùng chung toàn web.

### 6.2 Phần thông tin nhận món
| Trường | Quy tắc |
|---|---|
| Họ tên* | 2–60 ký tự |
| Số điện thoại* | Số Việt Nam; chấp nhận `+84`, dấu cách; hiển thị lỗi thân thiện |
| Cách nhận* | `RadioCards`: **Lấy tại quầy** (hiện địa chỉ tiệm) · **Giao tận nơi** (ghi chú: “{DELIVERY_RADIUS_TEXT}, phí giao tiệm báo khi gọi”) |
| Địa chỉ giao* | Chỉ hiện và bắt buộc khi chọn giao. Ô chữ tự do, ≤ 200 ký tự |
| Nhận lúc | **Sớm nhất** (mặc định) · **Hẹn giờ**: chọn ngày (hôm nay → +7 ngày) và giờ (bước 15 phút, chỉ trong giờ mở cửa) |
| Ghi chú | “Không hành, ít cay, cắt đôi…”, ≤ 500 ký tự, đếm ký tự |
| `OrderSummary` | Danh sách món, tạm tính, dòng “Giá tham khảo, chưa gồm phí giao. Tiệm sẽ gọi lại để chốt.” |
| Ô đồng ý* | “Tôi đồng ý để tiệm dùng tên và SĐT để liên hệ về yêu cầu này (Chính sách bảo mật)” |
| Nút | “Gửi yêu cầu đặt món” — khóa khi đang gửi và khi chưa chọn món |
| Lối thoát | Dưới nút: “Hoặc gọi {SĐT} · Zalo · Telegram” |

**Quy tắc**
- Form dùng React Hook Form + schema Zod dùng chung với `createOrderRequest`.
- Trường ẩn `website` (bẫy bot) và `startedAt`.
- Ngoài giờ mở cửa: hiện dải `warning-700` “Tiệm đang nghỉ, mở lại lúc 6:00. Bạn vẫn gửi được, tiệm sẽ gọi lại khi mở cửa.”
- Lỗi `ITEM_UNAVAILABLE`: đánh dấu dòng món bị lỗi ngay trong `OrderPicker`, giữ nguyên các trường đã nhập.
- Thành công → xóa lựa chọn đã lưu, chuyển tới S6.
- P1: nhớ tên + SĐT trên trình duyệt cho lần sau (có ô “Ghi nhớ thông tin”).
- Trang `noindex`.

---

## 7. S6 — Đã gửi yêu cầu

| Thành phần | Mô tả | Nguồn |
|---|---|---|
| `RequestSentHeader` | “Thanh Long đã nhận yêu cầu của bạn” + mã `TL-…` + nút sao chép | `getRequestConfirmation` |
| `CallbackNotice` | “Tiệm sẽ gọi số 0912***678 {CALLBACK_PROMISE}”, hoặc thông báo ngoài giờ | |
| `RequestRecap` | Món, cách nhận, giờ nhận, tạm tính | |
| `UrgentContact` | “Cần gấp?” + nút Gọi · Zalo · Telegram | `site.ts` |

Không có cookie hợp lệ (mở lại sau 2 giờ, hoặc mở trên máy khác) → chỉ hiện lời cảm ơn chung + nút liên hệ. Trang `noindex`.

---

## 8. S7 — Liên hệ

| Thành phần | Mô tả | Nguồn |
|---|---|---|
| `StoreInfoCard` | Địa chỉ, giờ mở cửa từng ngày, `OpenStatus`, SĐT, Zalo, Telegram, Facebook | `site.ts` |
| `MapEmbed` | Ảnh bản đồ tĩnh; bấm “Xem bản đồ” mới tải iframe Google Maps (giữ trang nhẹ) + nút “Chỉ đường” | `site.ts` |
| `ContactForm` | Họ tên*, SĐT*, Nội dung*, ô đồng ý, nút Gửi. Thành công → toast “Tiệm đã nhận tin nhắn, sẽ liên hệ lại sớm” | `sendContactMessage` |
| `OrderHint` | “Muốn đặt món? → Trang Đặt món” | |

JSON-LD `Restaurant`/`LocalBusiness` có giờ mở cửa và địa chỉ (`08` mục 11).

---

## 9. S8 — Trang tĩnh

| Trang | Nội dung |
|---|---|
| Giới thiệu | Câu chuyện tiệm, người làm bánh, nguyên liệu, ảnh |
| Chính sách bảo mật | Dữ liệu thu thập (tên, SĐT, địa chỉ giao), mục đích (liên hệ chốt món), thời gian lưu, cách yêu cầu xóa |

Markdown trong `src/content/`, render bằng `StaticPageLayout` (giữ từ bản cũ).

---

## 10. S9 — 404 và lỗi

- `not-found.tsx`: “Không tìm thấy trang” + món nổi bật + nút “Xem thực đơn”.
- `error.tsx`: “Có trục trặc” + “Thử lại” + nút gọi tiệm.
- `loading.tsx` cho S2–S4: khung xương đúng bố cục.

---

## 11. Thứ tự code đề xuất

| Bước | Việc | Phụ thuộc (`04` mục 12) |
|---|---|---|
| F1 | S0 khung chung mới (`site.ts`, `OpenStatus`, nút liên hệ nổi) | K4 |
| F2 | `MenuItemCard`, `MenuRow` + S2, S3 | K2, K3 |
| F3 | S4 chi tiết món | K2 |
| F4 | S5 đặt món | K5 |
| F5 | S6 đã gửi | K5 |
| F6 | S7 liên hệ | K8 |
| F7 | S1 trang chủ | K2, K3 |
| F8 | S8, S9, metadata, JSON-LD, sitemap | — |
| F9 | E2E: thực đơn → đặt món → đã gửi; liên hệ | Tất cả |

Xong F1–F5 là khách **đã gửi được yêu cầu đặt món thật** về Telegram.

---

## 12. Cần xác nhận
1. Địa chỉ, giờ mở cửa (có nghỉ ngày nào không, có nghỉ trưa không), SĐT, Zalo, username Telegram, link Google Maps.
2. Có nhận giao tận nơi không, bán kính bao xa? Mặc định: có, 3 km.
3. Cho hẹn giờ trước tối đa bao nhiêu ngày? Mặc định: 7 ngày.

---

## Nhật ký thay đổi

| Phiên bản | Ngày | Thay đổi |
|---|---|---|
| v2.0 | 2026-10-07 | Viết lại cho Bánh Mì Thanh Long: thực đơn, chi tiết món, đặt món, đã gửi, liên hệ có form; bỏ giỏ hàng, thanh toán, tra cứu đơn, bộ sưu tập, lọc/sắp xếp |
| v1.2 | 2026-10-05 | (Lamora) |
