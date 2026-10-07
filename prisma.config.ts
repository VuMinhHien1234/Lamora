import "dotenv/config";
import { defineConfig } from "prisma/config";

// Lệnh prisma (migrate, studio, db seed) dùng DIRECT_URL (kết nối trực tiếp, không qua pooler).
// Ứng dụng khi chạy dùng DATABASE_URL (bản pooled) qua src/lib/db.ts.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env.DIRECT_URL ?? "",
  },
});
