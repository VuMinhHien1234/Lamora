import { AppError } from "@/lib/errors";
import { markPasswordChanged } from "./repository";
import type { AdminUser, SessionUser } from "./types";

type AssertOptions = {
  /** true ở trang/hành động đổi mật khẩu, nơi người dùng đang bị bắt đổi mật khẩu vẫn được vào. */
  allowPasswordChange?: boolean;
};

/** Kiểm tra người trong phiên có được làm việc quản trị không. Không đụng DB hay framework. */
export function assertAdmin(
  user: SessionUser | null | undefined,
  options: AssertOptions = {},
): AdminUser {
  if (!user || user.role !== "ADMIN") {
    throw new AppError("UNAUTHORIZED", "Vui lòng đăng nhập để tiếp tục.");
  }
  if (user.mustChangePassword && !options.allowPasswordChange) {
    throw new AppError("PASSWORD_CHANGE_REQUIRED", "Vui lòng đổi mật khẩu trước khi tiếp tục.");
  }
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    mustChangePassword: Boolean(user.mustChangePassword),
  };
}

export async function completePasswordChange(userId: string): Promise<void> {
  await markPasswordChanged(userId);
}
