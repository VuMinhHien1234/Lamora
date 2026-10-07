import { z } from "zod";

// Biến tùy chọn: để trống trên Netlify/.env thì coi như chưa cấu hình.
const optionalText = z
  .string()
  .optional()
  .transform((value) => (value && value.trim() !== "" ? value.trim() : undefined));

const booleanFlag = z
  .enum(["true", "false"])
  .default("false")
  .transform((value) => value === "true");

const MIN_SECRET_LENGTH = 32;

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().min(1, "thiếu chuỗi kết nối database (bản pooled)"),
  DIRECT_URL: z.string().min(1, "thiếu chuỗi kết nối trực tiếp để chạy migration"),
  AUTH_SECRET: z
    .string()
    .min(MIN_SECRET_LENGTH, `cần chuỗi ngẫu nhiên ≥ ${MIN_SECRET_LENGTH} ký tự`),
  IP_HASH_SALT: z
    .string()
    .min(MIN_SECRET_LENGTH, `cần chuỗi ngẫu nhiên ≥ ${MIN_SECRET_LENGTH} ký tự`),
  CRON_SECRET: z
    .string()
    .min(MIN_SECRET_LENGTH, `cần chuỗi ngẫu nhiên ≥ ${MIN_SECRET_LENGTH} ký tự`),
  NEXT_PUBLIC_SITE_URL: z.url("cần là địa chỉ website đầy đủ, ví dụ https://lamoraflower.vn"),

  // Google Analytics (tùy chọn): để trống = không theo dõi gì
  NEXT_PUBLIC_GA_ID: z
    .string()
    .regex(/^G-[A-Z0-9]+$/, "cần dạng G-XXXXXXXXXX")
    .optional()
    .or(z.literal("").transform(() => undefined)),

  // Chỉ dùng khi seed tài khoản admin
  ADMIN_EMAIL: optionalText,
  ADMIN_INITIAL_PASSWORD: optionalText,

  // Các dịch vụ ngoài: bật dần theo từng bước, nên chưa bắt buộc
  CLOUDINARY_CLOUD_NAME: optionalText,
  CLOUDINARY_API_KEY: optionalText,
  CLOUDINARY_API_SECRET: optionalText,
  TELEGRAM_BOT_TOKEN: optionalText,
  TELEGRAM_CHAT_ID: optionalText,
  TELEGRAM_ENABLED: booleanFlag,
  BANK_BIN: optionalText,
  BANK_ACCOUNT_NO: optionalText,
  BANK_ACCOUNT_NAME: optionalText,
});

export type Env = z.infer<typeof envSchema>;

/** Đọc và kiểm tra biến môi trường. Lỗi nói rõ biến nào sai, không in giá trị. */
export function parseEnv(source: Record<string, string | undefined>): Env {
  const parsed = envSchema.safeParse(source);
  if (parsed.success) return parsed.data;
  const lines = parsed.error.issues.map((issue) => `- ${issue.path.join(".")}: ${issue.message}`);
  throw new Error(`Cấu hình biến môi trường chưa đúng:\n${lines.join("\n")}`);
}

let cachedEnv: Env | undefined;

/** Chỉ gọi ở server. Kết quả được lưu lại cho các lần gọi sau. */
export function getEnv(): Env {
  cachedEnv ??= parseEnv(process.env);
  return cachedEnv;
}
