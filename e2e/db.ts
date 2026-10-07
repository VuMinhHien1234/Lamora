import pg from "pg";

/** Chạy một câu SQL trên database local bằng driver `pg` (không dùng Prisma client vì Playwright không nạp được bản sinh sẵn). */
export async function runSql<T extends object = object>(
  sql: string,
  params: unknown[] = [],
): Promise<T[]> {
  const url = process.env.DATABASE_URL ?? "";
  if (!/@(localhost|127\.0\.0\.1)[:/]/.test(url)) {
    throw new Error("E2E chỉ được chạy trên database local (DATABASE_URL phải trỏ tới localhost).");
  }
  const client = new pg.Client({ connectionString: url });
  await client.connect();
  try {
    return (await client.query(sql, params)).rows as T[];
  } finally {
    await client.end();
  }
}

/**
 * Gỡ dấu IP khỏi các đơn E2E để không dính giới hạn "3 đơn / 10 phút / IP" của chống spam
 * (docs/04 mục 8.1): E2E tạo nhiều đơn liên tiếp từ cùng một máy.
 */
export async function clearE2eSpamCounter(): Promise<void> {
  await runSql(`update "Order" set "ipHash" = null where "customerName" like 'E2E %'`);
}
