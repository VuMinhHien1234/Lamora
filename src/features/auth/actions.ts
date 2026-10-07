"use server";

import { isAPIError } from "better-auth/api";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { fail, toErrorResult, type ActionResult } from "@/lib/result";
import { requireAdmin } from "./require-admin";
import { changePasswordSchema } from "./schema";
import { completePasswordChange } from "./service";

/** Đổi mật khẩu admin: thu hồi các phiên khác, bỏ cờ "bắt đổi mật khẩu" (docs/04 mục 2). */
export async function changePassword(input: unknown): Promise<ActionResult<null>> {
  try {
    const admin = await requireAdmin({ allowPasswordChange: true });
    const { currentPassword, newPassword } = changePasswordSchema.parse(input);
    await auth.api.changePassword({
      headers: await headers(),
      body: { currentPassword, newPassword, revokeOtherSessions: true },
    });
    await completePasswordChange(admin.id);
    return { ok: true, data: null };
  } catch (error) {
    if (isAPIError(error)) {
      return fail("VALIDATION_ERROR", "Mật khẩu hiện tại chưa đúng.", {
        currentPassword: ["Mật khẩu hiện tại chưa đúng"],
      });
    }
    return toErrorResult(error);
  }
}
