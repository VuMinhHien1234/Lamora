# 01 — TECH STANDARDS: Chuẩn kỹ thuật & ràng buộc clean code

> Dựa trên `00-MASTER-PLAN.md` v0.2 · Phiên bản file này: v1.2 · 2026-10-05
>
> **Đối tượng đọc:** chủ shop (người review) và AI (người viết code). Mọi đoạn code trong dự án phải tuân theo file này. Khi có xung đột giữa file này và một yêu cầu tức thời, **hỏi lại trước khi làm**, không tự ý phá quy tắc.
>
> Từ khóa: **PHẢI** = bắt buộc · **KHÔNG ĐƯỢC** = cấm · **NÊN** = mặc định, được lệch nếu có lý do ghi rõ.

---

## 1. Mục tiêu

1. **Một người quản lý được:** đọc thư mục là hiểu chức năng nằm ở đâu.
2. **AI sinh code nhất quán:** mỗi loại code có đúng một chỗ đặt và một cách viết.
3. **Thay đổi an toàn:** có kiểm tra tự động (type, lint, test) trước khi lên production.
4. **Chi phí ~0đ:** chỉ dùng dịch vụ có gói miễn phí cho phép dùng thương mại.

---

## 2. Stack công nghệ

| Lớp | Công nghệ | Ghi chú |
|---|---|---|
| Runtime | Node.js bản LTS | Ghi phiên bản trong `.nvmrc` và `package.json#engines` |
| Package manager | pnpm | Chỉ dùng pnpm, commit `pnpm-lock.yaml` |
| Framework | Next.js (App Router) | Web khách + trang quản trị + API trong một dự án |
| Ngôn ngữ | TypeScript, chế độ `strict` | |
| Giao diện | Tailwind CSS + shadcn/ui | Component shadcn được copy vào `src/components/ui` |
| Form | React Hook Form + Zod | |
| Validation | Zod | Dùng chung schema cho form và server |
| ORM | Prisma | |
| Database | PostgreSQL trên Neon (Free) | Chọn region Singapore cho gần Việt Nam |
| Đăng nhập admin | Better Auth, đăng nhập email + mật khẩu, adapter Prisma | Tắt đăng ký công khai. Một tài khoản admin tạo bằng seed |
| Lưu ảnh | Cloudinary (Free) | Upload từ trang quản trị, lưu `publicId` trong DB |
| Thông báo | Telegram Bot API | Báo đơn mới cho chủ shop |
| Unit test | Vitest | |
| E2E test | Playwright | Ít nhất luồng đặt hàng |
| Lint / format | ESLint + Prettier | |
| Git hooks | Husky + lint-staged + commitlint | |
| CI | GitHub Actions | |
| Hosting | Netlify (Free) | Có deploy preview cho mỗi Pull Request |

**Lưu ý chi phí:**
- KHÔNG dùng gói Hobby của Vercel: gói này chỉ dành cho mục đích cá nhân, phi thương mại.
- Gói Free của Neon: 1 GB lưu trữ mỗi project, compute tự tắt sau 5 phút không dùng. Hệ quả: lượt truy cập đầu tiên sau khi tắt sẽ chậm hơn vài giây. Chấp nhận được ở giai đoạn đầu.
- Giới hạn gói miễn phí có thể thay đổi. Kiểm tra lại khi đăng ký và ghi vào `09-DEPLOYMENT.md`.

**Phiên bản thư viện:** dùng bản ổn định mới nhất tại lúc khởi tạo, ghi cố định trong `package.json`. Nâng cấp phiên bản lớn (major) là một thay đổi riêng, có commit riêng.

**Lưu ý thay đổi lớn ở các phiên bản gần đây** (kiểm tra lại với tài liệu chính thức khi khởi tạo):
| Thư viện | Điểm cần biết |
|---|---|
| Next.js 16+ | `middleware.ts` đổi tên thành `proxy.ts`. API làm mới cache thay đổi (`revalidateTag` cần thêm tham số; có `updateTag` dùng trong Server Action) |
| Prisma 7+ | URL kết nối khai báo trong `prisma.config.ts`, không còn trong `schema.prisma`; generator mới yêu cầu khai báo `output` |
| Auth.js | Đã chuyển sang do đội Better Auth quản lý; dự án mới dùng **Better Auth** |
| Tailwind CSS 4+ | Token khai báo bằng `@theme` trong CSS (`03` mục 2.3) |

Khi tài liệu dự án mâu thuẫn với tài liệu chính thức của phiên bản đang cài: **làm theo tài liệu chính thức**, rồi cập nhật file docs tương ứng.

---

## 3. Kiến trúc tổng thể

```
Trình duyệt
   │
   ▼
src/app/            ← Định tuyến: trang, layout, server action, route handler
   │                  (mỏng: nhận input → gọi feature → trả kết quả)
   ▼
src/features/*/     ← Nghiệp vụ, chia theo chức năng (product, order, ...)
   │   actions.ts    → validate input bằng Zod, gọi service, làm mới cache
   │   queries.ts    → hàm đọc cho Server Component: kiểm tra quyền, gọi service, gắn cache tag
   │   service.ts    → logic nghiệp vụ thuần, không biết gì về Next.js
   │   repository.ts → nơi DUY NHẤT gọi Prisma
   ▼
src/lib/            ← Hạ tầng dùng chung: db client, env, logger, lỗi, tiền tệ
   ▼
PostgreSQL (Neon) · Cloudinary · Telegram
```

### Quy tắc phụ thuộc (bắt buộc)

| Từ | Được import | KHÔNG ĐƯỢC import |
|---|---|---|
| `app/` | `features/*` (qua `index.ts`), `components/`, `lib/`, `config/` | Prisma trực tiếp, `repository.ts` |
| `features/X/components` | `features/X/*`, `components/`, `lib/` | `repository.ts`, `service.ts` (trừ server component), Prisma |
| `features/X/actions.ts` | `service.ts`, `schema.ts` của X, `lib/` | Prisma, `repository.ts` |
| `features/X/queries.ts` | `service.ts` của X, `lib/` | Prisma, `repository.ts`, `next/navigation` (trừ `notFound`) |
| `features/X/service.ts` | `repository.ts` của X, `index.ts` của feature khác, `lib/` | `next/*`, React, Prisma |
| `features/X/repository.ts` | `lib/db.ts`, Prisma types | Feature khác |
| `lib/` | Thư viện ngoài | `features/`, `app/` |
| `components/ui` | `lib/utils` | `features/` |

- Feature khác chỉ được dùng **API công khai** qua `features/X/index.ts`. KHÔNG ĐƯỢC import sâu kiểu `features/order/service`.
- KHÔNG ĐƯỢC có vòng lặp phụ thuộc giữa các feature. Nếu hai feature cần nhau, tách phần chung ra.
- Quy tắc này được kiểm tra tự động bằng ESLint (`no-restricted-imports` hoặc `eslint-plugin-boundaries`).

### Khi nào dùng gì để giao tiếp với server

| Trường hợp | Dùng |
|---|---|
| Đọc dữ liệu để hiển thị trang | Server Component gọi hàm trong `features/X/queries.ts` (qua `index.ts`) |
| Form, nút bấm thay đổi dữ liệu | Server Action trong `features/X/actions.ts` |
| Bên ngoài gọi vào (webhook, cron) | Route Handler trong `src/app/api/` |

KHÔNG ĐƯỢC tạo API route chỉ để chính frontend của dự án gọi, trừ khi Server Action không làm được.

---

## 4. Cấu trúc thư mục

```
lamora-flower/
├── AGENTS.md                  # Quy tắc cho AI, AI đọc file này đầu tiên
├── CLAUDE.md                  # Trỏ tới AGENTS.md (cho Claude Code)
├── README.md                  # Cách cài đặt, chạy, deploy
├── docs/                      # Toàn bộ file 00–10
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── prisma.config.ts           # Cấu hình kết nối DB (Prisma 7+)
├── public/                    # favicon, ảnh tĩnh nhỏ
├── src/
│   ├── app/
│   │   ├── (shop)/                          # Web khách (05)
│   │   │   ├── page.tsx                     # Trang chủ
│   │   │   ├── san-pham/page.tsx            # Tất cả sản phẩm
│   │   │   ├── san-pham/[slug]/page.tsx     # Chi tiết
│   │   │   ├── danh-muc/[slug]/page.tsx
│   │   │   ├── bo-suu-tap/[slug]/page.tsx
│   │   │   ├── tim-kiem/page.tsx
│   │   │   ├── gio-hang/page.tsx
│   │   │   ├── thanh-toan/page.tsx
│   │   │   ├── dat-hang-thanh-cong/page.tsx
│   │   │   ├── tra-cuu-don/page.tsx
│   │   │   └── [trang-tinh]/page.tsx        # 5 trang tĩnh đọc từ src/content
│   │   ├── admin/                           # Trang quản trị (06)
│   │   │   ├── login/page.tsx
│   │   │   ├── page.tsx                     # Tổng quan
│   │   │   ├── don-hang/...
│   │   │   ├── san-pham/...
│   │   │   ├── danh-muc/page.tsx
│   │   │   ├── bo-suu-tap/...
│   │   │   ├── tai-khoan/page.tsx
│   │   │   └── ui-kit/page.tsx              # Duyệt component (03 mục 12)
│   │   ├── api/
│   │   │   ├── auth/[...all]/route.ts       # Better Auth
│   │   │   ├── health/route.ts
│   │   │   └── cron/...                     # Tác vụ định kỳ (09 mục 7)
│   │   ├── layout.tsx
│   │   ├── globals.css                      # Design token (03 mục 2)
│   │   ├── sitemap.ts
│   │   └── robots.ts
│   ├── features/
│   │   ├── product/
│   │   │   ├── components/    # Component chỉ dùng cho sản phẩm
│   │   │   ├── actions.ts     # Server Action (thay đổi dữ liệu)
│   │   │   ├── queries.ts     # Hàm đọc cho Server Component
│   │   │   ├── service.ts     # Logic nghiệp vụ thuần
│   │   │   ├── repository.ts  # Nơi duy nhất gọi Prisma
│   │   │   ├── schema.ts      # Zod schema
│   │   │   ├── types.ts
│   │   │   ├── index.ts       # API công khai
│   │   │   └── service.test.ts
│   │   ├── category/
│   │   ├── collection/
│   │   ├── media/             # Chữ ký upload Cloudinary, dùng chung
│   │   ├── cart/
│   │   ├── shipping/
│   │   ├── order/
│   │   ├── payment/
│   │   ├── notification/
│   │   ├── dashboard/
│   │   └── auth/
│   ├── components/
│   │   ├── ui/                # Component cơ bản theo 03 mục 7
│   │   └── layout/            # Header, Footer, AdminSidebar
│   ├── content/               # Nội dung trang tĩnh (Markdown)
│   ├── lib/
│   │   ├── db.ts              # Prisma client singleton
│   │   ├── auth.ts            # Cấu hình Better Auth
│   │   ├── env.ts             # Đọc + validate biến môi trường
│   │   ├── errors.ts          # AppError, mã lỗi
│   │   ├── result.ts          # Kiểu ActionResult
│   │   ├── money.ts           # Định dạng VND
│   │   ├── slug.ts            # Bỏ dấu tiếng Việt, tạo slug
│   │   ├── rate-limit.ts      # Giới hạn tần suất (lưu trong DB)
│   │   ├── logger.ts
│   │   └── utils.ts
│   ├── config/
│   │   ├── site.ts            # Tên shop, liên hệ, mạng xã hội, banner P0
│   │   ├── shipping.ts        # Phí ship, vùng, đơn vị vận chuyển, ngưỡng tồn kho thấp
│   │   └── address/           # Dữ liệu tỉnh → phường/xã (JSON)
│   └── proxy.ts               # Chặn /admin khi chưa đăng nhập (Next.js 16+; bản cũ là middleware.ts)
├── tests/
│   └── e2e/                   # Playwright
├── .env.example
├── .nvmrc
├── netlify.toml
└── .github/                   # workflows, dependabot (09 mục 9)
```

**Quy tắc đặt file**
- Code dùng cho **một** feature → nằm trong feature đó.
- Code dùng cho **từ hai** feature trở lên → chuyển lên `components/` hoặc `lib/`.
- KHÔNG ĐƯỢC tạo thư mục kiểu `helpers/`, `misc/`, `common/` chứa đủ thứ.
- Đường dẫn URL web khách dùng tiếng Việt không dấu (tốt cho SEO). Tên file code, biến, hàm dùng tiếng Anh.

---

## 5. Quy ước đặt tên

| Loại | Quy ước | Ví dụ |
|---|---|---|
| Thư mục, file thường | kebab-case | `order-status-badge.tsx` |
| React component | PascalCase | `OrderStatusBadge` |
| Hàm, biến | camelCase, bắt đầu bằng động từ với hàm | `createOrder`, `calculateShippingFee` |
| Hằng số | UPPER_SNAKE_CASE | `FREE_SHIPPING_THRESHOLD` |
| Type / interface | PascalCase, không tiền tố `I` | `OrderSummary` |
| Zod schema | camelCase + `Schema` | `createOrderSchema` |
| Kiểu suy ra từ schema | PascalCase + `Input` | `CreateOrderInput` |
| Boolean | `is` / `has` / `can` | `isPublished`, `hasStock` |
| Bảng Prisma | PascalCase số ít; cột camelCase | `model OrderItem { unitPrice Int }` |
| Enum | PascalCase; giá trị UPPER_SNAKE | `OrderStatus.PENDING` |
| Biến môi trường | UPPER_SNAKE_CASE | `DATABASE_URL` |

Text hiển thị cho khách là tiếng Việt. Comment trong code NÊN viết tiếng Việt cho chủ shop dễ đọc. Tên trong code luôn là tiếng Anh.

---

## 6. Quy tắc TypeScript

- `strict: true`, `noUncheckedIndexedAccess: true`.
- KHÔNG ĐƯỢC dùng `any`. Dữ liệu chưa rõ kiểu dùng `unknown` rồi kiểm tra bằng Zod.
- KHÔNG ĐƯỢC dùng `@ts-ignore`. Nếu bất khả kháng dùng `@ts-expect-error` kèm lý do.
- KHÔNG ĐƯỢC dùng `!` (non-null assertion) để né lỗi.
- Hàm được export PHẢI khai báo kiểu trả về.
- Dùng import alias `@/` thay cho `../../..`.
- Ưu tiên `type` hơn `interface`, trừ khi cần mở rộng.

---

## 7. Quy tắc nghiệp vụ dữ liệu (bắt buộc với shop)

| Vấn đề | Quy tắc |
|---|---|
| Tiền | Lưu **số nguyên VND** (`Int`). KHÔNG ĐƯỢC dùng số thực. Chỉ định dạng hiển thị qua `lib/money.ts` |
| Giá trong đơn | Chụp lại giá, tên, biến thể vào `OrderItem` lúc đặt. Đơn cũ KHÔNG ĐƯỢC thay đổi khi sửa sản phẩm |
| Tính tổng tiền | Luôn tính lại ở server. KHÔNG ĐƯỢC tin giá gửi từ trình duyệt |
| Mã đơn | Dạng `LMR-YYMMDD-XXXX`, dễ đọc, dùng làm nội dung chuyển khoản |
| Thời gian | Lưu UTC; hiển thị theo giờ `Asia/Ho_Chi_Minh` |
| Xóa sản phẩm | Xóa mềm bằng `archivedAt`, không xóa thật vì đơn cũ còn tham chiếu |
| Tồn kho | Trừ kho trong cùng transaction với tạo đơn |
| Trạng thái đơn | Chỉ chuyển trạng thái qua một hàm duy nhất kiểm tra bước chuyển hợp lệ |
| Slug | Sinh từ tên, bỏ dấu tiếng Việt, duy nhất |
| Ảnh | DB chỉ lưu `publicId` của Cloudinary, URL sinh khi hiển thị |

---

## 8. Validation, lỗi và kết quả trả về

### 8.1 Validation
- Mọi input từ người dùng (form, query string, params, webhook) PHẢI được validate bằng Zod **ở server**, kể cả khi đã validate ở form.
- Schema đặt trong `features/X/schema.ts`, dùng chung cho form và action.

### 8.2 Kết quả của Server Action
Mọi server action trả về cùng một kiểu, khai báo trong `lib/result.ts`:

```ts
export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: { code: string; message: string; fieldErrors?: Record<string, string[]> } };
```

KHÔNG ĐƯỢC throw lỗi ra ngoài server action cho lỗi nghiệp vụ dự đoán được (hết hàng, sai mã giảm giá…).

### 8.3 Lỗi
- Lỗi nghiệp vụ dùng class `AppError` với mã lỗi cố định (ví dụ `OUT_OF_STOCK`, `INVALID_STATUS_TRANSITION`).
- Thông báo cho khách: tiếng Việt, dễ hiểu, không lộ chi tiết kỹ thuật.
- Lỗi không mong muốn: ghi log đầy đủ ở server, trả về thông báo chung.
- Có `error.tsx` và `not-found.tsx` cho cả khu vực shop và admin.

---

## 9. Quy tắc viết code sạch

### 9.1 Giới hạn kích thước (cảnh báo bằng ESLint)
| Mục | Giới hạn |
|---|---|
| Một file | ≤ 250 dòng |
| Một hàm / component | ≤ 50 dòng |
| Tham số của hàm | ≤ 3; nhiều hơn thì gom thành object |
| Độ sâu lồng `if/for` | ≤ 3 |

### 9.2 Nguyên tắc
- Một hàm làm một việc. Tên hàm nói rõ việc đó.
- Return sớm thay vì `if/else` lồng nhau.
- KHÔNG ĐƯỢC có số hoặc chuỗi “thần kỳ”: đưa vào hằng số hoặc `config/`.
- KHÔNG ĐƯỢC lặp code nghiệp vụ. Lặp UI ở hai chỗ thì chấp nhận, đến chỗ thứ ba thì tách component.
- KHÔNG ĐƯỢC để code chết, code bị comment, `console.log` khi commit. Dùng `lib/logger.ts`.
- Comment giải thích **vì sao**, không giải thích code đang làm gì.
- `TODO` phải kèm mô tả: `// TODO(p1): thêm mã giảm giá vào tính tổng`.

### 9.3 React / Next.js
- Mặc định là **Server Component**. Chỉ thêm `"use client"` khi cần state, sự kiện hoặc API trình duyệt, và đặt ở component lá nhỏ nhất có thể.
- KHÔNG ĐƯỢC gọi database từ Client Component.
- Ảnh dùng `next/image` (hoặc component Cloudinary), luôn có `alt` tiếng Việt và kích thước.
- Mỗi trang shop PHẢI có `generateMetadata` (title, description, ảnh chia sẻ).
- Sau khi thay đổi dữ liệu, làm mới cache theo tag trong action (dùng đúng API của phiên bản Next.js đang cài). Tên tag thống nhất: `products`, `product:<id>`, `categories`, `collections`, `orders`.
- Giỏ hàng lưu ở trình duyệt; khi thanh toán gửi lên danh sách `variantId` + số lượng, server tự lấy giá.

### 9.4 Giao diện
- Chỉ dùng màu, font, khoảng cách từ design token (Tailwind config). KHÔNG ĐƯỢC viết mã màu trực tiếp trong component.
- Mọi component PHẢI hiển thị đúng ở chiều rộng 360px.
- Nút, input có trạng thái loading, disabled, lỗi.
- Đạt tiêu chuẩn truy cập cơ bản: có label cho input, độ tương phản đủ, dùng được bằng bàn phím.

---

## 10. Bảo mật tối thiểu

- Mọi route dưới `/admin` và mọi action quản trị PHẢI kiểm tra phiên đăng nhập **ở server**. `proxy.ts` không đủ, action và query phải tự kiểm tra lại.
- Mật khẩu admin băm bằng thuật toán mặc định của Better Auth; không tự viết hàm băm.
- Form đặt hàng: giới hạn số lần gửi theo IP và có trường ẩn chống bot.
- Upload ảnh: chỉ admin, giới hạn định dạng và dung lượng.
- KHÔNG ĐƯỢC commit file `.env`. Chỉ commit `.env.example` không chứa giá trị thật.
- Biến môi trường được validate bằng Zod trong `lib/env.ts`; thiếu biến thì ứng dụng dừng ngay khi khởi động.
- Biến dùng ở trình duyệt mới có tiền tố `NEXT_PUBLIC_`. Khóa bí mật KHÔNG ĐƯỢC có tiền tố này.
- Tra cứu đơn yêu cầu cả mã đơn **và** số điện thoại.

Chi tiết sẽ nằm ở `08-SECURITY-SEO.md`.

---

## 11. Kiểm thử

| Loại | Công cụ | Phạm vi bắt buộc |
|---|---|---|
| Unit | Vitest | Mọi hàm trong `service.ts` có logic tính toán: tổng tiền, phí ship, chuyển trạng thái đơn, trừ kho, tạo mã đơn, tạo slug |
| E2E | Playwright | Luồng: xem sản phẩm → thêm giỏ → đặt hàng COD → tra cứu đơn; admin đăng nhập → đổi trạng thái đơn |
| Thủ công | Checklist file 10 | Trước mỗi lần phát hành |

- File test đặt cạnh file được test: `service.ts` → `service.test.ts`.
- Test không gọi database thật: mock `repository`.
- Sửa lỗi nào thì thêm test tái hiện lỗi đó.

---

## 12. Git, commit và phát hành

### 12.1 Nhánh
- `main`: luôn chạy được, tự động deploy **production**. Chỉ nhận gộp từ `develop` (khoảng 1–2 lần/tuần) hoặc sửa lỗi khẩn (`hotfix/...`), để giữ số lần deploy production trong giới hạn credits Netlify (`09` mục 2.1).
- `develop`: nhánh tích hợp hằng ngày, có bản xem trước riêng trên Netlify.
- Mỗi việc một nhánh tách từ `develop`: `feat/product-filter`, `fix/shipping-fee-hanoi`, `chore/upgrade-next`.
- Gộp vào `develop` qua Pull Request, CI phải xanh. Netlify tạo deploy preview cho mỗi PR để xem trước.

### 12.2 Commit (Conventional Commits, kiểm tra bằng commitlint)
```
<loại>(<phạm vi>): <mô tả ngắn>

feat(order): thêm tra cứu đơn theo số điện thoại
fix(shipping): sai phí ship khi đơn đủ mức miễn phí
refactor(product): tách repository khỏi service
docs: cập nhật 02-DATABASE
chore(deps): nâng cấp prisma
```
Loại hợp lệ: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `style`, `perf`.

### 12.3 Kiểm tra tự động
| Thời điểm | Chạy |
|---|---|
| Trước commit (Husky + lint-staged) | Prettier, ESLint trên file đã đổi |
| Khi đặt tên commit | commitlint |
| Mỗi Pull Request (GitHub Actions) | `pnpm lint` · `pnpm typecheck` · `pnpm test` · `pnpm build` |
| Trước phát hành | Playwright E2E |

### 12.4 Database migration
- Mọi thay đổi schema qua `prisma migrate dev`, commit cả thư mục migration.
- KHÔNG ĐƯỢC sửa migration đã chạy trên production. Cần đổi thì tạo migration mới.
- Production chạy `prisma migrate deploy` trong bước build/deploy.
- Đổi tên hoặc xóa cột phải làm qua nhiều bước để không mất dữ liệu.

### 12.5 Phiên bản
Gắn tag theo SemVer khi phát hành: `v0.1.0` (MVP), `v0.2.0` (P1)… Ghi thay đổi vào `CHANGELOG.md`.

---

## 13. Quy tắc dành cho AI viết code (`AGENTS.md`)

> Bản đầy đủ và **có hiệu lực** là file `AGENTS.md` ở thư mục gốc dự án. Khối dưới đây chỉ là tóm tắt; nếu khác nhau, theo `AGENTS.md`.

```markdown
# AGENTS.md — Lamora Flower

## Trước khi viết code
1. Đọc docs/01-TECH-STANDARDS.md và file docs liên quan đến việc đang làm.
2. Xem code hiện có của feature đó và làm theo đúng mẫu đang dùng.
3. Nếu yêu cầu mâu thuẫn với docs hoặc thiếu thông tin ảnh hưởng đến dữ liệu, tiền, bảo mật: HỎI LẠI, không đoán.

## Khi viết code
- Mỗi lần chỉ làm một việc nhỏ (một tính năng hoặc một lỗi).
- Đặt code đúng thư mục và đúng lớp: app → actions → service → repository.
- Chỉ repository được gọi Prisma.
- Validate mọi input bằng Zod ở server.
- Tiền là số nguyên VND. Tính tổng tiền ở server.
- Không dùng any, @ts-ignore, console.log.
- Không thêm thư viện mới nếu chưa được đồng ý. Nếu được đồng ý, cập nhật bảng stack trong docs/01.
- Không sửa migration cũ. Không xóa test để làm CI xanh.
- Không đổi tên/di chuyển file ngoài phạm vi việc đang làm.

## Sau khi viết code
- Chạy: pnpm lint && pnpm typecheck && pnpm test. Sửa đến khi qua hết.
- Thêm/cập nhật test cho logic trong service.
- Cập nhật docs nếu thay đổi schema, luồng nghiệp vụ hoặc cấu trúc.
- Tóm tắt cho chủ shop: đã đổi file nào, vì sao, cách tự kiểm tra trên trình duyệt.
- Đề xuất commit message theo Conventional Commits.
```

**Cách giao việc cho AI hiệu quả (dành cho chủ shop):**
- Giao từng việc nhỏ, ví dụ “Làm trang danh sách sản phẩm có lọc theo danh mục theo `05-SHOP-PAGES.md` mục 2”, thay vì “làm web khách”.
- Sau mỗi việc: chạy thử, commit, rồi mới giao việc tiếp theo.
- Nếu AI đề xuất phá quy tắc trong file này, yêu cầu giải thích; đồng ý thì cập nhật file này trước rồi mới code.

---

## 14. Biến môi trường

Danh sách trong `.env.example` (giá trị thật nằm ở Netlify và file `.env` local):

| Biến | Dùng cho |
|---|---|
| `DATABASE_URL` | Kết nối Neon (bản pooled) |
| `DIRECT_URL` | Kết nối trực tiếp cho Prisma migrate |
| `AUTH_SECRET` | Ký phiên đăng nhập |
| `ADMIN_EMAIL`, `ADMIN_INITIAL_PASSWORD` | Chỉ dùng khi seed tài khoản admin |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Upload ảnh |
| `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` | Báo đơn mới |
| `BANK_BIN`, `BANK_ACCOUNT_NO`, `BANK_ACCOUNT_NAME` | Sinh mã VietQR |
| `NEXT_PUBLIC_SITE_URL` | URL website, dùng cho SEO |
| `IP_HASH_SALT` | Băm IP chống spam (`08` mục 3) |
| `CRON_SECRET` | Bảo vệ route `/api/cron/*` (`09` mục 7) |
| `TELEGRAM_ENABLED` | `false` ở preview để không gửi tin thật |

Biến bí mật riêng cho GitHub Actions (sao lưu, tác vụ định kỳ): xem `09` mục 9.

---

## 15. Definition of Done — một việc được coi là xong khi

- [ ] Đúng yêu cầu trong file docs tương ứng
- [ ] Đặt đúng thư mục, đúng lớp, không vi phạm quy tắc phụ thuộc
- [ ] `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` đều qua
- [ ] Có test cho logic nghiệp vụ mới
- [ ] Hiển thị đúng trên điện thoại (360px) và máy tính
- [ ] Có trạng thái loading, lỗi, danh sách rỗng
- [ ] Không còn `console.log`, code chết, `TODO` không mô tả
- [ ] Docs đã cập nhật nếu có thay đổi schema hoặc luồng
- [ ] Commit message đúng chuẩn

---

## 16. Cần xác nhận

1. Bạn đã có tài khoản GitHub chưa? Source sẽ để ở repository **private**.
2. Bạn muốn comment trong code bằng tiếng Việt (mặc định) hay tiếng Anh?
3. Công cụ AI chính bạn sẽ dùng để viết code (Claude Code, Cursor, …)? Nếu là Claude Code, có thể đặt thêm `CLAUDE.md` trỏ đến `AGENTS.md`.

---

## Nhật ký thay đổi

| Phiên bản | Ngày | Thay đổi |
|---|---|---|
| v1.2 | 2026-10-05 | Đổi đăng nhập sang Better Auth; thêm lưu ý Next.js 16, Prisma 7; thêm lớp `queries.ts`, feature `collection`, `media`, `dashboard`; cấu trúc thư mục đầy đủ theo `05`, `06`; thêm nhánh `develop`; `AGENTS.md` thành file riêng |
| v1.1 | 2026-10-05 | Thêm `config/address`, `content/`, `lib/rate-limit.ts`; thêm biến `IP_HASH_SALT`, `CRON_SECRET`, `TELEGRAM_ENABLED` |
| v1.0 | 2026-10-05 | Bản đầu tiên |
