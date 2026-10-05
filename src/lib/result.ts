import { ZodError } from "zod";
import { AppError, INTERNAL_ERROR_MESSAGE, type ErrorCode, type FieldErrors } from "@/lib/errors";
import { logger } from "@/lib/logger";

/** Kết quả chung của mọi Server Action (docs/01 mục 8.2). */
export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: { code: ErrorCode; message: string; fieldErrors?: FieldErrors } };

export function ok<T>(data: T): ActionResult<T> {
  return { ok: true, data };
}

export function fail(
  code: ErrorCode,
  message: string,
  fieldErrors?: FieldErrors,
): ActionResult<never> {
  return { ok: false, error: { code, message, ...(fieldErrors ? { fieldErrors } : {}) } };
}

/** Gom lỗi Zod thành { tênTrường: [thông báo] }. Lỗi cấp object nằm ở khóa "_form". */
export function zodFieldErrors(error: ZodError): FieldErrors {
  const fields: FieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path.length > 0 ? issue.path.join(".") : "_form";
    fields[key] = [...(fields[key] ?? []), issue.message];
  }
  return fields;
}

/** Biến mọi lỗi bắt được trong action thành ActionResult. Lỗi lạ thì log và trả thông báo chung. */
export function toErrorResult(error: unknown): ActionResult<never> {
  if (error instanceof AppError) return fail(error.code, error.message, error.fieldErrors);
  if (error instanceof ZodError) {
    return fail(
      "VALIDATION_ERROR",
      "Thông tin chưa hợp lệ, vui lòng kiểm tra lại.",
      zodFieldErrors(error),
    );
  }
  logger.error("Lỗi không lường trước", error);
  return fail("INTERNAL_ERROR", INTERNAL_ERROR_MESSAGE);
}
