import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { assertAdmin } from "./service";
import type { AdminUser } from "./types";

type RequireAdminOptions = { allowPasswordChange?: boolean };

/**
 * Mọi query/action quản trị gọi hàm này ĐẦU TIÊN (docs/04 mục 2).
 * Ném AppError `UNAUTHORIZED` hoặc `PASSWORD_CHANGE_REQUIRED`.
 */
export async function requireAdmin(options: RequireAdminOptions = {}): Promise<AdminUser> {
  const session = await auth.api.getSession({ headers: await headers() });
  return assertAdmin(session?.user, options);
}
