# 04 — SERVER LAYER: Backend & danh sách API

> Dựa trên `00-MASTER-PLAN.md` v0.2, `01-TECH-STANDARDS.md` v1.0, `02-DATABASE.md` v1.2 · Phiên bản: v1.2 · 2026-10-05
>
> Dự án là Next.js fullstack, nên “API” gồm 3 loại (xem `01` mục 3):
>
> | Ký hiệu | Loại | Gọi từ đâu |
> |---|---|---|
> | **Q** | Query: hàm đọc dữ liệu, đặt trong `features/X/queries.ts` | Server Component |
> | **A** | Server Action: thay đổi dữ liệu | Form/nút bấm phía khách hoặc admin |
> | **R** | Route Handler (`/api/...`) | Bên ngoài gọi vào (auth, health check) |
>
> Cột “Quyền”: 🌐 công khai · 🔐 chỉ admin (phải gọi `requireAdmin()` ở đầu hàm).
>
> Mọi Action trả về `ActionResult<T>` (xem `01` mục 8.2). Mọi input được validate bằng Zod trong `features/X/schema.ts`.

---

## 1. Tổng quan theo feature

| Feature | Số API P0 | Dùng cho |
|---|---|---|
| `auth` | 3 | Đăng nhập admin |
| `category` | 7 | Danh mục |
| `collection` | 8 | Bộ sưu tập theo dịp |
| `product` | 13 | Sản phẩm, biến thể, ảnh |
| `media` | 1 | Chữ ký upload ảnh Cloudinary (dùng chung) |
| `cart` | 1 | Kiểm tra giỏ hàng |
| `shipping` | 2 | Phí ship, danh sách tỉnh/xã |
| `order` | 10 | Đặt hàng, tra cứu, xử lý đơn |
| `payment` | 1 | Thông tin chuyển khoản VietQR |
| `notification` | 1 (nội bộ) | Báo Telegram |
| `dashboard` | 1 | Số liệu nhanh cho admin |

---

## 2. `auth`

| # | Tên | Loại | Quyền | Input | Output / Ghi chú |
|---|---|---|---|---|---|
| 1 | `/api/auth/[...all]` | R | 🌐 | — | Route của Better Auth (đăng nhập, đăng xuất, phiên). **Tắt đăng ký** tài khoản mới |
| 2 | `requireAdmin()` | helper | — | — | Đọc phiên ở server; trả về admin hiện tại; chưa đăng nhập → lỗi `UNAUTHORIZED`; `mustChangePassword = true` → lỗi `PASSWORD_CHANGE_REQUIRED` (trừ khi đang ở trang đổi mật khẩu). **Mọi** action/query 🔐 gọi hàm này đầu tiên |
| 3 | `changePassword` | A | 🔐 | `currentPassword`, `newPassword` (≥ 10 ký tự) | `ok`. Dùng API đổi mật khẩu của Better Auth, **thu hồi các phiên khác**, đặt `mustChangePassword = false` |

Quy tắc: đăng nhập sai 5 lần trong 15 phút → khóa thêm 15 phút (đếm bằng bảng `RateLimitHit`, chi tiết ở `08` mục 3). Đăng nhập lần đầu khi `mustChangePassword = true` → chuyển tới trang đổi mật khẩu.

---

## 3. `category`

| # | Tên | Loại | Quyền | Input | Output / Ghi chú |
|---|---|---|---|---|---|
| 1 | `listActiveCategories` | Q | 🌐 | — | Cây danh mục đang bật, sắp theo `sortOrder`. Dùng cho menu |
| 2 | `getCategoryBySlug` | Q | 🌐 | `slug` | Danh mục + SEO; không có → 404 |
| 3 | `adminListCategories` | Q | 🔐 | — | Tất cả danh mục + số sản phẩm mỗi danh mục |
| 4 | `createCategory` | A | 🔐 | `name`, `slug?`, `description?`, `imagePublicId?`, `parentId?`, `isActive`, `seo*?` | Category. Slug tự sinh nếu trống; trùng thì thêm hậu tố `-2` |
| 5 | `updateCategory` | A | 🔐 | `id` + các trường trên | Category. Không cho đặt `parentId` thành chính nó hoặc danh mục con của nó |
| 6 | `reorderCategories` | A | 🔐 | `[{ id, sortOrder }]` | `ok` |
| 7 | `deleteCategory` | A | 🔐 | `id` | Chỉ xóa được khi **không còn sản phẩm và danh mục con**; nếu còn → lỗi `CATEGORY_NOT_EMPTY` |

---

## 4. `collection`

| # | Tên | Loại | Quyền | Input | Output / Ghi chú |
|---|---|---|---|---|---|
| 1 | `listHomeCollections` | Q | 🌐 | — | Bộ sưu tập `showOnHome`, kèm tối đa 8 sản phẩm ACTIVE mỗi bộ |
| 2 | `getCollectionBySlug` | Q | 🌐 | `slug` | Thông tin bộ sưu tập + SEO; không có → 404. Danh sách sản phẩm lấy qua `listProducts({ collectionSlug })` |
| 3 | `adminListCollections` | Q | 🔐 | — | Tất cả + số sản phẩm |
| 4 | `createCollection` | A | 🔐 | `name`, `slug?`, `description?`, `imagePublicId?`, `isActive`, `showOnHome` | Collection |
| 5 | `updateCollection` | A | 🔐 | `id` + trường trên | Collection |
| 6 | `deleteCollection` | A | 🔐 | `id` | Xóa bộ sưu tập, **không** xóa sản phẩm |
| 7 | `setCollectionProducts` | A | 🔐 | `collectionId`, `productIds[]` (theo thứ tự) | Ghi đè danh sách sản phẩm và thứ tự |
| 8 | `reorderCollections` | A | 🔐 | `[{ id, sortOrder }]` | `ok` |

---

## 5. `product`

### 5.1 Phía khách
| # | Tên | Loại | Quyền | Input | Output / Ghi chú |
|---|---|---|---|---|---|
| 1 | `listProducts` | Q | 🌐 | `categorySlug?`, `collectionSlug?`, `q?`, `colors?[]`, `priceMin?`, `priceMax?`, `sort` (`newest` · `price_asc` · `price_desc` · `featured`), `page` (24 sp/trang) | `{ items: ProductCard[], total, page, pageCount, availableColors[] }`. Chỉ lấy `status = ACTIVE` |
| 2 | `getProductBySlug` | Q | 🌐 | `slug` | Chi tiết + variant đang bật + ảnh + danh mục. Không ACTIVE → 404 |
| 3 | `listFeaturedProducts` | Q | 🌐 | `limit` (mặc định 8) | `ProductCard[]` |
| 4 | `listRelatedProducts` | Q | 🌐 | `productId`, `limit` (mặc định 4) | Cùng danh mục, khác sản phẩm hiện tại |
| 5 | `searchSuggestions` | Q | 🌐 | `q` (≥ 2 ký tự) | Tối đa 6 gợi ý `{ name, slug, imageUrl, priceFrom }`. Bỏ dấu `q` rồi so với `searchText` |

`ProductCard` = `{ id, name, slug, imageUrl, priceFrom, compareAtPriceFrom?, isOutOfStock, colorSwatches[] }`

### 5.2 Phía admin
| # | Tên | Loại | Quyền | Input | Output / Ghi chú |
|---|---|---|---|---|---|
| 6 | `adminListProducts` | Q | 🔐 | `q?`, `status?`, `categoryId?`, `lowStock?`, `page` | Bảng sản phẩm + tổng tồn kho |
| 7 | `adminGetProduct` | Q | 🔐 | `id` | Đầy đủ, kể cả DRAFT/ARCHIVED |
| 8 | `createProduct` | A | 🔐 | `name`, `slug?`, `categoryId`, `shortDescription?`, `description?`, `material?`, `careInstructions?`, `isFeatured`, `seo*?`, `variants[]` (≥ 1) | Product ở trạng thái **DRAFT** |
| 9 | `updateProduct` | A | 🔐 | `id` + thông tin chung (không gồm variant) | Product |
| 10 | `upsertVariants` | A | 🔐 | `productId`, `variants[]`: `{ id?, colorName?, colorHex?, size?, sku?, price, compareAtPrice?, stockQuantity, isActive, sortOrder }` | Danh sách variant. Variant có `id` → sửa; không có → tạo; variant cũ không có trong danh sách → **tắt** (không xóa nếu đã có đơn) |
| 11 | `setProductStatus` | A | 🔐 | `id`, `status` | Chuyển sang ACTIVE yêu cầu: ≥ 1 ảnh, ≥ 1 variant đang bật, giá > 0. Thiếu → lỗi `PRODUCT_NOT_READY` kèm danh sách thiếu. Lần đầu ACTIVE ghi `publishedAt`; ARCHIVED ghi `archivedAt` |
| 12 | `saveProductImages` | A | 🔐 | `productId`, `images[]`: `{ publicId, alt, width, height, variantId? }` | Lưu ảnh đã upload |
| 13 | `updateProductImages` | A | 🔐 | `productId`, `images[]`: `{ id, alt, sortOrder, variantId? }`, `deleteIds[]` | Sắp xếp, sửa alt, xóa ảnh (xóa cả trên Cloudinary) |

**Việc tự động trong `product.service`** (không phải API, nhưng bắt buộc chạy sau mỗi thay đổi sản phẩm/variant):
- `recalculatePriceFrom(productId)` → cập nhật `priceFrom`.
- `rebuildSearchText(productId)` → tên + danh mục + màu, bỏ dấu, chữ thường.
- `generateSku(product, variant)` khi SKU trống.
- Làm mới cache tag `products` và `product:<id>`.
- Quy ước đã triển khai (3a): SKU tự sinh dạng `LMR-<chữ cái đầu tên>-<màu>-<cỡ>` (trùng thì thêm `-2`, `-3`). `upsertVariants`: biến thể bị bỏ khỏi danh sách sẽ **tắt** nếu đã có trong đơn hàng, **xóa** nếu chưa; sản phẩm đang bán không được tắt hết biến thể. `priceFrom` chỉ tính biến thể đang bán. Ngưỡng sắp hết hàng (≤ 3) ở `src/config/inventory.ts`.

---

## 5b. `media`

| # | Tên | Loại | Quyền | Input | Output / Ghi chú |
|---|---|---|---|---|---|
| 1 | `getImageUploadSignature` | A | 🔐 | `folder`: `products` · `categories` · `collections` · `banners` | Chữ ký upload Cloudinary (trình duyệt upload thẳng lên Cloudinary, không đi qua server). Thư mục cố định `lamora/<folder>`; jpg/png/webp, ≤ 5 MB; Cloudinary tự giới hạn chữ ký trong 1 giờ kể từ `timestamp` (không ép được 10 phút phía server). Dùng cho sản phẩm, danh mục, bộ sưu tập |

Xóa ảnh trên Cloudinary: hàm nội bộ `deleteImage(publicId)` trong `media/service.ts`, được `product`, `category`, `collection` gọi khi xóa/thay ảnh. Xóa theo kiểu **cố gắng hết sức**: lỗi mạng chỉ ghi log, không làm hỏng thao tác của chủ shop (ảnh mồ côi còn sót chỉ tốn dung lượng, dọn tay trên Cloudinary). `isShopPublicId(publicId, folder)` kiểm tra publicId thuộc `lamora/<folder>/` trước khi lưu vào DB.

---

## 6. `cart`

Giỏ hàng lưu ở trình duyệt dạng `[{ variantId, quantity }]`.

| # | Tên | Loại | Quyền | Input | Output / Ghi chú |
|---|---|---|---|---|---|
| 1 | `validateCart` | A | 🌐 | `items[]` (≤ 30 dòng, quantity 1–99) | `{ lines: [{ variantId, productName, variantLabel, imageUrl, unitPrice, quantity, lineTotal, available, maxQuantity }], subtotal, warnings[] }`. Giá **lấy từ DB**. Cảnh báo khi: sản phẩm ngừng bán, hết hàng, không đủ số lượng, giá thay đổi |

---

## 7. `shipping`

| # | Tên | Loại | Quyền | Input | Output / Ghi chú |
|---|---|---|---|---|---|
| 1 | `getAddressOptions` | Q | 🌐 | `provinceCode?` | Không có `provinceCode` → danh sách tỉnh; có → danh sách phường/xã của tỉnh. Đọc từ JSON trong `src/config` |
| 2 | `quoteShipping` | A | 🌐 | `provinceCode`, `subtotal` | `{ zone, shippingFee, freeShippingThreshold, amountToFreeShipping }` |

**Hàm thuần dùng chung** (có unit test): `getZoneByProvince(provinceCode)`, `calculateShippingFee(zone, subtotal)`.

Bảng phí mặc định trong `src/config/shipping.ts`:

| Vùng | Phí |
|---|---|
| `HANOI_INNER` (Hà Nội) | 25.000đ |
| `NORTH` (các tỉnh miền Bắc khác) | 35.000đ |
| `CENTRAL_SOUTH` (miền Trung, miền Nam) | 40.000đ |
| Miễn phí ship khi `subtotal` ≥ | 800.000đ |
| Phí gói quà | 20.000đ |

---

## 8. `order`

### 8.1 Phía khách
| # | Tên | Loại | Quyền | Input | Output / Ghi chú |
|---|---|---|---|---|---|
| 1 | `createOrder` | A | 🌐 | Xem 8.3 | `{ code, total, paymentMethod }` → chuyển tới trang cảm ơn |
| 2 | `getOrderConfirmation` | Q | 🌐 | `code` + cookie phiên đặt hàng | Thông tin trang cảm ơn. Chỉ xem được ngay sau khi đặt (cookie ký, hết hạn 1 giờ) |
| 3 | `lookupOrder` | A | 🌐 | `code`, `phone` | Trạng thái, danh sách sản phẩm, tổng tiền, lịch sử trạng thái, mã vận đơn. Phải khớp **cả hai**; sai → thông báo chung “Không tìm thấy đơn”. Giới hạn 10 lần / 10 phút / IP |

### 8.2 Phía admin
| # | Tên | Loại | Quyền | Input | Output / Ghi chú |
|---|---|---|---|---|---|
| 4 | `adminListOrders` | Q | 🔐 | `status?`, `paymentStatus?`, `paymentMethod?`, `q?` (mã đơn / SĐT / tên), `dateFrom?`, `dateTo?`, `page` | Bảng đơn + số đơn theo từng trạng thái (cho tab lọc) |
| 5 | `adminGetOrder` | Q | 🔐 | `id` | Đầy đủ: khách, người nhận, sản phẩm, tiền, ghi chú, lịch sử |
| 6 | `updateOrderStatus` | A | 🔐 | `id`, `toStatus`, `note?`, `carrier?`, `trackingCode?` | Kiểm tra theo luồng ở `02` mục 2. Ghi `*At` tương ứng, ghi `OrderStatusHistory`. Sang `CANCELLED`/`RETURNED` → cộng lại kho; nếu đơn đã `PAID` có tùy chọn `markRefunded` → `paymentStatus = REFUNDED`. Đơn COD sang `DELIVERED` → tự đánh dấu `PAID` |
| 7 | `cancelOrder` | A | 🔐 | `id`, `reason` (bắt buộc) | Gọi chung logic của #6 với `toStatus = CANCELLED` |
| 8 | `markOrderPaid` | A | 🔐 | `id`, `paidAt?` | Dùng khi đã nhận chuyển khoản. Ghi `paidAt`, lịch sử |
| 9 | `updateOrderShippingInfo` | A | 🔐 | `id`, `carrier?`, `trackingCode?`, `recipientName?`, `recipientPhone?`, `addressLine?`, `wardCode?`, `provinceCode?` | Chỉ sửa được khi đơn ở `PENDING`/`CONFIRMED`. **Không** tính lại phí ship tự động; ghi chú vào lịch sử |
| 10 | `updateAdminNote` | A | 🔐 | `id`, `adminNote` | |

### 8.3 Chi tiết `createOrder`

**Input**
```ts
{
  items: { variantId: string; quantity: number }[];   // 1–30 dòng
  customer: { name: string; phone: string; email?: string };
  isGift: boolean;
  recipient?: { name: string; phone: string };         // bắt buộc nếu isGift
  address: { provinceCode: string; wardCode: string; addressLine: string };
  giftMessage?: string;                                // ≤ 300 ký tự
  giftWrap: boolean;
  preferredDeliveryDate?: string;                      // YYYY-MM-DD, từ ngày mai đến +30 ngày
  customerNote?: string;                               // ≤ 500 ký tự
  paymentMethod: 'COD' | 'BANK_TRANSFER';
  website?: string;                                    // trường bẫy bot, phải rỗng
}
```

**Các bước xử lý (trong `order.service.createOrder`)**
1. Validate Zod. Trường `website` khác rỗng → trả thành công giả, không tạo đơn.
2. Chống spam: đếm đơn cùng `ipHash` trong 10 phút; quá 3 → lỗi `TOO_MANY_ORDERS`.
3. Chuẩn hóa số điện thoại về `0xxxxxxxxx`; kiểm tra tỉnh/xã tồn tại trong dữ liệu địa chỉ.
4. Mở **transaction**:
   1. Đọc các variant theo `variantId`, khóa dòng (`SELECT … FOR UPDATE`).
   2. Kiểm tra từng dòng: product ACTIVE, variant đang bật, đủ tồn kho. Sai → lỗi `CART_INVALID` kèm danh sách dòng lỗi.
   3. Tính `subtotal`, `shippingFee` (hàm ở mục 7), `giftWrapFee`, `total`.
   4. Sinh `code` duy nhất (thử lại nếu trùng).
   5. Tạo `Order`, các `OrderItem` (chụp tên, nhãn biến thể, SKU, ảnh, giá), bản ghi `OrderStatusHistory` đầu tiên.
   6. Trừ `stockQuantity` từng variant.
5. Sau transaction (lỗi ở đây **không** làm hỏng đơn): gửi Telegram, đặt cookie xác nhận đơn, `revalidateTag` sản phẩm liên quan.

**Mã lỗi:** `VALIDATION_ERROR` · `TOO_MANY_ORDERS` · `CART_EMPTY` · `CART_INVALID` · `INVALID_ADDRESS` · `INTERNAL_ERROR`

---

## 9. `payment`

| # | Tên | Loại | Quyền | Input | Output / Ghi chú |
|---|---|---|---|---|---|
| 1 | `getBankTransferInfo` | Q | 🌐 (cùng điều kiện như `getOrderConfirmation` hoặc `lookupOrder`) | `code` | `{ bankName, accountNo, accountName, amount, transferContent, qrImageUrl }`; `transferContent` = mã đơn bỏ dấu gạch (`LMR261005K7QF`). Chỉ trả khi đơn là `BANK_TRANSFER` và `UNPAID`. Cách sinh mã VietQR ở `07` |

---

## 10. `notification` (nội bộ, không gọi từ giao diện)

| Tên | Gọi khi | Nội dung |
|---|---|---|
| `notifyAdminLogin({ time, ipHash })` | Sau khi admin đăng nhập thành công | “Đăng nhập quản trị lúc 22:41 05/10/2026”. Giúp phát hiện đăng nhập lạ (`08` mục 1) |
| `notifyNewOrder(order)` | Sau khi tạo đơn | Tin nhắn Telegram: mã đơn, tên + SĐT khách, danh sách sản phẩm, tổng tiền, phương thức thanh toán, link tới đơn trong admin. Lỗi gửi → chỉ ghi log, không báo lỗi cho khách |

---

## 11. `dashboard`

| # | Tên | Loại | Quyền | Output |
|---|---|---|---|---|
| 1 | `getAdminSummary` | Q | 🔐 | Số đơn `PENDING`, số đơn chuyển khoản chưa thanh toán, doanh thu hôm nay và 7 ngày (đơn không bị hủy/hoàn, tính theo ngày giờ `Asia/Ho_Chi_Minh`), 5 variant sắp hết hàng (≤ `LOW_STOCK_THRESHOLD` = 3, trong `config/shipping.ts`) |

Báo cáo đầy đủ là P1.

---

## 12. Route handler khác

| Đường dẫn | Mục đích |
|---|---|
| `/api/health` | Trả `{ ok: true }` và kiểm tra kết nối DB. Dùng để giám sát |
| `POST /api/cron/cleanup` | Dọn `RateLimitHit` cũ, xóa `ipHash` > 90 ngày. Yêu cầu `Authorization: Bearer <CRON_SECRET>` (`09` mục 7) |
| `POST /api/cron/pending-reminder` | P1: nhắc đơn chờ qua Telegram. Cùng cách bảo vệ |
| `/sitemap.xml`, `/robots.txt` | Sinh từ `app/sitemap.ts`, `app/robots.ts` |

---

## 13. Mã lỗi dùng chung

| Mã | Khi nào | Thông báo cho người dùng |
|---|---|---|
| `VALIDATION_ERROR` | Input sai | Hiện lỗi theo từng trường |
| `UNAUTHORIZED` | Chưa đăng nhập admin | Chuyển tới trang đăng nhập |
| `PASSWORD_CHANGE_REQUIRED` | Admin chưa đổi mật khẩu ban đầu | Chuyển tới trang đổi mật khẩu |
| `NOT_FOUND` | Không tìm thấy | “Không tìm thấy …” |
| `CONFLICT` | Trùng slug, SKU | “… đã tồn tại” |
| `INVALID_STATUS_TRANSITION` | Đổi trạng thái sai luồng | “Không thể chuyển đơn từ A sang B” |
| `PRODUCT_NOT_READY` | Đăng bán khi thiếu ảnh/giá | Liệt kê phần còn thiếu |
| `CATEGORY_NOT_EMPTY` | Xóa danh mục còn sản phẩm | “Danh mục còn N sản phẩm” |
| `CART_INVALID` | Hết hàng, ngừng bán | Chỉ rõ dòng lỗi |
| `TOO_MANY_ORDERS` / `RATE_LIMITED` | Gửi quá nhiều | “Vui lòng thử lại sau ít phút” |
| `INTERNAL_ERROR` | Lỗi không lường trước | “Có lỗi xảy ra, vui lòng thử lại hoặc nhắn Zalo cho shop” |

---

## 14. Kế hoạch triển khai Database + Backend

Mỗi bước là **một việc giao cho AI**, xong thì chạy kiểm tra và commit trước khi sang bước sau.

### Giai đoạn A — Nền tảng
| Bước | Việc | Kết quả kiểm tra |
|---|---|---|
| A1 | Khởi tạo Next.js + TypeScript strict + Tailwind + pnpm + alias `@/` | `pnpm dev` chạy |
| A2 | ESLint (kể cả quy tắc phụ thuộc giữa các lớp), Prettier, Husky, lint-staged, commitlint | Commit sai chuẩn bị chặn |
| A3 | `lib/env.ts`, `lib/errors.ts`, `lib/result.ts`, `lib/money.ts`, `lib/slug.ts`, `lib/logger.ts` + unit test | `pnpm test` qua |
| A4 | Vitest + GitHub Actions (lint, typecheck, test, build) | CI xanh |
| A5 | Tạo DB Neon, Prisma schema theo `02`, migration đầu tiên + migration SQL bổ sung | Bảng tạo được trên Neon |
| A6 | Seed dữ liệu mẫu | Mở Prisma Studio thấy dữ liệu |
| A7 | Better Auth đăng nhập admin, `proxy.ts`, `requireAdmin()`, bắt đổi mật khẩu lần đầu | Vào `/admin` bị chuyển tới đăng nhập |

### Giai đoạn B — Danh mục và sản phẩm
| Bước | Việc |
|---|---|
| B1 | `category`: repository, service, schema, actions, queries + test |
| B2 | `collection`: tương tự B1 |
| B3 | `product` phần admin: tạo/sửa/đổi trạng thái, `upsertVariants`, `recalculatePriceFrom`, `rebuildSearchText`, `generateSku` + test |
| B4 | `media`: chữ ký upload Cloudinary, xóa ảnh; `product`: lưu/sắp xếp/xóa ảnh sản phẩm |
| B5 | `product` phần khách: `listProducts` (lọc, sắp xếp, tìm kiếm, phân trang), `getProductBySlug`, nổi bật, liên quan, gợi ý tìm kiếm + test |

### Giai đoạn C — Giỏ hàng và đơn hàng
| Bước | Việc |
|---|---|
| C1 | `shipping`: dữ liệu tỉnh/xã, `getZoneByProvince`, `calculateShippingFee` + test đủ các vùng và mốc miễn phí |
| C2 | `cart.validateCart` + test |
| C3 | `order.createOrder` đầy đủ 8.3 + test (đủ hàng, hết hàng, giá đổi, spam, mã trùng) |
| C4 | Luồng trạng thái: `updateOrderStatus`, `cancelOrder`, `markOrderPaid`, cộng lại kho + test từng bước chuyển hợp lệ và không hợp lệ |
| C5 | `lookupOrder`, `getOrderConfirmation`, `getBankTransferInfo` |
| C6 | `adminListOrders`, `adminGetOrder`, `updateOrderShippingInfo`, `updateAdminNote` |
| C7 | `notifyNewOrder` qua Telegram |
| C8 | `getAdminSummary`, `/api/health` |

Sau giai đoạn C, backend P0 hoàn tất. Giao diện (`05`, `06`) được làm song song hoặc ngay sau, gọi đúng các hàm trong file này.

---

## 15. Cần xác nhận

1. Bảng phí ship và mức miễn phí ở mục 7 có ổn không?
2. Đơn chuyển khoản chưa thanh toán sau bao lâu thì tự hủy để trả lại hàng vào kho? Mặc định: **không tự hủy**, bạn hủy thủ công. Tự hủy sẽ cần thêm một tác vụ chạy định kỳ.
3. Có cho khách tự hủy đơn khi đơn còn `PENDING` không? Mặc định: **không**, khách nhắn Zalo cho shop.

---

## Nhật ký thay đổi

| Phiên bản | Ngày | Thay đổi |
|---|---|---|
| v1.2 | 2026-10-05 | Đăng nhập theo Better Auth; thêm feature `media` (chữ ký upload dùng chung); `getCollectionBySlug` chỉ trả thông tin bộ sưu tập; thêm `notifyAdminLogin`, mã lỗi `PASSWORD_CHANGE_REQUIRED`; query đặt trong `queries.ts` |
| v1.1 | 2026-10-05 | Nội dung chuyển khoản bỏ dấu gạch; tùy chọn hoàn tiền khi hủy; thêm route `/api/cron/*`; giới hạn tần suất dùng `RateLimitHit` |
| v1.0 | 2026-10-05 | Bản đầu tiên |
