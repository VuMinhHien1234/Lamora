import { createHash } from "node:crypto";

// Giới hạn tần suất (docs/08 mục 3). Bộ đếm nằm trong DB vì serverless không giữ bộ nhớ.
// File này chỉ có logic; nơi lưu thật (bảng RateLimitHit) được gắn ở bước A5.

export type RateLimitStore = {
  /** Số lần đã ghi cho `key` từ thời điểm `since`, kèm lần ghi sớm nhất trong khoảng đó. */
  countSince(key: string, since: Date): Promise<{ count: number; oldest: Date | null }>;
  record(key: string, at: Date): Promise<void>;
};

export type RateLimitRule = {
  key: string;
  limit: number;
  windowSeconds: number;
};

export type RateLimitDecision = {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

type CheckOptions = {
  /** false: chỉ kiểm tra, không ghi thêm lần gọi này (dùng khi chỉ đếm lần đăng nhập sai). */
  record?: boolean;
  now?: Date;
};

export async function checkRateLimit(
  rule: RateLimitRule,
  store: RateLimitStore,
  options: CheckOptions = {},
): Promise<RateLimitDecision> {
  const now = options.now ?? new Date();
  const since = new Date(now.getTime() - rule.windowSeconds * 1000);
  const { count, oldest } = await store.countSince(rule.key, since);

  if (count >= rule.limit) {
    const resetAt = (oldest ?? now).getTime() + rule.windowSeconds * 1000;
    const retryAfterSeconds = Math.max(1, Math.ceil((resetAt - now.getTime()) / 1000));
    return { allowed: false, remaining: 0, retryAfterSeconds };
  }

  if (options.record !== false) await store.record(rule.key, now);
  const used = count + (options.record === false ? 0 : 1);
  return { allowed: true, remaining: Math.max(0, rule.limit - used), retryAfterSeconds: 0 };
}

/** SHA-256(IP + muối). Không lưu IP gốc. */
export function hashIp(ip: string, salt: string): string {
  return createHash("sha256").update(`${ip}${salt}`).digest("hex");
}

/** IP khách: ưu tiên header của Netlify, dự phòng x-forwarded-for (docs/08 mục 3). */
export function getClientIp(headers: Pick<Headers, "get">): string {
  const netlifyIp = headers.get("x-nf-client-connection-ip");
  if (netlifyIp) return netlifyIp.trim();
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || "unknown";
}
