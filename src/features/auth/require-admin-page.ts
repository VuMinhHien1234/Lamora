import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { isAppError } from "@/lib/errors";
import { requireAdmin } from "./require-admin";
import type { AdminUser } from "./types";

const LOGIN_PATH = "/admin/login";
const ACCOUNT_PATH = "/admin/tai-khoan";

/**
 * Dùng ở layout/trang admin: chưa đăng nhập → về trang đăng nhập; còn bị bắt đổi mật khẩu → về trang tài khoản.
 * Lưu ý: layout KHÔNG chạy lại mỗi lần chuyển trang, nên mọi query/action vẫn phải tự gọi requireAdmin().
 */
export async function requireAdminPage(): Promise<AdminUser> {
  try {
    const admin = await requireAdmin({ allowPasswordChange: true });
    const path = (await headers()).get("x-admin-path") ?? "";
    if (admin.mustChangePassword && !path.startsWith(ACCOUNT_PATH)) {
      redirect(`${ACCOUNT_PATH}?bat-buoc=1`);
    }
    return admin;
  } catch (error) {
    if (isAppError(error) && error.code === "UNAUTHORIZED") redirect(LOGIN_PATH);
    throw error;
  }
}

/** Trang đăng nhập: nếu đã đăng nhập rồi thì chuyển thẳng vào trong. */
export async function redirectIfLoggedIn(target: string): Promise<void> {
  try {
    await requireAdmin({ allowPasswordChange: true });
  } catch {
    return;
  }
  redirect(target);
}
