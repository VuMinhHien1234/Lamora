import "dotenv/config";
import { createInterface } from "node:readline/promises";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

// Cách dùng:
//   pnpm db:clear-data                 xóa sản phẩm, danh mục, bộ sưu tập, đơn hàng; GIỮ tài khoản admin
//   pnpm db:clear-data -- --admin      xóa CẢ tài khoản admin (sau đó chạy pnpm db:seed:admin để tạo lại)
// Chỉ dùng cho database dev/local, KHÔNG dùng cho production.
const withAdmin = process.argv.includes("--admin");

const connectionString = process.env.DIRECT_URL?.trim() || process.env.DATABASE_URL?.trim();
if (!connectionString) throw new Error("Thiếu DIRECT_URL hoặc DATABASE_URL trong file .env");

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

function endpointOf(url: string): string {
  return new URL(url).hostname.replace("-pooler", "").split(".")[0] ?? "không rõ";
}

async function confirm(endpoint: string): Promise<boolean> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const answer = await rl.question(
    `\nSẽ XÓA toàn bộ sản phẩm/danh mục/bộ sưu tập/đơn hàng${withAdmin ? " VÀ TÀI KHOẢN ADMIN" : ""} trên database "${endpoint}".\n` +
      `Đây có phải nhánh DEV không? Gõ XOA để tiếp tục, phím khác để hủy: `,
  );
  rl.close();
  return answer.trim() === "XOA";
}

async function main(): Promise<void> {
  const endpoint = endpointOf(connectionString as string);
  const [products, categories, collections, orders] = await Promise.all([
    db.product.count(),
    db.category.count(),
    db.collection.count(),
    db.order.count(),
  ]);
  console.log(
    `Database ${endpoint}: ${products} sản phẩm, ${categories} danh mục, ${collections} bộ sưu tập, ${orders} đơn.`,
  );
  if (!(await confirm(endpoint))) {
    console.log("Đã hủy, không xóa gì.");
    return;
  }
  const adminOps = withAdmin
    ? [
        db.session.deleteMany(),
        db.account.deleteMany(),
        db.verification.deleteMany(),
        db.user.deleteMany(),
      ]
    : [];
  await db.$transaction([
    db.order.deleteMany(), // kéo theo dòng đơn + lịch sử trạng thái
    db.product.deleteMany(), // kéo theo biến thể, ảnh, liên kết bộ sưu tập
    db.collection.deleteMany(),
    db.category.deleteMany({ where: { parentId: { not: null } } }), // danh mục con trước
    db.category.deleteMany(),
    db.rateLimitHit.deleteMany(),
    ...adminOps,
  ]);
  console.log(
    withAdmin
      ? "Đã xóa xong dữ liệu và tài khoản admin. Chạy tiếp: pnpm db:seed:admin"
      : "Đã xóa xong dữ liệu mẫu. Tài khoản admin được giữ nguyên.",
  );
}

main()
  .catch((error: unknown) => {
    console.error("Lỗi:", error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
