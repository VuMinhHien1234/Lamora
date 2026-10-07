# 04 — SERVER LAYER: Backend & danh sách API

> Dựa trên `00-MASTER-PLAN.md` v1.0, `01-TECH-STANDARDS.md` v2.0, `02-DATABASE.md` v2.0 · Phiên bản: v2.0 · 2026-10-07
>
> “API” gồm 3 loại (`01` mục 3):
>
> | Ký hiệu | Loại | Gọi từ đâu |
> |---|---|---|
> | **Q** | Query trong `features/X/queries.ts` | Server Component |
> | **A** | Server Action | Form/nút bấm |
> | **R** | Route Handler (`/api/...`) | Bên ngoài gọi vào |
>
> Quyền: 🌐 công khai · 🔐 chỉ admin (gọi `requireAdmin()` đầu hàm). Mọi Action trả `ActionResult<T>`; mọi input validate bằng Zod.

---

## 1. Tổng quan theo feature

| Feature | Số API P0 | Dùng cho | So với Lamora |
|---|---|---|---|
| `auth` | 3 | Đăng nhập admin | Giữ nguyên |
| `category` | 7 | Danh mục thực đơn | Giữ, bỏ danh mục con & SEO |
| `product` | 12 | Món, lựa chọn giá, ảnh, “Tạm hết” | Sửa: variant → option, thêm `setProductAvailability` |
| `media` | 1 | Chữ ký upload Cloudinary | Giữ, đổi thư mục `thanhlong/<folder>` |
| `order-request` | 7 | Yêu cầu đặt món | **Mới** (thay `cart`, `order`) |
| `contact` | 4 | Tin liên hệ | **Mới** |
| `notification` | 3 (nội bộ) | Telegram | Sửa mẫu tin |
| `dashboard` | 1 | Số liệu nhanh | Sửa |
| ~~`collection`, `cart`, `shipping`, `order`, `payment`~~ | — | — | **Bỏ** |

---

## 2. `auth`

| # | Tên | Loại | Quyền | Ghi chú |
|---|---|---|---|---|
| 1 | `/api/auth/[...all]` | R | 🌐 | Better Auth. **Tắt đăng ký** |
| 2 | `requireAdmin()` | helper | — | Chưa đăng nhập → `UNAUTHORIZED`; `mustChangePassword` → `PASSWORD_CHANGE_REQUIRED` |
| 3 | `changePassword` | A | 🔐 | ≥ 10 ký tự, thu hồi phiên khác |

Đăng nhập sai 5 lần / 15 phút → khóa 15 phút (`RateLimitHit`).

---

## 3. `category`

| # | Tên | Loại | Quyền | Input | Ghi chú |
|---|---|---|---|---|---|
| 1 | `listMenuCategories` | Q | 🌐 | — | Danh mục đang bật, theo `sortOrder`. Cache tag `categories` |
| 2 | `getCategoryBySlug` | Q | 🌐 | `slug` | Không có → 404 |
| 3 | `adminListCategories` | Q | 🔐 | — | Kèm số món |
| 4 | `createCategory` | A | 🔐 | `name`, `slug?`, `description?`, `imagePublicId?`, `isActive` | Slug tự sinh, trùng thêm `-2` |
| 5 | `updateCategory` | A | 🔐 | `id` + trường trên | |
| 6 | `reorderCategories` | A | 🔐 | `[{ id, sortOrder }]` | |
| 7 | `deleteCategory` | A | 🔐 | `id` | Còn món → `CATEGORY_NOT_EMPTY` |

---

## 4. `product` (món)

### 4.1 Phía khách
| # | Tên | Loại | Quyền | Input | Output / Ghi chú |
|---|---|---|---|---|---|
| 1 | `getMenu` | Q | 🌐 | `categorySlug?` | `{ categories: [{ id, name, slug, description, items: MenuItem[] }] }`. Chỉ món `ACTIVE`, theo `sortOrder`; món `isAvailable = false` vẫn trả về (đánh dấu). Cache tag `products`, `categories` |
| 2 | `getProductBySlug` | Q | 🌐 | `slug` | Món + lựa chọn đang bật + ảnh + danh mục. Không ACTIVE → 404 |
| 3 | `listFeaturedProducts` | Q | 🌐 | `limit` (mặc định 8) | `MenuItem[]` |
| 4 | `listRelatedProducts` | Q | 🌐 | `productId`, `limit` (4) | Cùng danh mục |
| 5 | `getOrderableOptions` | Q | 🌐 | — | Dữ liệu cho bộ chọn món ở `/dat-mon`: danh mục → món → lựa chọn `{ optionId, name, price }`, kèm `isAvailable` |

`MenuItem` = `{ id, name, slug, shortDescription, imageUrl, priceFrom, hasMultipleOptions, tags[], isAvailable, options: { id, name, price }[] }`

### 4.2 Phía admin
| # | Tên | Loại | Quyền | Input | Ghi chú |
|---|---|---|---|---|---|
| 6 | `adminListProducts` | Q | 🔐 | `q?`, `status?`, `categoryId?`, `availability?`, `page` | |
| 7 | `adminGetProduct` | Q | 🔐 | `id` | Kể cả DRAFT/ARCHIVED |
| 8 | `createProduct` | A | 🔐 | `name`, `slug?`, `categoryId`, `shortDescription?`, `description?`, `ingredients?`, `allergyNote?`, `tags[]`, `isFeatured`, `seo*?`, `options[]` (≥ 1) | Tạo ở **DRAFT** |
| 9 | `updateProduct` | A | 🔐 | `id` + thông tin chung | |
| 10 | `upsertOptions` | A | 🔐 | `productId`, `options[]`: `{ id?, name, price, isActive, sortOrder }` | Có `id` → sửa; không → tạo; lựa chọn cũ không còn trong danh sách → **tắt** nếu đã xuất hiện trong yêu cầu, **xóa** nếu chưa. Món đang bán phải còn ≥ 1 lựa chọn bật |
| 11 | `setProductStatus` | A | 🔐 | `id`, `status` | ACTIVE cần: ≥ 1 ảnh, ≥ 1 lựa chọn bật, giá > 0; thiếu → `PRODUCT_NOT_READY` |
| 12 | `setProductAvailability` | A | 🔐 | `id`, `isAvailable` | **Công tắc “Tạm hết hôm nay”**, bấm 1 chạm trên điện thoại. Làm mới tag `products`, `product:<id>` |
| 13 | `reorderProducts` | A | 🔐 | `categoryId`, `[{ id, sortOrder }]` | |
| 14 | `saveProductImages` / `updateProductImages` | A | 🔐 | Như bản cũ (bỏ `variantId`) | |

**Việc tự động trong `product.service`** sau mỗi thay đổi: `recalculatePriceFrom(productId)` (lựa chọn đang bật), làm mới cache tag.

**Đã bỏ:** `generateSku`, `rebuildSearchText`, `searchSuggestions`, lọc màu/giá, phân trang khách.

> P1 (tùy chọn): tác vụ 5:00 sáng mỗi ngày tự bật lại `isAvailable = true` cho mọi món (`/api/cron/reset-availability`). Mặc định **tắt**, bật bằng `config/ordering.ts → AUTO_RESET_AVAILABILITY`.

---

## 5. `media`

| # | Tên | Loại | Quyền | Ghi chú |
|---|---|---|---|---|
| 1 | `getImageUploadSignature` | A | 🔐 | `folder`: `products` · `categories` · `site`. Thư mục `thanhlong/<folder>`; jpg/png/webp ≤ 5 MB |

`deleteImage(publicId)` và `isShopPublicId(publicId, folder)` giữ như bản cũ, đổi tiền tố thư mục.

---

## 6. `order-request` (yêu cầu đặt món)

### 6.1 Phía khách
| # | Tên | Loại | Quyền | Input | Output / Ghi chú |
|---|---|---|---|---|---|
| 1 | `createOrderRequest` | A | 🌐 | Xem 6.3 | `{ code }` → chuyển tới `/dat-mon/da-gui` |
| 2 | `getRequestConfirmation` | Q | 🌐 | `code` + cookie ký | Dữ liệu trang “đã gửi”: mã, món, cách nhận, giờ nhận, tạm tính, SĐT đã che. Cookie `thanhlong_request` (HMAC bằng `AUTH_SECRET`, hạn 2 giờ). Không có cookie → trang chỉ hiện lời cảm ơn chung |

Không có tra cứu yêu cầu công khai (khách được gọi lại).

### 6.2 Phía admin
| # | Tên | Loại | Quyền | Input | Ghi chú |
|---|---|---|---|---|---|
| 3 | `adminListOrderRequests` | Q | 🔐 | `status?`, `q?` (mã / SĐT / tên), `date?`, `page` | Kèm số lượng theo trạng thái; đánh dấu yêu cầu chưa gửi Telegram |
| 4 | `adminGetOrderRequest` | Q | 🔐 | `id` | Đầy đủ + lịch sử |
| 5 | `updateOrderRequestStatus` | A | 🔐 | `id`, `toStatus`, `note?`, `cancelReason?` | Theo luồng `02` mục 2. Ghi `*At`, lịch sử (`source = ADMIN`). Hủy bắt buộc lý do |
| 6 | `updateOrderRequestNote` | A | 🔐 | `id`, `adminNote` | |
| 7 | `resendOrderRequestTelegram` | A | 🔐 | `id` | Gửi lại tin Telegram thủ công |

### 6.3 Chi tiết `createOrderRequest`

**Input**
```ts
{
  items: { optionId: string; quantity: number }[];   // 1–20 dòng, quantity 1–50
  customer: { name: string; phone: string };
  receiveMethod: 'PICKUP' | 'DELIVERY';
  deliveryAddress?: string;                           // bắt buộc nếu DELIVERY, ≤ 200 ký tự
  desiredTime?: string;                               // ISO; null = sớm nhất
  customerNote?: string;                              // ≤ 500 ký tự
  acceptPrivacy: true;
  website?: string;                                   // trường bẫy bot, phải rỗng
  startedAt: number;                                  // thời điểm mở form (ms), chống bot gửi quá nhanh
}
```

**Các bước (trong `order-request.service.createOrderRequest`)**
1. Validate Zod. `website` khác rỗng **hoặc** gửi trong < 3 giây kể từ `startedAt` → trả thành công giả, không lưu, không gửi Telegram.
2. Chống spam: `checkRateLimit('order-request:<ipHash>', 3 lần / 10 phút)` → `TOO_MANY_REQUESTS`. Thêm: cùng SĐT tối đa 5 yêu cầu / ngày.
3. Chuẩn hóa SĐT (`lib/phone.ts`). Kiểm tra `desiredTime`: trong tương lai, ≤ 7 ngày, nằm trong giờ mở cửa (`config/site.ts → OPENING_HOURS`) → sai thì `INVALID_TIME`.
4. Gộp các dòng trùng `optionId`. Đọc option + món từ DB: món `ACTIVE`, option bật, **món `isAvailable`**. Sai → `ITEM_UNAVAILABLE` kèm danh sách dòng (`fieldErrors` theo `optionId`).
5. Tính `lineTotal`, `estimatedTotal`, `itemCount` từ giá DB.
6. Sinh `code` duy nhất (thử lại nếu trùng). Tạo `OrderRequest` + `OrderRequestItem` (chụp tên món, tên lựa chọn, giá) + lịch sử đầu tiên, trong **một transaction**.
7. Sau transaction (lỗi ở đây **không** làm hỏng yêu cầu): gọi `notifyNewOrderRequest` → thành công thì ghi `telegramSentAt` và thử gửi tối đa 3 bản ghi còn tồn (`07` mục 5); đặt cookie xác nhận.

**Mã lỗi:** `VALIDATION_ERROR` · `TOO_MANY_REQUESTS` · `ITEM_UNAVAILABLE` · `INVALID_TIME` · `INTERNAL_ERROR`

> Ngoài giờ mở cửa vẫn nhận yêu cầu “sớm nhất”; trang “đã gửi” và tin Telegram ghi rõ “gửi ngoài giờ”.

---

## 7. `contact`

| # | Tên | Loại | Quyền | Input | Ghi chú |
|---|---|---|---|---|---|
| 1 | `sendContactMessage` | A | 🌐 | `name`, `phone`, `message` (10–1000), `acceptPrivacy`, `website?`, `startedAt` | Bẫy bot + giới hạn 3 lần / 10 phút / IP. Lưu DB trước, gửi Telegram sau |
| 2 | `adminListContactMessages` | Q | 🔐 | `status?`, `page` | |
| 3 | `markContactHandled` | A | 🔐 | `id` | |
| 4 | `resendContactTelegram` | A | 🔐 | `id` | |

---

## 8. `notification` (nội bộ)

| Tên | Gọi khi | Nội dung |
|---|---|---|
| `notifyNewOrderRequest(request)` | Sau khi lưu yêu cầu | Mẫu ở `07` mục 4.1 |
| `notifyContactMessage(message)` | Sau khi lưu tin liên hệ | Mẫu ở `07` mục 4.2 |
| `notifyAdminLogin({ time, ipHash })` | Admin đăng nhập thành công | Giữ như bản cũ |

Tất cả qua `lib/telegram.ts`: timeout 5 giây, escape HTML, chỉ gửi khi `TELEGRAM_ENABLED=true`. Trả `{ ok, messageId? }`; **không throw**.

---

## 9. `dashboard`

| # | Tên | Loại | Quyền | Output |
|---|---|---|---|---|
| 1 | `getAdminSummary` | Q | 🔐 | Số yêu cầu `NEW`, số yêu cầu hôm nay / 7 ngày, số tin liên hệ chưa xử lý, số yêu cầu **chưa gửi được Telegram**, danh sách món đang “Tạm hết”, 5 món được đặt nhiều nhất 7 ngày (theo `OrderRequestItem`, bỏ yêu cầu `CANCELLED`) |

---

## 10. Route handler

| Đường dẫn | Mục đích | Ưu tiên |
|---|---|---|
| `/api/health` | `{ ok: true }` + kiểm tra DB | P0 |
| `POST /api/cron/cleanup` | Dọn `RateLimitHit` > 1 ngày, xóa `ipHash` > 90 ngày | P0 |
| `POST /api/cron/telegram-retry` | Gửi lại yêu cầu/tin liên hệ có `telegramSentAt = null` tạo trong 24 giờ qua (tối đa 3 lần/bản ghi). Gọi mỗi 30 phút bởi `monitor.yml` (`07` mục 5) | P0 |
| `POST /api/cron/reset-availability` | Bật lại mọi món “Tạm hết” lúc 5:00 | P1, tùy chọn |
| `POST /api/telegram/webhook` | Nhận bấm nút trên tin Telegram (`07` mục 6). Kiểm tra header `X-Telegram-Bot-Api-Secret-Token` = `TELEGRAM_WEBHOOK_SECRET` và `chat.id` = `TELEGRAM_CHAT_ID` | P1 |
| `/sitemap.xml`, `/robots.txt` | | P0 |

Route `/api/cron/*` yêu cầu `Authorization: Bearer <CRON_SECRET>`.

---

## 11. Mã lỗi dùng chung

| Mã | Khi nào | Thông báo cho người dùng |
|---|---|---|
| `VALIDATION_ERROR` | Input sai | Lỗi theo từng trường |
| `UNAUTHORIZED` | Chưa đăng nhập admin | Chuyển tới đăng nhập |
| `PASSWORD_CHANGE_REQUIRED` | Chưa đổi mật khẩu ban đầu | Chuyển tới đổi mật khẩu |
| `NOT_FOUND` | | “Không tìm thấy …” |
| `CONFLICT` | Trùng slug, trùng tên lựa chọn | “… đã tồn tại” |
| `INVALID_STATUS_TRANSITION` | | “Không thể chuyển từ A sang B” |
| `PRODUCT_NOT_READY` | Đăng bán thiếu ảnh/giá | Liệt kê phần thiếu |
| `CATEGORY_NOT_EMPTY` | | “Danh mục còn N món” |
| `ITEM_UNAVAILABLE` | Món tạm hết / ngừng bán | “Món X vừa tạm hết, bạn bỏ ra hoặc chọn món khác nhé” |
| `INVALID_TIME` | Giờ hẹn ngoài giờ mở cửa | “Tiệm mở 6:00–21:00, bạn chọn giờ khác giúp tiệm” |
| `TOO_MANY_REQUESTS` / `RATE_LIMITED` | Gửi quá nhiều | “Bạn đợi ít phút rồi gửi lại, hoặc gọi thẳng cho tiệm” |
| `INTERNAL_ERROR` | | “Có trục trặc, bạn gọi {SĐT} giúp tiệm nhé” |

---

## 12. Kế hoạch triển khai backend

Code nền đã có từ Lamora. Thứ tự chuyển đổi chi tiết ở **`12-KE-HOACH-CHUYEN-DOI.md`**. Tóm tắt các bước backend:

| Bước | Việc | Kiểm tra |
|---|---|---|
| K1 | Schema mới theo `02`, migration khởi tạo sạch trên DB mới, seed mới | Prisma Studio thấy dữ liệu mẫu |
| K2 | `product`: variant → option, `setProductAvailability`, `getMenu`, `getOrderableOptions` + test | `pnpm test` |
| K3 | `category`: bỏ cấp con, SEO | |
| K4 | `lib/phone.ts`, `config/ordering.ts`, `config/site.ts` (giờ mở cửa) + hàm `isWithinOpeningHours` + test | |
| K5 | `order-request`: `createOrderRequest` đủ 6.3 + test (hợp lệ, món tạm hết, giờ sai, spam, bẫy bot, gộp dòng trùng) | |
| K6 | `notification`: mẫu tin mới + test escape; `telegram-retry` | |
| K7 | Admin: list/get/đổi trạng thái/ghi chú yêu cầu + test luồng trạng thái | |
| K8 | `contact` | |
| K9 | `dashboard`, `/api/health`, cron | |

---

## 13. Cần xác nhận
1. Giới hạn chống spam: 3 yêu cầu / 10 phút / IP và 5 yêu cầu / ngày / SĐT có hợp lý? (Văn phòng đặt chung một mạng có thể cần nới.)
2. Có bật tự động mở lại món “Tạm hết” lúc 5:00 sáng không? Mặc định: **không**.

---

## Nhật ký thay đổi

| Phiên bản | Ngày | Thay đổi |
|---|---|---|
| v2.0 | 2026-10-07 | Chuyển sang Bánh Mì Thanh Long: bỏ `collection`, `cart`, `shipping`, `order`, `payment`; thêm `order-request`, `contact`, `setProductAvailability`, `getMenu`, `getOrderableOptions`, cron `telegram-retry`, webhook Telegram (P1) |
| v1.2 | 2026-10-05 | (Lamora) Better Auth, `media`, `queries.ts` |
