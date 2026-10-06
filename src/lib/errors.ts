// Mã lỗi nghiệp vụ dùng chung (docs/04 mục 13).
export const ERROR_CODES = [
  "VALIDATION_ERROR",
  "UNAUTHORIZED",
  "PASSWORD_CHANGE_REQUIRED",
  "NOT_FOUND",
  "CONFLICT",
  "INVALID_STATUS_TRANSITION",
  "PRODUCT_NOT_READY",
  "CATEGORY_NOT_EMPTY",
  "CART_EMPTY",
  "CART_INVALID",
  "INVALID_ADDRESS",
  "TOO_MANY_ORDERS",
  "RATE_LIMITED",
  "INTERNAL_ERROR",
] as const;

export type ErrorCode = (typeof ERROR_CODES)[number];

export type FieldErrors = Record<string, string[]>;

type AppErrorOptions = {
  fieldErrors?: FieldErrors;
  cause?: unknown;
};

/** Lỗi nghiệp vụ dự đoán được. `message` là câu tiếng Việt hiển thị cho người dùng. */
export class AppError extends Error {
  readonly code: ErrorCode;
  readonly fieldErrors?: FieldErrors;

  constructor(code: ErrorCode, message: string, options: AppErrorOptions = {}) {
    super(message, { cause: options.cause });
    this.name = "AppError";
    this.code = code;
    this.fieldErrors = options.fieldErrors;
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

/** Thông báo chung cho lỗi không lường trước (không lộ chi tiết kỹ thuật). */
export const INTERNAL_ERROR_MESSAGE = "Có lỗi xảy ra, vui lòng thử lại hoặc nhắn Zalo cho shop.";
