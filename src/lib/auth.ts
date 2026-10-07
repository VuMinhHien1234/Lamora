import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/lib/db";
import { getEnv } from "@/lib/env";
import { loginGuardHooks } from "@/lib/login-guard";
import { hashIp } from "@/lib/rate-limit";
import { notifyAdminLogin } from "@/lib/telegram";

const SEVEN_DAYS_SECONDS = 7 * 24 * 60 * 60;
const MIN_PASSWORD_LENGTH = 10;

// Cấu hình Better Auth (docs/08 mục 1). Tài khoản admin chỉ được tạo bằng seed, KHÔNG có đăng ký công khai.
export const auth = betterAuth({
  baseURL: getEnv().NEXT_PUBLIC_SITE_URL,
  secret: getEnv().AUTH_SECRET,
  database: prismaAdapter(db, { provider: "postgresql" }),
  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
    minPasswordLength: MIN_PASSWORD_LENGTH,
  },
  session: { expiresIn: SEVEN_DAYS_SECONDS, updateAge: 24 * 60 * 60 },
  user: {
    additionalFields: {
      role: { type: "string", required: false, defaultValue: "ADMIN", input: false },
      mustChangePassword: { type: "boolean", required: false, defaultValue: true, input: false },
      lastLoginAt: { type: "date", required: false, input: false },
    },
  },
  advanced: {
    ipAddress: { ipAddressHeaders: ["x-nf-client-connection-ip", "x-forwarded-for"] },
  },
  databaseHooks: {
    session: {
      create: {
        after: async (session): Promise<void> => {
          await db.user.update({
            where: { id: session.userId },
            data: { lastLoginAt: new Date() },
          });
          // Báo Telegram để chủ shop phát hiện đăng nhập lạ (docs/08 mục 1). Lỗi gửi chỉ ghi log.
          await notifyAdminLogin(
            new Date(),
            hashIp(session.ipAddress ?? "unknown", getEnv().IP_HASH_SALT),
          );
        },
      },
    },
  },
  hooks: loginGuardHooks,
  plugins: [nextCookies()],
});
