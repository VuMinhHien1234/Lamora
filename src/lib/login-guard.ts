import { APIError, createAuthMiddleware } from "better-auth/api";
import { z } from "zod";
import { getEnv } from "@/lib/env";
import { checkRateLimit, getClientIp, hashIp, type RateLimitRule } from "@/lib/rate-limit";
import { dbRateLimitStore } from "@/lib/rate-limit-db";

// Đăng nhập sai 5 lần / 15 phút (theo email hoặc IP) thì khóa đến hết cửa sổ (docs/08 mục 3).
const SIGN_IN_PATH = "/sign-in/email";
const MAX_FAILURES = 5;
const WINDOW_SECONDS = 15 * 60;
const LOCKED_MESSAGE = "Bạn đã đăng nhập sai quá nhiều lần. Vui lòng thử lại sau ít phút.";

const signInBodySchema = z.object({ email: z.string().trim().toLowerCase() });

function loginRules(ctx: { body?: unknown; headers?: Headers }): RateLimitRule[] {
  const email = signInBodySchema.safeParse(ctx.body);
  const ipHash = hashIp(getClientIp(ctx.headers ?? new Headers()), getEnv().IP_HASH_SALT);
  const keys = [`login:${ipHash}`];
  if (email.success) keys.push(`login:${email.data.email}`);
  return keys.map((key) => ({ key, limit: MAX_FAILURES, windowSeconds: WINDOW_SECONDS }));
}

export const loginGuardHooks = {
  // Trước khi kiểm tra mật khẩu: nếu đã bị khóa thì dừng ngay (không ghi thêm).
  before: createAuthMiddleware(async (ctx) => {
    if (ctx.path !== SIGN_IN_PATH) return;
    for (const rule of loginRules(ctx)) {
      const decision = await checkRateLimit(rule, dbRateLimitStore, { record: false });
      if (!decision.allowed) throw new APIError("TOO_MANY_REQUESTS", { message: LOCKED_MESSAGE });
    }
  }),
  // Sau khi đăng nhập thất bại: ghi một lần sai cho mỗi khóa.
  after: createAuthMiddleware(async (ctx) => {
    if (ctx.path !== SIGN_IN_PATH) return;
    if (!(ctx.context.returned instanceof APIError)) return;
    for (const rule of loginRules(ctx)) await dbRateLimitStore.record(rule.key, new Date());
  }),
};
