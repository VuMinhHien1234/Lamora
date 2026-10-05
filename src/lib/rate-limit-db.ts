import { db } from "@/lib/db";
import type { RateLimitStore } from "@/lib/rate-limit";

// Nơi lưu bộ đếm thật: bảng RateLimitHit (docs/02 mục 3.11). Dọn bản ghi cũ bằng /api/cron/cleanup.
export const dbRateLimitStore: RateLimitStore = {
  async countSince(key, since) {
    const where = { key, createdAt: { gte: since } };
    const [count, first] = await Promise.all([
      db.rateLimitHit.count({ where }),
      db.rateLimitHit.findFirst({
        where,
        orderBy: { createdAt: "asc" },
        select: { createdAt: true },
      }),
    ]);
    return { count, oldest: first?.createdAt ?? null };
  },
  async record(key, at) {
    await db.rateLimitHit.create({ data: { key, createdAt: at } });
  },
};
