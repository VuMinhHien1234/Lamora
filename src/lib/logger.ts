// Ghi log có cấu trúc. Không bao giờ truyền SĐT/địa chỉ đầy đủ vào log (docs/08 mục 8).
type LogLevel = "debug" | "info" | "warn" | "error";

type LogContext = Record<string, unknown>;

const LEVEL_WEIGHT: Record<LogLevel, number> = { debug: 10, info: 20, warn: 30, error: 40 };

function minimumLevel(): LogLevel {
  return process.env.NODE_ENV === "production" ? "info" : "debug";
}

/** Che bớt số điện thoại: 0912345678 → 0912***678. */
export function maskPhone(phone: string): string {
  const digits = phone.replace(/\s+/g, "");
  if (digits.length < 7) return "***";
  return `${digits.slice(0, 4)}***${digits.slice(-3)}`;
}

function serializeError(error: unknown): LogContext {
  if (error instanceof Error) {
    return { name: error.name, message: error.message, stack: error.stack };
  }
  return { value: String(error) };
}

function write(level: LogLevel, message: string, context?: LogContext): void {
  if (LEVEL_WEIGHT[level] < LEVEL_WEIGHT[minimumLevel()]) return;
  const line = JSON.stringify({ level, message, time: new Date().toISOString(), ...context });
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

export const logger = {
  debug: (message: string, context?: LogContext): void => write("debug", message, context),
  info: (message: string, context?: LogContext): void => write("info", message, context),
  warn: (message: string, context?: LogContext): void => write("warn", message, context),
  error: (message: string, error?: unknown, context?: LogContext): void =>
    write("error", message, {
      ...context,
      error: error === undefined ? undefined : serializeError(error),
    }),
};
