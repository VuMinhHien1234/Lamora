# 05 — SHOP PAGES: Các màn hình web khách hàng

> Dựa trên `00-MASTER-PLAN.md` v0.2, `01-TECH-STANDARDS.md` v1.0, `03-UI-DESIGN.md` v1.0, `04-SERVER-LAYER.md` v1.1 · Phiên bản: v1.2 · 2026-10-05
>
> Thư mục code: `src/app/(shop)/`. Đường dẫn tiếng Việt không dấu. Giao diện mobile-first (thiết kế từ 360px). Màu, font, component và wireframe từng trang: xem `03-UI-DESIGN.md`.
>
> Cột “API” tham chiếu tên hàm trong `04`. **S** = Server Component · **C** = Client Component.

---

## 1. Tổng hợp màn hình

| # | Màn hình | Đường dẫn | Ưu tiên |
|---|---|---|---|
| S0 | Khung chung (header, footer, nút chat) | layout `(shop)` | P0 |
| S1 | Trang chủ | `/` | P0 |
| S2 | Tất cả sản phẩm | `/san-pham` | P0 |
| S3 | Danh mục | `/danh-muc/[slug]` | P0 |
| S4 | Bộ sưu tập | `/bo-suu-tap/[slug]` | P0 |
| S5 | Kết quả tìm kiếm | `/tim-kiem?q=` | P0 |
| S6 | Chi tiết sản phẩm | `/san-pham/[slug]` | P0 |
| S7 | Giỏ hàng | `/gio-hang` | P0 |
| S8 | Thanh toán | `/thanh-toan` | P0 |
| S9 | Đặt hàng thành công | `/dat-hang-thanh-cong?code=` | P0 |
| S10 | Tra cứu đơn hàng | `/tra-cuu-don` | P0 |
| S11 | Trang tĩnh (5 trang) | `/gioi-thieu`, `/lien-he`, `/chinh-sach-doi-tra`, `/chinh-sach-van-chuyen`, `/chinh-sach-bao-mat` | P0 |
| S12 | 404 / lỗi | `not-found.tsx`, `error.tsx` | P0 |
| — | Tài khoản khách, yêu thích, blog | — | P2 |

S2–S5 dùng **chung một khung danh sách sản phẩm** (mục 3), chỉ khác tiêu đề và bộ lọc mặc định.

---

## 2. S0 — Khung chung

| Thành phần | Mô tả | Loại | API |
|---|---|---|---|
| `AnnouncementBar` | Dải thông báo trên cùng: “Miễn phí ship đơn từ 800.000đ” (lấy từ config) | S | — |
| `Header` | Logo, menu danh mục, ô tìm kiếm, biểu tượng giỏ hàng có số lượng | S + C | `listActiveCategories` |
| `MobileMenu` | Menu trượt từ trái trên điện thoại | C | — |
| `SearchBox` | Gõ ≥ 2 ký tự hiện tối đa 6 gợi ý; Enter → S5 | C | `searchSuggestions` |
| `CartButton` | Đọc số lượng từ giỏ trên trình duyệt | C | — |
| `Footer` | Thông tin shop, link trang tĩnh, mạng xã hội, giờ làm việc | S | config `site.ts` |
| `ChatFloatingButtons` | Nút Zalo và Messenger nổi góc phải dưới | C | config `site.ts` |

**Kho giỏ hàng (`features/cart`)**: state phía trình duyệt lưu `[{ variantId, quantity }]` vào localStorage (có xử lý khi trình duyệt chặn lưu trữ). Các hàm: thêm, sửa số lượng, xóa dòng, xóa hết, đếm số lượng.

---

## 3. S2–S5 — Danh sách sản phẩm

| Màn hình | Tiêu đề & phần đầu trang | Bộ lọc cố định |
|---|---|---|
| S2 Tất cả sản phẩm | “Tất cả sản phẩm” | — |
| S3 Danh mục | Tên + mô tả danh mục, danh mục con (nếu có) | `categorySlug` |
| S4 Bộ sưu tập | Ảnh banner + tên + mô tả bộ sưu tập | `collectionSlug` |
| S5 Tìm kiếm | “Kết quả cho ‘…’ (N sản phẩm)” | `q` |

**Thành phần dùng chung**
| Thành phần | Mô tả | Loại |
|---|---|---|
| `Breadcrumb` | Trang chủ › Danh mục › … | S |
| `ProductFilters` | Lọc theo danh mục, màu (ô màu), khoảng giá. Trên điện thoại mở dạng bảng trượt từ dưới lên | C |
| `ProductSort` | Mới nhất · Giá tăng dần · Giá giảm dần · Nổi bật | C |
| `ActiveFilterChips` | Các bộ lọc đang chọn, bấm × để bỏ | C |
| `ProductGrid` | 2 cột điện thoại, 3 cột tablet, 4 cột máy tính | S |
| `ProductCard` | Ảnh, tên, giá từ, giá gạch ngang, nhãn “Hết hàng”, ô màu | S |
| `Pagination` | 24 sản phẩm/trang | S |

**Dữ liệu:** sản phẩm luôn lấy qua `listProducts` (truyền `categorySlug` / `collectionSlug` / `q`); S3 thêm `getCategoryBySlug`, S4 thêm `getCollectionBySlug` để lấy tiêu đề, mô tả, SEO.

**Quy tắc**
- Bộ lọc, sắp xếp, trang đều nằm trên URL (`?mau=hong&gia=200000-500000&sap-xep=gia-tang&trang=2`) để chia sẻ link được và trình duyệt quay lại đúng chỗ.
- Trạng thái rỗng: “Chưa có sản phẩm phù hợp” + nút “Xóa bộ lọc”.
- Slug không tồn tại → 404.
- SEO: S3, S4 có metadata riêng; S5 đặt `noindex`.

---

## 4. S1 — Trang chủ

| Khối (từ trên xuống) | Nội dung | API |
|---|---|---|
| `HeroBanner` | 1 ảnh lớn + tiêu đề + nút “Xem bộ sưu tập”. P0 lấy từ config; P1 chuyển sang bảng Banner | — |
| `CategoryShortcuts` | Các danh mục dạng ô ảnh tròn/vuông, cuộn ngang trên điện thoại | `listActiveCategories` |
| `FeaturedProducts` | “Sản phẩm nổi bật”, 8 sản phẩm | `listFeaturedProducts` |
| `CollectionSections` | Mỗi bộ sưu tập `showOnHome` một khối: tiêu đề + dải sản phẩm cuộn ngang + “Xem tất cả” | `listHomeCollections` |
| `BrandPromise` | 4 cam kết: hoa lụa cao cấp, thiệp lời nhắn miễn phí, giao toàn quốc, đổi trả 7 ngày | config |
| `InstagramStrip` *(P2)* | Ảnh mạng xã hội | — |

---

## 5. S6 — Chi tiết sản phẩm

| Thành phần | Mô tả | Loại | API |
|---|---|---|---|
| `Breadcrumb` | | S | |
| `ProductGallery` | Ảnh lớn + ảnh nhỏ; vuốt trên điện thoại; bấm để phóng to. Chọn màu → chuyển tới ảnh của màu đó | C | |
| `ProductInfo` | Tên, giá (đổi theo biến thể), giá gạch ngang, mô tả ngắn | S | `getProductBySlug` |
| `VariantSelector` | Chọn màu (ô màu) và kích thước. Biến thể hết hàng bị làm mờ, không chọn được | C | |
| `QuantityInput` | 1 → tồn kho tối đa (≤ 99) | C | |
| `AddToCartButton` | “Thêm vào giỏ” → hiện thông báo + mở giỏ nhỏ; nút phụ “Mua ngay” → tới S8 | C | |
| `StickyBuyBar` | Trên điện thoại: thanh giá + nút mua dính ở đáy màn hình | C | |
| `ProductDetailsAccordion` | Mô tả · Chất liệu & bảo quản · Giao hàng & đổi trả (dạng accordion, `03` mục 9.4) | S | |
| `ChatToOrder` | “Cần tư vấn? Nhắn Zalo” | S | |
| `RelatedProducts` | 4 sản phẩm cùng danh mục | S | `listRelatedProducts` |

**SEO:** `generateMetadata` (tên, mô tả, ảnh), dữ liệu cấu trúc `Product` (JSON-LD) có giá và tình trạng còn hàng.

---

## 6. S7 — Giỏ hàng

| Thành phần | Mô tả | Loại | API |
|---|---|---|---|
| `CartLineList` | Ảnh, tên, biến thể, đơn giá, số lượng (+/−), thành tiền, nút xóa | C | `validateCart` |
| `CartWarnings` | Cảnh báo từ server: hết hàng, không đủ số lượng, giá thay đổi, ngừng bán | C | |
| `FreeShippingProgress` | “Mua thêm 150.000đ để được miễn phí ship” | C | config |
| `CartSummary` | Tạm tính, ghi chú “Phí ship tính ở bước thanh toán”, nút “Thanh toán” | C | |
| `EmptyCart` | Giỏ trống + nút “Tiếp tục mua sắm” | S | |

Ngoài trang này có `MiniCartDrawer`: ngăn trượt từ phải, hiện khi thêm sản phẩm, dùng chung `CartLineList` bản gọn.

**Quy tắc:** mỗi lần mở trang và mỗi lần đổi số lượng đều gọi `validateCart`; giá hiển thị luôn là giá server trả về. Có dòng lỗi thì khóa nút “Thanh toán”.

---

## 7. S8 — Thanh toán

Một trang, chia khối từ trên xuống. Trên máy tính: form bên trái, tóm tắt đơn bên phải (dính khi cuộn).

| Khối | Trường | API |
|---|---|---|
| 1. Người đặt | Họ tên*, Số điện thoại*, Email | |
| 2. Quà tặng | Công tắc “Đây là quà tặng” → hiện: Tên người nhận*, SĐT người nhận*, Lời nhắn thiệp (đếm ký tự /300), Gói quà (+20.000đ) | |
| 3. Địa chỉ giao | Tỉnh/thành* → Phường/xã* (ô chọn có tìm kiếm), Số nhà, đường* | `getAddressOptions` |
| 4. Thời gian | Ngày muốn nhận (từ ngày mai đến +30 ngày), Ghi chú | |
| 5. Thanh toán | COD · Chuyển khoản (VietQR). Mô tả ngắn dưới mỗi lựa chọn | |
| `OrderSummary` | Danh sách sản phẩm gọn, tạm tính, phí ship (cập nhật khi chọn tỉnh), phí gói quà, tổng cộng | `validateCart`, `quoteShipping` |
| Ô đồng ý | “Tôi đồng ý với Chính sách bảo mật và Điều khoản mua hàng” (bắt buộc, `08` Phần IV) | |
| Nút “Đặt hàng” | Khóa khi đang gửi; lỗi hiện ngay tại trường tương ứng | `createOrder` |

**Quy tắc**
- Form dùng React Hook Form + schema Zod dùng chung với `createOrder`.
- Giỏ trống → chuyển về S7.
- Có trường ẩn `website` để bẫy bot.
- Lỗi `CART_INVALID` → hiện danh sách dòng lỗi và link về giỏ hàng.
- Đặt thành công → xóa giỏ, chuyển tới S9.
- Nhớ thông tin người đặt và địa chỉ trên trình duyệt cho lần mua sau (P1).

---

## 8. S9 — Đặt hàng thành công

| Thành phần | Mô tả | API |
|---|---|---|
| `OrderSuccessHeader` | “Cảm ơn bạn! Mã đơn: LMR-…” + nút sao chép mã | `getOrderConfirmation` |
| `BankTransferBox` | Chỉ hiện với đơn chuyển khoản: ảnh QR, ngân hàng, số tài khoản, chủ tài khoản, số tiền, nội dung chuyển khoản (đều có nút sao chép) | `getBankTransferInfo` |
| `OrderRecap` | Sản phẩm, địa chỉ giao, tổng tiền | |
| `NextSteps` | “Shop sẽ gọi xác nhận trong giờ làm việc”, link tra cứu đơn, nút nhắn Zalo | |

Mở lại trang sau khi cookie xác nhận hết hạn → chuyển sang S10. Trang đặt `noindex`.

---

## 9. S10 — Tra cứu đơn hàng

| Thành phần | Mô tả | API |
|---|---|---|
| `OrderLookupForm` | Mã đơn + Số điện thoại | `lookupOrder` |
| `OrderStatusTimeline` | Các bước Chờ xác nhận → Đã xác nhận → Đang giao → Đã giao, kèm thời gian; đơn hủy hiện riêng | |
| `OrderDetailCard` | Sản phẩm, tổng tiền, trạng thái thanh toán, đơn vị vận chuyển + mã vận đơn | |
| `BankTransferBox` | Hiện lại nếu đơn chuyển khoản chưa thanh toán | `getBankTransferInfo` |

Không tìm thấy → “Không tìm thấy đơn. Kiểm tra lại mã đơn và số điện thoại”.

---

## 10. S11 — Trang tĩnh

| Trang | Nội dung |
|---|---|
| Giới thiệu | Câu chuyện Lamora Flower, ảnh, cam kết chất lượng |
| Liên hệ | SĐT, Zalo, Messenger, email, giờ làm việc. P0 **không** có form liên hệ |
| Chính sách đổi trả | Điều kiện, thời hạn, cách đổi |
| Chính sách vận chuyển | Bảng phí theo vùng, thời gian giao dự kiến |
| Chính sách bảo mật | Dữ liệu thu thập, mục đích, cách liên hệ để xóa |

Nội dung viết bằng Markdown trong `src/content/`, render chung một khung `StaticPageLayout`. Sửa nội dung không cần sửa code.

---

## 11. S12 — 404 và lỗi

- `not-found.tsx`: “Không tìm thấy trang” + ô tìm kiếm + sản phẩm nổi bật.
- `error.tsx`: “Có lỗi xảy ra” + nút “Thử lại” + nút nhắn Zalo.
- `loading.tsx` cho S2–S6: khung xương (skeleton) đúng bố cục để trang không bị nhảy.

---

## 12. Thứ tự code đề xuất

| Bước | Việc | Phụ thuộc backend (`04` mục 14) |
|---|---|---|
| F1 | S0 khung chung + kho giỏ hàng + các component UI cơ bản | A1–A3 |
| F2 | `ProductCard`, `ProductGrid` + S2 (chưa lọc) | B5 |
| F3 | S6 Chi tiết sản phẩm + thêm vào giỏ | B5 |
| F4 | S7 Giỏ hàng + `MiniCartDrawer` | C2 |
| F5 | S8 Thanh toán | C1, C3 |
| F6 | S9 Đặt hàng thành công | C5 |
| F7 | Bộ lọc, sắp xếp, phân trang; S3, S4, S5 | B1, B2, B5 |
| F8 | S1 Trang chủ | B1, B2, B5 |
| F9 | S10 Tra cứu đơn | C5 |
| F10 | S11, S12, metadata SEO, JSON-LD, sitemap | — |
| F11 | E2E Playwright: xem → thêm giỏ → đặt COD → tra cứu | Tất cả |

Ưu tiên F1–F6 trước: xong 6 bước này là khách đã **đặt được đơn thật**.

---

## 13. Cần xác nhận

1. Có cần nút “Mua ngay” (bỏ qua giỏ hàng, vào thẳng thanh toán) không? Mặc định: **có**.
2. Chính sách đổi trả: mặc định ghi **7 ngày**, bạn điều chỉnh khi viết nội dung trang.

---

## Ghi chú triển khai F1 (2026-10-05)

- Khung S0 đã có: thanh thông báo, header (co lại khi cuộn), menu di động, footer, nút chat nổi (ẩn khi chưa điền link trong `src/config/site.ts`).
- Chưa làm (để đúng bước): mega menu → B1; gợi ý tìm kiếm → B5; giỏ nhỏ (drawer) → F4. Hiện biểu tượng giỏ chỉ hiển thị số lượng từ kho giỏ hàng (localStorage).
- Thông tin liên hệ trong `src/config/site.ts` đang là giá trị tạm, chủ shop cần điền thật.

## Nhật ký thay đổi

| Phiên bản | Ngày | Thay đổi |
|---|---|---|
| v1.2 | 2026-10-05 | Làm rõ nguồn dữ liệu danh sách; thống nhất cam kết “thiệp lời nhắn miễn phí” |
| v1.1 | 2026-10-05 | Đổi tab chi tiết sản phẩm sang accordion; thêm ô đồng ý chính sách ở trang thanh toán |
| v1.0 | 2026-10-05 | Bản đầu tiên |

> Ghi chú F3 (2026-10-06): chưa có phóng to ảnh khi bấm và `MiniCartDrawer` (làm ở F4); nút “Mua ngay” đi tới `/thanh-toan` (trang S8 làm ở F5, tới lúc đó sẽ báo 404). Mô tả sản phẩm hiển thị bằng bộ đọc Markdown nhỏ tự viết (`lib/markdown.ts`), không dùng thư viện ngoài.

> Ghi chú F4 (2026-10-06): S7 và `MiniCartDrawer` đã làm. Giỏ kiểm tra lại với server khi mở và sau mỗi lần đổi số lượng (chờ 250ms); nút “Thanh toán” bị khóa khi có dòng hết hàng/ngừng bán hoặc chưa tải xong. Nút “Thêm vào giỏ” mở giỏ nhỏ thay vì hiện thông báo.
