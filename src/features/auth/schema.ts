import { z } from "zod";

export const MIN_PASSWORD_LENGTH = 10;
const MAX_PASSWORD_LENGTH = 128;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Vui lòng nhập mật khẩu hiện tại"),
    newPassword: z
      .string()
      .min(MIN_PASSWORD_LENGTH, `Mật khẩu mới cần ít nhất ${MIN_PASSWORD_LENGTH} ký tự`)
      .max(MAX_PASSWORD_LENGTH, "Mật khẩu quá dài"),
  })
  .refine((value) => value.newPassword !== value.currentPassword, {
    path: ["newPassword"],
    message: "Mật khẩu mới phải khác mật khẩu hiện tại",
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
