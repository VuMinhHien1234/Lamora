import { getEnv } from "@/lib/env";
import { sendTelegram } from "@/lib/telegram";
import { formatNewOrderMessage } from "./message";
import type { NewOrderNotice } from "./types";

/** Báo đơn mới cho chủ shop. Không bao giờ ném lỗi: thất bại chỉ ghi log (docs/07 mục 4.2). */
export async function notifyNewOrder(order: NewOrderNotice): Promise<void> {
  await sendTelegram(formatNewOrderMessage(order, getEnv().NEXT_PUBLIC_SITE_URL));
}
