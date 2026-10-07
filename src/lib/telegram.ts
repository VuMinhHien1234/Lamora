import { getEnv } from "@/lib/env";
import { logger } from "@/lib/logger";

const TIMEOUT_MS = 5000;

export async function sendTelegram(text: string): Promise<void> {
  const env = getEnv();
  if (!env.TELEGRAM_ENABLED || !env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) return;
  try {
    const response = await fetch(
      `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          chat_id: env.TELEGRAM_CHAT_ID,
          text,
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      },
    );
    if (!response.ok) logger.warn("Telegram trả lỗi", { status: response.status });
  } catch (error) {
    logger.warn("Không gửi được Telegram", {
      error: error instanceof Error ? error.message : "unknown",
    });
  }
}

/** Tin báo đăng nhập quản trị (docs/08 mục 1). Đặt ở lib vì lớp đăng nhập không được import feature. */
export function formatAdminLoginMessage(time: Date, ipHash: string): string {
  const stamp = new Intl.DateTimeFormat("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(time);
  return `🔐 Đăng nhập quản trị lúc ${stamp} (mã IP ${ipHash.slice(0, 8)})`;
}

/** Báo có người đăng nhập trang quản trị để phát hiện đăng nhập lạ. Không ném lỗi. */
export async function notifyAdminLogin(time: Date, ipHash: string): Promise<void> {
  await sendTelegram(formatAdminLoginMessage(time, ipHash));
}
