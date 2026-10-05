<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AGENTS.md — Lamora Flower

> File hướng dẫn cho **AI viết code** (Claude Code, Cursor, Codex, …) trong dự án website bán hoa lụa **Lamora Flower**.
> Đọc **toàn bộ file này** trước mỗi phiên làm việc. Phiên bản: v1.0 · 2026-10-05 · Dựa trên `docs/00-MASTER-PLAN.md` v0.4.

---

## 1. Bạn đang làm gì

- Website bán hoa lụa của **một chủ shop cá nhân**: web cho khách + trang quản trị cho chủ shop, trong **một dự án Next.js fullstack**.
- Chủ shop **không phải lập trình viên chuyên nghiệp**. Chủ shop review kết quả trên trình duyệt và đọc tóm tắt của bạn. Vì vậy:
  - Giải thích bằng **tiếng Việt, ngắn gọn, dễ hiểu**.
  - Không giả định chủ shop biết thuật ngữ; khi cần, giải thích trong một câu.
  - Mọi thứ phải **tự kiểm tra được**: chỉ rõ mở trang nào, bấm gì, thấy gì là đúng.
- Ngân sách hạ tầng **gần 0đ**: Netlify Free, Neon Free, Cloudinary Free. Không thêm dịch vụ trả phí.

---

## 2. Bản đồ tài liệu

Tài liệu là **nguồn sự thật**. Code phải khớp tài liệu; tài liệu thay đổi trước, code thay đổi sau.

| File | Đọc khi |
|---|---|
| `docs/00-MASTER-PLAN.md` | Cần biết phạm vi, ưu tiên P0/P1/P2, câu hỏi mở và giá trị mặc định (Phần H) |
| `docs/01-TECH-STANDARDS.md` | **Luôn luôn.** Stack, kiến trúc, thư mục, quy tắc code, Git |
| `docs/02-DATABASE.md` | Đụng tới schema, migration, seed, truy vấn |
| `docs/03-UI-DESIGN.md` | Đụng tới bất kỳ giao diện nào (token màu, chữ, component, wireframe) |
| `docs/04-SERVER-LAYER.md` | Viết query, server action, route handler, service, mã lỗi |
| `docs/05-SHOP-PAGES.md` | Làm trang cho khách |
| `docs/06-ADMIN-PAGES.md` | Làm trang quản trị |
| `docs/07-PAYMENT-SHIPPING.md` | COD, VietQR, phí ship, địa chỉ, Telegram |
| `docs/08-SECURITY-SEO.md` | Đăng nhập, chống spam, header, SEO, hiệu năng |
| `docs/09-DEPLOYMENT.md` | Netlify, Neon, Cloudinary, CI/CD, sao lưu, cron |
| `docs/10-TESTING-CHECKLIST.md` | Kiểm thử trước phát hành |

**Thứ tự ưu tiên khi các nguồn mâu thuẫn**
1. Yêu cầu bảo mật và toàn vẹn dữ liệu (tiền, đơn hàng, tồn kho) — không bao giờ hạ thấp.
2. Tài liệu chính thức của **phiên bản thư viện đang cài** (mục 6).
3. File `docs/` cụ thể cho việc đang làm (`02`–`10`).
4. `docs/01-TECH-STANDARDS.md`.
5. File này.
6. Thói quen hoặc mẫu code bạn quen dùng ở nơi khác.

Khi bạn phải theo mục 2 thay vì `docs/`, **cập nhật file docs tương ứng** trong cùng thay đổi và nói rõ trong báo cáo.

---

## 3. Quy trình cho mỗi việc

```
1. Nhận việc  →  2. Đọc  →  3. Lập kế hoạch ngắn  →  4. Code  →  5. Kiểm tra  →  6. Báo cáo
```

### 3.1 Nhận việc
- Mỗi lần chỉ làm **một bước** trong lộ trình (mục 4), hoặc một lỗi cụ thể.
- Việc quá lớn (dự kiến > ~15 file hoặc nhiều feature) → đề xuất chia nhỏ, chờ đồng ý.

### 3.2 Đọc
- Đọc phần docs liên quan (bảng mục 2) và **code hiện có** của feature đó. Làm theo mẫu đang có trong dự án.
- Kiểm tra phiên bản thư viện thật trong `package.json` trước khi dùng API của nó.

### 3.3 Lập kế hoạch ngắn (gửi cho chủ shop trước khi code nếu việc ≥ 5 file)
- Liệt kê file sẽ tạo/sửa, migration (nếu có), test sẽ viết, điểm còn mơ hồ.

### 3.4 Code
- Theo đúng kiến trúc và quy tắc ở mục 5.

### 3.5 Kiểm tra (bắt buộc, không bỏ qua)
```bash
pnpm lint && pnpm typecheck && pnpm test && pnpm build
```
- Sửa đến khi **tất cả** qua. Không tắt rule, không xóa/skip test để qua CI.
- Việc chạm luồng đặt hàng, thanh toán, admin đơn hàng → chạy thêm `pnpm test:e2e`.
- Việc có giao diện → tự mở trang ở chiều rộng **360px** và **1280px** (dùng trình duyệt tự động nếu có), kiểm tra không có thanh cuộn ngang, đúng token `03`.

### 3.6 Báo cáo (mẫu bắt buộc, tiếng Việt)
```markdown
## Đã làm: <mã bước> — <tên việc>

**Thay đổi chính**
- <1–5 gạch đầu dòng, viết cho người không chuyên>

**File đã tạo/sửa**
- `đường/dẫn/file.ts` — <vai trò>

**Database**: <không đổi | migration `<tên>`: <thay đổi gì>>

**Kiểm tra tự động**: lint ✅ · typecheck ✅ · test ✅ (<số> test) · build ✅

**Bạn tự kiểm tra như sau**
1. Chạy `pnpm dev`, mở http://localhost:3000/<trang>
2. <thao tác> → <kết quả đúng là gì>

**Tài liệu đã cập nhật**: <không | file + mục>

**Còn lại / cần bạn quyết định**: <không | câu hỏi>

**Commit đề xuất**: `feat(<phạm vi>): <mô tả>`
```

---

## 4. Lộ trình việc (theo thứ tự)

Mã bước lấy từ `04` mục 14 (A, B, C), `05` mục 12 (F), `06` mục 13 (G). Đánh `[x]` khi xong (chủ shop hoặc AI cập nhật file này).

### Giai đoạn 1 — Nền tảng
- [x] **A1** Khởi tạo Next.js + TypeScript strict + Tailwind + pnpm + alias `@/` · `.nvmrc` · `AGENTS.md`, `CLAUDE.md`, `docs/` đúng chỗ
- [x] **A2** ESLint (kể cả quy tắc phụ thuộc giữa các lớp, giới hạn kích thước), Prettier, Husky, lint-staged, commitlint
- [ ] **A3** `lib/`: `env`, `errors`, `result`, `money`, `slug`, `logger`, `rate-limit` (khung) + unit test
- [ ] **A4** Vitest + GitHub Actions `ci.yml`
- [ ] **A5** Prisma schema theo `02` + `prisma.config.ts` + migration đầu + migration SQL bổ sung (pg_trgm, CHECK)
- [ ] **A6** Seed dữ liệu mẫu (`02` mục 7)
- [ ] **A7** Better Auth: đăng nhập admin, tắt đăng ký, `proxy.ts`, `requireAdmin()`, bắt đổi mật khẩu lần đầu

### Giai đoạn 2 — Giao diện nền + quản trị sản phẩm
- [x] **G1 + F1** (đã code, ⏸ chờ chủ shop duyệt `/admin/ui-kit`) Token `03` mục 2–4, font, component `03` mục 7, trang `/admin/ui-kit`, khung admin (M0), đăng nhập (M1), đổi mật khẩu (M10), khung shop (S0) + kho giỏ hàng
  → ⏸ **Dừng, chờ chủ shop duyệt `/admin/ui-kit`** trên điện thoại và máy tính trước khi làm tiếp.
- [x] **B1 → G2** Danh mục: backend rồi màn hình M7
- [ ] **B3 → G3** Sản phẩm admin: backend rồi M5, M6 (thông tin chung, biến thể)
  - [x] **3a** backend `product` (tạo/sửa, biến thể, trạng thái, danh sách admin) + test
  - [ ] **3b** M5 danh sách sản phẩm
  - [ ] **3c** M6 form thêm/sửa + bảng biến thể
- [ ] **B4 → G4** `media` + ảnh sản phẩm trong M6
- [ ] **B2 → G5** Bộ sưu tập: backend rồi M8, M9

### Giai đoạn 3 — Web khách và đặt hàng
- [ ] **B5 → F2, F3** Query sản phẩm phía khách → thẻ, lưới, S2; chi tiết S6
- [ ] **C1** Địa chỉ + phí ship (`07` mục 3)
- [ ] **C2 → F4** `validateCart` → S7 giỏ hàng + giỏ nhỏ
- [ ] **C3 → F5** `createOrder` → S8 thanh toán
- [ ] **C5 → F6** Xác nhận đơn, VietQR (`07` mục 2) → S9
- [ ] **C7** Telegram đơn mới + đăng nhập admin

### Giai đoạn 4 — Xử lý đơn và hoàn thiện
- [ ] **C4, C6 → G6, G7** Trạng thái đơn, thanh toán, hủy, hoàn → M3, M4
- [ ] **C8 → G8** Tổng quan admin (M2), `/api/health`
- [ ] **F7** Bộ lọc, sắp xếp, phân trang; S3, S4, S5
- [ ] **F8** Trang chủ S1
- [ ] **F9** Tra cứu đơn S10
- [ ] **F10** Trang tĩnh, 404/lỗi, metadata, JSON-LD, sitemap, robots, header bảo mật (`08`)
- [ ] **F11 + G9** E2E Playwright cho luồng khách và luồng admin

### Giai đoạn 5 — Triển khai
- [ ] **D1** `netlify.toml`, workflow `backup`, `health`, `cron`, `dependabot` (`09` mục 9); route `/api/cron/*`
- [ ] **D2** Hướng dẫn chủ shop từng bước thiết lập Netlify, Neon branch, biến môi trường (`09` mục 4) — bạn viết hướng dẫn, chủ shop bấm
- [ ] **D3** Chạy checklist `10`, sửa lỗi mức Cao
- [ ] **D4** Ra mắt `v0.1.0` (`10` mục 9)

---

## 5. Quy tắc code (tóm tắt — chi tiết ở `docs/01`)

### 5.1 Kiến trúc và vị trí file
```
src/app/**            → chỉ định tuyến, layout, gọi features. Mỏng.
src/features/<x>/
  queries.ts          → hàm đọc cho Server Component: requireAdmin (nếu 🔐) → service → gắn cache tag
  actions.ts          → "use server": requireAdmin (nếu 🔐) → Zod parse → service → làm mới cache → ActionResult
  service.ts          → nghiệp vụ thuần. KHÔNG import next/*, React, Prisma
  repository.ts       → nơi DUY NHẤT gọi Prisma
  schema.ts           → Zod schema dùng chung form + server
  components/         → UI riêng của feature
  index.ts            → API công khai; feature khác chỉ import từ đây
src/components/ui     → component cơ bản theo docs/03 mục 7
src/lib, src/config   → hạ tầng dùng chung, hằng số cấu hình
```
- Tên hàm query/action **đúng như `docs/04`** (ví dụ `listProducts`, `createOrder`). Không tự đặt tên khác.
- Code dùng cho 1 feature ở trong feature đó; dùng cho ≥ 2 feature thì đưa lên `components/` hoặc `lib/`.

### 5.2 Bắt buộc
- TypeScript `strict`. Không `any`, không `@ts-ignore`, không `!` để né lỗi. Hàm export có kiểu trả về.
- **Tiền là số nguyên VND.** Mọi tổng tiền, phí ship, giá **tính lại ở server**; không tin số từ trình duyệt.
- **Mọi input** (form, params, query string, webhook, cookie) validate bằng Zod **ở server**.
- Server Action trả `ActionResult<T>`; lỗi nghiệp vụ dùng `AppError` với mã trong `docs/04` mục 13. Không throw lỗi nghiệp vụ ra ngoài action.
- Thông báo cho người dùng bằng tiếng Việt, giọng văn theo `docs/03` mục 1.3; không lộ chi tiết kỹ thuật.
- Tạo đơn, đổi trạng thái đơn, cộng/trừ kho: **trong transaction**; chuyển trạng thái chỉ qua một hàm kiểm tra luồng hợp lệ (`docs/02` mục 2).
- Đơn hàng chụp lại tên, biến thể, SKU, ảnh, giá vào `OrderItem`.
- Thời gian lưu UTC, hiển thị `Asia/Ho_Chi_Minh`.
- Không `console.log`; dùng `lib/logger.ts`. Log không chứa SĐT/địa chỉ đầy đủ.
- Mặc định Server Component; `"use client"` chỉ ở component lá cần tương tác.

### 5.3 Giao diện
- **Chỉ dùng token** trong `docs/03` (màu, font, cỡ chữ, khoảng cách, bo góc). Không viết mã màu hex trực tiếp trong component. Không bo góc ngoài `0` và `2px` (trừ ô màu tròn).
- Dựng trang theo wireframe `docs/03` mục 9, dùng component có sẵn. Cần component mới → thêm vào `docs/03` mục 7 và trang `/admin/ui-kit` trước.
- Mọi trang đúng ở 360px; có trạng thái đang tải, rỗng, lỗi; dùng được bằng bàn phím; ảnh có `alt` tiếng Việt.
- Ảnh sản phẩm tỉ lệ 4:5, qua Cloudinary (`f_auto,q_auto`), có kích thước để không nhảy bố cục.

### 5.4 Bảo mật
- Mọi query/action 🔐 gọi `requireAdmin()` **đầu tiên**, kể cả khi `proxy.ts` đã chặn.
- Áp `checkRateLimit` cho đặt hàng, tra cứu đơn, đăng nhập (`docs/08` mục 3).
- Không đưa khóa bí mật vào code, test, log hay biến `NEXT_PUBLIC_*`. Biến môi trường mới → thêm vào `lib/env.ts`, `.env.example`, `docs/01` mục 14.
- Markdown từ admin render **không** cho phép HTML thô.

### 5.5 Kiểm thử
- Logic trong `service.ts` có unit test đặt cạnh file (`service.test.ts`), mock `repository`.
- Bắt buộc test: tiền, phí ship, chuyển trạng thái, tồn kho, mã đơn, nội dung chuyển khoản, slug, rate limit, quyền admin.
- Sửa lỗi → thêm test tái hiện lỗi đó trước.

### 5.6 Database
- Đổi schema → `prisma migrate dev --name <ten-ro-nghia>`, commit thư mục migration, cập nhật `docs/02`.
- **Không sửa migration đã có.** Không xóa/đổi tên cột trong một bước (làm nhiều bước, tương thích ngược).
- Không chạy lệnh ghi vào database production. Không chạy `migrate reset` trừ khi chủ shop yêu cầu và đang ở database local.

### 5.7 Git
- Nhánh: tách từ `develop` → `feat/…`, `fix/…`, `chore/…`, `docs/…`. Không commit thẳng vào `main`.
- Commit theo Conventional Commits, mô tả tiếng Việt: `feat(order): thêm tra cứu đơn theo số điện thoại`.
- Mỗi bước lộ trình = 1 Pull Request vào `develop`. Gộp `develop` → `main` chỉ khi chủ shop yêu cầu (tiết kiệm credits Netlify, `docs/09` mục 2.1).

---

## 6. Lưu ý phiên bản thư viện

Kiến thức có sẵn của bạn có thể đã cũ. **Trước khi dùng một API, kiểm tra phiên bản trong `package.json` và tài liệu chính thức của phiên bản đó.**

| Thư viện | Điểm hay sai |
|---|---|
| Next.js 16+ | **Đọc `node_modules/next/dist/docs/` trước khi code** (tài liệu đúng phiên bản đang cài). Dùng `proxy.ts` (không phải `middleware.ts`). Kiểm tra API cache hiện hành (`revalidateTag` có tham số mới, `updateTag` trong Server Action). `params`, `searchParams`, `cookies()`, `headers()` là bất đồng bộ (`await`) |
| Prisma 7+ | URL kết nối trong `prisma.config.ts`; generator khai báo `output`; import client từ đường dẫn output đó. Neon: `DATABASE_URL` bản pooled cho ứng dụng, `DIRECT_URL` cho migrate |
| Better Auth | Dùng thay Auth.js. Sinh schema bảng auth bằng CLI của Better Auth; trường bổ sung (`role`, `mustChangePassword`, `lastLoginAt`) khai báo `additionalFields`; tắt đăng ký email/mật khẩu công khai |
| Tailwind CSS 4+ | Token bằng `@theme` trong `globals.css`; không cần `tailwind.config.js` cho token |
| Zod 4+ | Kiểm tra cú pháp thông báo lỗi và `z.infer` theo phiên bản cài |
| Netlify | Next.js chạy qua adapter tự động của Netlify; IP khách lấy từ header `x-nf-client-connection-ip` |

---

## 7. Khi nào PHẢI dừng và hỏi

Hỏi chủ shop (ngắn gọn, đưa sẵn 2–3 lựa chọn và lựa chọn bạn đề xuất) khi:
- Yêu cầu mâu thuẫn với `docs/`, hoặc docs thiếu thông tin ảnh hưởng tới **tiền, đơn hàng, tồn kho, dữ liệu khách, bảo mật**.
- Cần thêm **thư viện mới**, **dịch vụ ngoài**, hoặc bất cứ thứ gì có thể tốn tiền.
- Cần thay đổi schema ngoài phạm vi `docs/02`, hoặc thay đổi có thể mất dữ liệu.
- Cần đổi kiến trúc, cấu trúc thư mục, tên route/URL công khai.
- Một lệnh có thể ảnh hưởng production, xóa dữ liệu, hoặc không hoàn tác được.
- Sau 3 lần thử vẫn không qua kiểm tra mục 3.5 — báo rõ lỗi, đã thử gì, đề xuất hướng.

Không cần hỏi khi docs đã có câu trả lời, hoặc có **mặc định** trong `docs/00` Phần H — dùng mặc định và ghi rõ trong báo cáo.

---

## 8. Tuyệt đối không

- Không gọi Prisma ngoài `repository.ts`. Không gọi database từ Client Component.
- Không tin giá, tổng tiền, phí ship, trạng thái gửi từ trình duyệt.
- Không bỏ `requireAdmin()` ở query/action quản trị.
- Không commit `.env`, khóa bí mật, dữ liệu khách thật.
- Không tắt rule lint, không thêm `eslint-disable` hàng loạt, không xóa/skip test để qua CI.
- Không sửa migration cũ; không chạy `migrate reset`/`db push` lên database dùng chung.
- Không thêm thư viện, dịch vụ trả phí, tracking mới mà chưa được đồng ý.
- Không tự ý đổi tên/di chuyển file ngoài phạm vi việc đang làm; không “refactor tiện tay”.
- Không thêm tính năng P1/P2 khi đang làm P0. Ghi `// TODO(p1): …` nếu cần đánh dấu.
- Không viết màu, cỡ chữ, bo góc ngoài token `docs/03`.
- Không push lên `main` hay deploy production khi chủ shop chưa yêu cầu.

---

## 9. Mẫu câu giao việc (dành cho chủ shop)

Copy, thay phần trong `< >`:

**Bắt đầu một bước**
```
Đọc AGENTS.md. Làm bước <A1> trong lộ trình mục 4.
Gửi kế hoạch ngắn trước khi code nếu sửa từ 5 file trở lên.
```

**Sửa lỗi**
```
Đọc AGENTS.md. Lỗi: <mô tả, trang nào, bấm gì, thấy gì, mong đợi gì>.
Viết test tái hiện lỗi trước, rồi sửa. Báo cáo theo mẫu mục 3.6.
```

**Đổi yêu cầu**
```
Đọc AGENTS.md. Tôi muốn đổi: <nội dung>.
Cập nhật file docs liên quan trước, cho tôi xem phần thay đổi, rồi mới sửa code.
```

**Kiểm tra trước khi gộp vào main**
```
Đọc AGENTS.md và docs/10-TESTING-CHECKLIST.md mục 10.
Kiểm tra develop đã sẵn sàng gộp vào main chưa và báo các mục chưa đạt.
```

---

## 10. Lệnh thường dùng

| Lệnh | Việc |
|---|---|
| `pnpm dev` | Chạy local tại http://localhost:3000 |
| `pnpm lint` · `pnpm typecheck` · `pnpm test` · `pnpm build` | Kiểm tra bắt buộc (`lint` không cho phép cảnh báo; `typecheck` = `next typegen && tsc --noEmit`) |
| `pnpm lint:fix` · `pnpm format` · `pnpm format:check` | Tự sửa lint / định dạng Prettier / chỉ kiểm tra định dạng |
| `pnpm test:e2e` | Playwright |
| `pnpm prisma migrate dev --name <ten>` | Tạo migration (database local/dev) |
| `pnpm prisma db seed` | Nạp dữ liệu mẫu |
| `pnpm prisma studio` | Xem dữ liệu trên trình duyệt |

(Tạo đủ các script này trong `package.json` ở bước A1–A5.)

---

## Nhật ký thay đổi

| Phiên bản | Ngày | Thay đổi |
|---|---|---|
| v1.0 | 2026-10-05 | Bản đầu tiên |
| v1.2 | 2026-10-05 | Xong G1+F1: token, component, ui-kit, khung admin/shop, đăng nhập, đổi mật khẩu, kho giỏ hàng. Chờ duyệt ui-kit |
| v1.3 | 2026-10-05 | Xong B1→G2 (Danh mục). Thêm component Switch. Sắp xếp bằng nút ↑↓ thay vì kéo-thả |
| v1.4 | 2026-10-06 | Chia B3→G3 thành 3a/3b/3c. Xong 3a: backend sản phẩm và biến thể |
