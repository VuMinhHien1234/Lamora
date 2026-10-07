# 01 — TECH STANDARDS: Chuẩn kỹ thuật & ràng buộc clean code

> Dựa trên `00-MASTER-PLAN.md` v1.0 · Phiên bản file này: v2.0 · 2026-10-07
>
> **Đối tượng đọc:** chủ tiệm (người review) và AI (người viết code). Mọi đoạn code trong dự án phải tuân theo file này. Khi có xung đột giữa file này và một yêu cầu tức thời, **hỏi lại trước khi làm**, không tự ý phá quy tắc.
>
> Từ khóa: **PHẢI** = bắt buộc · **KHÔNG ĐƯỢC** = cấm · **NÊN** = mặc định, được lệch nếu có lý do ghi rõ.

---

## 1. Mục tiêu

1. **Một người quản lý được:** đọc thư mục là hiểu chức năng nằm ở đâu.
2. **AI sinh code nhất quán:** mỗi loại code có đúng một chỗ đặt và một cách viết.
3. **Thay đổi an toàn:** có kiểm tra tự động (type, lint, test) trước khi lên production.
4. **Chi phí ~0đ:** chỉ dùng dịch vụ có gói miễn phí cho phép dùng thương mại.
5. **Không mất yêu cầu đặt món:** mọi yêu cầu được lưu DB trước, gửi Telegram sau.

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
| Database | PostgreSQL trên Neon (Free) | Region Singapore |
| Đăng nhập admin | Better Auth, email + mật khẩu, adapter Prisma | Tắt đăng ký công khai. Một tài khoản admin tạo bằng seed |
| Lưu ảnh | Cloudinary (Free) | Upload từ trang quản trị, lưu `publicId` trong DB |
| Thông báo | Telegram Bot API | **Kênh bán hàng chính**: báo yêu cầu đặt món và tin liên hệ |
| Unit test | Vitest | |
| E2E test | Playwright | Luồng: xem thực đơn → đặt món → admin thấy yêu cầu |
| Lint / format | ESLint + Prettier | |
| Git hooks | Husky + lint-staged + commitlint | |
| CI | GitHub Actions | |
| Hosting | Netlify (Free) | Deploy preview cho mỗi Pull Request |

**Đã bỏ so với Lamora Flower:** VietQR, dữ liệu tỉnh/xã, giỏ hàng localStorage, tính phí ship, tồn kho. KHÔNG ĐƯỢC thêm lại khi chưa sửa `00`.

**Lưu ý chi phí:**
- KHÔNG dùng gói Hobby của Vercel: gói này chỉ dành cho mục đích cá nhân, phi thương mại.
- Gói Free của Neon: 1 GB lưu trữ, compute tự tắt sau 5 phút không dùng → lượt truy cập đầu tiên sau đó chậm vài giây. Vì vậy trang khách **phải được cache** (mục 9.3), chỉ form gửi yêu cầu mới chạm DB.
- Giới hạn gói miễn phí có thể thay đổi. Kiểm tra lại khi đăng ký và ghi vào `09-DEPLOYMENT.md`.

**Phiên bản thư viện:** dùng bản ổn định mới nhất tại lúc khởi tạo, ghi cố định trong `package.json`. Nâng cấp phiên bản lớn là một thay đổi riêng, có commit riêng.

**Lưu ý thay đổi lớn ở các phiên bản gần đây** (kiểm tra lại với tài liệu chính thức):
| Thư viện | Điểm cần biết |
|---|---|
| Next.js 16+ | `middleware.ts` đổi tên thành `proxy.ts`. API làm mới cache thay đổi (`revalidateTag` cần thêm tham số; có `updateTag` dùng trong Server Action) |
| Prisma 7+ | URL kết nối khai báo trong `prisma.config.ts`; generator mới yêu cầu `output` |
| Better Auth | Thay cho Auth.js trong dự án mới |
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
src/features/*/     ← Nghiệp vụ, chia theo chức năng (product, order-request, ...)
   │   actions.ts    → validate input bằng Zod, gọi service, làm mới cache
   │   queries.ts    → hàm đọc cho Server Component: kiểm tra quyền, gọi service, gắn cache tag
   │   service.ts    → logic nghiệp vụ thuần, không biết gì về Next.js
   │   repository.ts → nơi DUY NHẤT gọi Prisma
   ▼
src/lib/            ← Hạ tầng dùng chung: db client, env, logger, lỗi, tiền tệ, telegram
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

- Feature khác chỉ được dùng **API công khai** qua `features/X/index.ts`.
- KHÔNG ĐƯỢC có vòng lặp phụ thuộc giữa các feature.
- Quy tắc kiểm tra tự động bằng ESLint (`no-restricted-imports` hoặc `eslint-plugin-boundaries`).

### Khi nào dùng gì để giao tiếp với server

| Trường hợp | Dùng |
|---|---|
| Đọc dữ liệu để hiển thị trang | Server Component gọi hàm trong `features/X/queries.ts` |
| Form, nút bấm thay đổi dữ liệu (kể cả form đặt món, liên hệ) | Server Action trong `features/X/actions.ts` |
| Bên ngoài gọi vào (Telegram webhook P1, cron) | Route Handler trong `src/app/api/` |

KHÔNG ĐƯỢC tạo API route chỉ để chính frontend của dự án gọi.

---

## 4. Cấu trúc thư mục

```
banh-mi-thanh-long/
├── AGENTS.md                  # Quy tắc cho AI, AI đọc file này đầu tiên
├── CLAUDE.md                  # Trỏ tới AGENTS.md
├── README.md
├── docs/                      # Toàn bộ file 00–12
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── prisma.config.ts
├── public/                    # favicon, ảnh tĩnh nhỏ
├── src/
│   ├── app/
│   │   ├── (shop)/                          # Web khách (05)
│   │   │   ├── page.tsx                     # Trang chủ
│   │   │   ├── thuc-don/page.tsx            # Toàn bộ thực đơn
│   │   │   ├── thuc-don/[slug]/page.tsx     # Một danh mục (ví dụ /thuc-don/do-uong)
│   │   │   ├── mon/[slug]/page.tsx          # Chi tiết món
│   │   │   ├── dat-mon/page.tsx             # Form đặt món
│   │   │   ├── dat-mon/da-gui/page.tsx      # Đã gửi yêu cầu
│   │   │   ├── lien-he/page.tsx             # Liên hệ + bản đồ + form liên hệ
│   │   │   └── [trang-tinh]/page.tsx        # Giới thiệu, chính sách bảo mật (src/content)
│   │   ├── admin/                           # Trang quản trị (06)
│   │   │   ├── login/page.tsx
│   │   │   ├── page.tsx                     # Tổng quan
│   │   │   ├── yeu-cau/...                  # Yêu cầu đặt món + tin liên hệ
│   │   │   ├── mon/...                      # Món
│   │   │   ├── danh-muc/page.tsx
│   │   │   ├── tai-khoan/page.tsx
│   │   │   └── ui-kit/page.tsx
│   │   ├── api/
│   │   │   ├── auth/[...all]/route.ts       # Better Auth
│   │   │   ├── health/route.ts
│   │   │   ├── cron/...                     # Tác vụ định kỳ (09 mục 7)
│   │   │   └── telegram/webhook/route.ts    # P1: nút bấm trên tin Telegram
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   ├── sitemap.ts
│   │   └── robots.ts
│   ├── features/
│   │   ├── product/           # Món + lựa chọn giá + ảnh
│   │   ├── category/
│   │   ├── media/             # Chữ ký upload Cloudinary
│   │   ├── order-request/     # Yêu cầu đặt món
│   │   ├── contact/           # Tin liên hệ
│   │   ├── notification/      # Soạn & gửi tin Telegram
│   │   ├── dashboard/
│   │   └── auth/
│   ├── components/
│   │   ├── ui/
│   │   └── layout/            # Header, Footer, ContactFloatingButtons, AdminSidebar
│   ├── content/               # Nội dung trang tĩnh (Markdown)
│   ├── lib/
│   │   ├── db.ts · auth.ts · env.ts · errors.ts · result.ts
│   │   ├── money.ts           # Định dạng VND
│   │   ├── phone.ts           # Chuẩn hóa SĐT Việt Nam
│   │   ├── slug.ts · rate-limit.ts · logger.ts · markdown.ts · utils.ts
│   │   └── telegram.ts        # Gọi Telegram Bot API (timeout, escape HTML)
│   ├── config/
│   │   ├── site.ts            # Tên tiệm, địa chỉ, giờ mở cửa, SĐT, Zalo, Telegram, Maps, banner
│   │   └── ordering.ts        # Giới hạn số lượng, khung giờ hẹn, bán kính giao, câu thông báo
│   └── proxy.ts               # Chặn /admin khi chưa đăng nhập
├── tests/e2e/
├── .env.example
├── .nvmrc
├── netlify.toml
└── .github/
```

**Quy tắc đặt file**
- Code dùng cho **một** feature → nằm trong feature đó.
- Code dùng cho **từ hai** feature trở lên → chuyển lên `components/` hoặc `lib/`.
- KHÔNG ĐƯỢC tạo thư mục kiểu `helpers/`, `misc/`, `common/`.
- URL web khách dùng tiếng Việt không dấu. Tên file code, biến, hàm dùng tiếng Anh.

---

## 5. Quy ước đặt tên

| Loại | Quy ước | Ví dụ |
|---|---|---|
| Thư mục, file thường | kebab-case | `order-request-form.tsx` |
| React component | PascalCase | `MenuItemCard` |
| Hàm, biến | camelCase, hàm bắt đầu bằng động từ | `createOrderRequest`, `formatTelegramMessage` |
| Hằng số | UPPER_SNAKE_CASE | `MAX_QUANTITY_PER_LINE` |
| Type | PascalCase, không tiền tố `I` | `OrderRequestSummary` |
| Zod schema | camelCase + `Schema` | `createOrderRequestSchema` |
| Kiểu suy ra từ schema | PascalCase + `Input` | `CreateOrderRequestInput` |
| Boolean | `is` / `has` / `can` | `isAvailable`, `isFeatured` |
| Bảng Prisma | PascalCase số ít; cột camelCase | `model OrderRequestItem { unitPrice Int }` |
| Enum | PascalCase; giá trị UPPER_SNAKE | `RequestStatus.NEW` |
| Biến môi trường | UPPER_SNAKE_CASE | `TELEGRAM_CHAT_ID` |

Text hiển thị cho khách là tiếng Việt. Comment trong code NÊN viết tiếng Việt. Tên trong code luôn là tiếng Anh. Trong code, “món” = `product`, “lựa chọn giá” = `option`, “yêu cầu đặt món” = `orderRequest`.

---

## 6. Quy tắc TypeScript

- `strict: true`, `noUncheckedIndexedAccess: true`.
- KHÔNG ĐƯỢC dùng `any`. Dữ liệu chưa rõ kiểu dùng `unknown` rồi kiểm tra bằng Zod.
- KHÔNG ĐƯỢC dùng `@ts-ignore`. Bất khả kháng thì `@ts-expect-error` kèm lý do.
- KHÔNG ĐƯỢC dùng `!` (non-null assertion) để né lỗi.
- Hàm được export PHẢI khai báo kiểu trả về.
- Dùng import alias `@/`.
- Ưu tiên `type` hơn `interface`.

---

## 7. Quy tắc nghiệp vụ dữ liệu (bắt buộc)

| Vấn đề | Quy tắc |
|---|---|
| Tiền | Lưu **số nguyên VND** (`Int`). KHÔNG ĐƯỢC dùng số thực. Hiển thị qua `lib/money.ts` |
| Giá trong yêu cầu | Chụp lại tên món, tên lựa chọn, giá vào `OrderRequestItem` lúc gửi. Sửa thực đơn KHÔNG ĐƯỢC làm đổi yêu cầu cũ |
| Tạm tính | Luôn tính lại ở server từ giá trong DB. KHÔNG ĐƯỢC tin giá gửi từ trình duyệt. Luôn ghi rõ “giá tham khảo, chưa gồm phí giao” |
| Mã yêu cầu | Dạng `TL-YYMMDD-XXXX`, dễ đọc qua điện thoại |
| Thời gian | Lưu UTC; hiển thị và kiểm tra giờ mở cửa theo `Asia/Ho_Chi_Minh` |
| Xóa món | Xóa mềm bằng `archivedAt` |
| “Tạm hết” | Món `isAvailable = false` vẫn hiện trên thực đơn (mờ, nhãn “Tạm hết”) nhưng KHÔNG chọn được trong form đặt món |
| Trạng thái yêu cầu | Chỉ chuyển qua một hàm duy nhất kiểm tra bước chuyển hợp lệ (`02` mục 2) |
| Thứ tự lưu & gửi | **Lưu DB trước**, gửi Telegram sau. Telegram lỗi KHÔNG làm hỏng yêu cầu; đánh dấu `telegramSentAt = null` để gửi lại |
| Slug | Sinh từ tên, bỏ dấu tiếng Việt, duy nhất |
| Ảnh | DB chỉ lưu `publicId` của Cloudinary |

---

## 8. Validation, lỗi và kết quả trả về

### 8.1 Validation
- Mọi input từ người dùng (form, query string, params, webhook) PHẢI được validate bằng Zod **ở server**, kể cả khi đã validate ở form.
- Schema đặt trong `features/X/schema.ts`, dùng chung cho form và action.

### 8.2 Kết quả của Server Action
```ts
export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: { code: string; message: string; fieldErrors?: Record<string, string[]> } };
```
KHÔNG ĐƯỢC throw lỗi ra ngoài server action cho lỗi nghiệp vụ dự đoán được (món tạm hết, gửi quá nhiều…).

### 8.3 Lỗi
- Lỗi nghiệp vụ dùng `AppError` với mã cố định (ví dụ `ITEM_UNAVAILABLE`, `INVALID_STATUS_TRANSITION`).
- Thông báo cho khách: tiếng Việt, dễ hiểu, luôn kèm lối thoát: “gọi trực tiếp {SĐT} hoặc nhắn Zalo”.
- Lỗi không mong muốn: ghi log ở server, trả thông báo chung.
- Có `error.tsx` và `not-found.tsx` cho cả khu vực khách và admin.

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
- Một hàm làm một việc. Return sớm thay vì `if/else` lồng nhau.
- KHÔNG ĐƯỢC có số hoặc chuỗi “thần kỳ”: đưa vào hằng số hoặc `config/`.
- KHÔNG ĐƯỢC lặp code nghiệp vụ. Lặp UI đến chỗ thứ ba thì tách component.
- KHÔNG ĐƯỢC để code chết, code bị comment, `console.log` khi commit. Dùng `lib/logger.ts`.
- Comment giải thích **vì sao**.
- `TODO` phải kèm mô tả: `// TODO(p1): nút bấm Telegram đổi trạng thái`.

### 9.3 React / Next.js
- Mặc định là **Server Component**. `"use client"` chỉ ở component lá nhỏ nhất cần tương tác (bộ chọn món trong form, nút sao chép…).
- KHÔNG ĐƯỢC gọi database từ Client Component.
- Ảnh dùng `next/image` (hoặc component Cloudinary), luôn có `alt` tiếng Việt và kích thước.
- Mỗi trang khách PHẢI có `generateMetadata`.
- **Trang khách (trang chủ, thực đơn, chi tiết món, liên hệ) được render tĩnh + cache theo tag**; admin sửa món thì làm mới tag. Tên tag: `products`, `product:<id>`, `categories`, `site`. Mục đích: khách xem web không đánh thức DB Neon.
- Form đặt món gửi danh sách `{ optionId, quantity }`; server tự lấy tên và giá.

### 9.4 Giao diện
- Chỉ dùng màu, font, khoảng cách từ design token. KHÔNG ĐƯỢC viết mã màu trực tiếp trong component.
- Mọi component PHẢI hiển thị đúng ở chiều rộng 360px.
- Nút, input có trạng thái loading, disabled, lỗi.
- Đạt tiêu chuẩn truy cập cơ bản: label cho input, độ tương phản đủ, dùng được bằng bàn phím.

---

## 10. Bảo mật tối thiểu

- Mọi route dưới `/admin` và mọi action quản trị PHẢI kiểm tra phiên đăng nhập **ở server** (`requireAdmin()`); `proxy.ts` không đủ.
- Mật khẩu admin băm bằng thuật toán mặc định của Better Auth.
- Form đặt món và form liên hệ: giới hạn tần suất theo IP, trường ẩn chống bot, giới hạn độ dài mọi trường.
- Nội dung khách nhập PHẢI được escape trước khi đưa vào tin Telegram (`parse_mode: HTML`).
- Upload ảnh: chỉ admin, giới hạn định dạng và dung lượng.
- KHÔNG ĐƯỢC commit `.env`. Chỉ commit `.env.example`.
- Biến môi trường validate bằng Zod trong `lib/env.ts`; thiếu biến bắt buộc thì dừng ngay khi khởi động.
- Khóa bí mật (token Telegram, khóa Cloudinary) KHÔNG ĐƯỢC có tiền tố `NEXT_PUBLIC_`.

Chi tiết ở `08-SECURITY-SEO.md`.

---

## 11. Kiểm thử

| Loại | Công cụ | Phạm vi bắt buộc |
|---|---|---|
| Unit | Vitest | Tính tạm tính, chụp giá, chuẩn hóa SĐT, sinh mã yêu cầu, chuyển trạng thái yêu cầu, kiểm tra giờ hẹn hợp lệ, soạn & escape tin Telegram, giới hạn tần suất, tạo slug, `priceFrom` của món |
| E2E | Playwright | Khách: xem thực đơn → “Đặt món này” → gửi yêu cầu → trang đã gửi; gửi form liên hệ. Admin: đăng nhập → thấy yêu cầu → đổi trạng thái; bật “Tạm hết” → món không chọn được |
| Thủ công | Checklist `10` | Trước mỗi lần phát hành |

- File test đặt cạnh file được test.
- Test không gọi database thật, không gọi Telegram thật: mock `repository` và `lib/telegram`.
- Sửa lỗi nào thì thêm test tái hiện lỗi đó.

---

## 12. Git, commit và phát hành

### 12.1 Nhánh
- `main`: luôn chạy được, tự động deploy **production**. Chỉ nhận gộp từ `develop` (1–2 lần/tuần) hoặc `hotfix/...`, để giữ số lần deploy trong giới hạn credits Netlify (`09` mục 2.1).
- `develop`: nhánh tích hợp hằng ngày.
- Mỗi việc một nhánh tách từ `develop`: `feat/order-request-form`, `fix/telegram-escape`, `chore/remove-cart`.
- Gộp vào `develop` qua Pull Request, CI phải xanh.

### 12.2 Commit (Conventional Commits, kiểm tra bằng commitlint)
```
feat(order-request): thêm form đặt món gửi Telegram
fix(notification): escape ký tự < > trong ghi chú
refactor(product): đổi variant thành option
chore(cleanup): gỡ feature cart, shipping, payment
docs: cập nhật 02-DATABASE
```
Loại hợp lệ: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `style`, `perf`.

### 12.3 Kiểm tra tự động
| Thời điểm | Chạy |
|---|---|
| Trước commit | Prettier, ESLint trên file đã đổi |
| Khi đặt tên commit | commitlint |
| Mỗi Pull Request | `pnpm lint` · `pnpm typecheck` · `pnpm test` · `pnpm build` |
| Trước phát hành | Playwright E2E |

### 12.4 Database migration
- Mọi thay đổi schema qua `prisma migrate dev`, commit cả thư mục migration.
- KHÔNG ĐƯỢC sửa migration đã chạy trên production.
- Vì dự án mới dùng **database mới** (`12` mục 3), được phép gom lại thành một migration khởi tạo sạch **trước** lần deploy production đầu tiên. Sau đó áp dụng đầy đủ quy tắc trên.

### 12.5 Phiên bản
Tag SemVer khi phát hành: `v1.0.0` (ra mắt Bánh Mì Thanh Long), `v1.1.0` (P1)… Ghi vào `CHANGELOG.md`.

---

## 13. Quy tắc dành cho AI viết code (`AGENTS.md`)

> Bản có hiệu lực là `AGENTS.md` ở thư mục gốc dự án. **Cập nhật file đó theo khối dưới đây** khi bắt đầu chuyển đổi (`12` bước 0).

```markdown
# AGENTS.md — Bánh Mì Thanh Long

## Bối cảnh
Web giới thiệu món và liên hệ của tiệm bánh mì. KHÔNG có giỏ hàng, thanh toán, vận chuyển, tồn kho.
Đặt món = form gửi yêu cầu → lưu DB → báo Telegram. Đọc docs/00-MASTER-PLAN.md trước.

## Trước khi viết code
1. Đọc docs/01-TECH-STANDARDS.md và file docs liên quan đến việc đang làm.
2. Xem code hiện có của feature đó và làm theo đúng mẫu đang dùng.
3. Đang chuyển đổi từ code Lamora Flower: làm theo docs/12-KE-HOACH-CHUYEN-DOI.md, từng bước một.
4. Yêu cầu mâu thuẫn với docs hoặc thiếu thông tin ảnh hưởng dữ liệu, tiền, bảo mật: HỎI LẠI.

## Khi viết code
- Mỗi lần chỉ làm một việc nhỏ.
- Đúng lớp: app → actions/queries → service → repository. Chỉ repository gọi Prisma.
- Validate mọi input bằng Zod ở server. Tiền là số nguyên VND, tính ở server.
- Lưu yêu cầu vào DB trước, gửi Telegram sau; Telegram lỗi không được làm hỏng yêu cầu.
- Không dùng any, @ts-ignore, console.log.
- Không thêm thư viện mới nếu chưa được đồng ý.
- Không sửa migration đã chạy production. Không xóa test để làm CI xanh (test của tính năng đã bỏ theo docs/12 thì được xóa cùng tính năng).

## Sau khi viết code
- Chạy: pnpm lint && pnpm typecheck && pnpm test. Sửa đến khi qua hết.
- Thêm/cập nhật test cho logic trong service.
- Cập nhật docs nếu thay đổi schema, luồng nghiệp vụ hoặc cấu trúc.
- Tóm tắt cho chủ tiệm: đã đổi file nào, vì sao, cách tự kiểm tra trên trình duyệt.
- Đề xuất commit message theo Conventional Commits.
```

**Cách giao việc cho AI hiệu quả:** giao từng việc nhỏ, ví dụ “Làm form đặt món theo `05` mục 6”, thay vì “làm web khách”. Sau mỗi việc: chạy thử, commit, rồi mới giao việc tiếp.

---

## 14. Biến môi trường

| Biến | Dùng cho | Bắt buộc |
|---|---|---|
| `DATABASE_URL` | Kết nối Neon (bản pooled) | ✔ |
| `DIRECT_URL` | Kết nối trực tiếp cho Prisma migrate | ✔ |
| `AUTH_SECRET` | Ký phiên đăng nhập | ✔ |
| `ADMIN_EMAIL`, `ADMIN_INITIAL_PASSWORD` | Chỉ dùng khi seed tài khoản admin | seed |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Upload ảnh | ✔ |
| `TELEGRAM_BOT_TOKEN` | Bot gửi tin | ✔ production |
| `TELEGRAM_CHAT_ID` | Chat/nhóm nhận yêu cầu đặt món và liên hệ | ✔ production |
| `TELEGRAM_ENABLED` | `false` ở preview để không gửi tin thật | ✔ |
| `TELEGRAM_WEBHOOK_SECRET` | P1: xác thực webhook nút bấm Telegram | P1 |
| `NEXT_PUBLIC_SITE_URL` | URL website, dùng cho SEO và link trong tin Telegram | ✔ |
| `NEXT_PUBLIC_GA_ID` | (Tùy chọn) Google Analytics | – |
| `IP_HASH_SALT` | Băm IP chống spam (`08` mục 3) | ✔ |
| `CRON_SECRET` | Bảo vệ route `/api/cron/*` | ✔ |

**Đã bỏ:** `BANK_BIN`, `BANK_ACCOUNT_NO`, `BANK_ACCOUNT_NAME`.

---

## 15. Definition of Done

- [ ] Đúng yêu cầu trong file docs tương ứng
- [ ] Đúng thư mục, đúng lớp, không vi phạm quy tắc phụ thuộc
- [ ] `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` đều qua
- [ ] Có test cho logic nghiệp vụ mới
- [ ] Hiển thị đúng trên điện thoại (360px) và máy tính
- [ ] Có trạng thái loading, lỗi, danh sách rỗng
- [ ] Không còn `console.log`, code chết, `TODO` không mô tả, **không còn chữ “Lamora”** ngoài thư mục lưu trữ
- [ ] Docs đã cập nhật nếu có thay đổi schema hoặc luồng
- [ ] Commit message đúng chuẩn

---

## 16. Cần xác nhận

1. Repository mới tên `banh-mi-thanh-long` (private) — đồng ý? (`00` H1)
2. Comment trong code tiếp tục bằng tiếng Việt?

---

## Nhật ký thay đổi

| Phiên bản | Ngày | Thay đổi |
|---|---|---|
| v2.0 | 2026-10-07 | Chuyển sang Bánh Mì Thanh Long: bỏ cart, shipping, order, payment, collection; thêm `order-request`, `contact`, `lib/telegram.ts`, `lib/phone.ts`, `config/ordering.ts`; quy tắc “lưu DB trước, gửi Telegram sau”; trang khách cache tĩnh; bỏ biến `BANK_*`, thêm `TELEGRAM_WEBHOOK_SECRET` (P1) |
| v1.2 | 2026-10-05 | (Lamora) Better Auth, Next.js 16, Prisma 7, nhánh `develop` |
| v1.0 | 2026-10-05 | (Lamora) Bản đầu tiên |
