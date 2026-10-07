import { getOrderConfirmation, type OrderConfirmation } from "@/features/order";
import { getEnv } from "@/lib/env";
import { buildBankTransferInfo } from "./service";
import type { BankConfig, BankTransferInfo } from "./types";

function bankFromEnv(): BankConfig | null {
  const { BANK_BIN, BANK_ACCOUNT_NO, BANK_ACCOUNT_NAME } = getEnv();
  if (!BANK_BIN || !BANK_ACCOUNT_NO || !BANK_ACCOUNT_NAME) return null;
  return { bin: BANK_BIN, accountNo: BANK_ACCOUNT_NO, accountName: BANK_ACCOUNT_NAME };
}

/** 🌐 Thông tin chuyển khoản + mã QR. Cùng điều kiện xem như `getOrderConfirmation` (cookie phiên đặt hàng). */
export async function getBankTransferInfo(code: string): Promise<BankTransferInfo | null> {
  const order = await getOrderConfirmation(code);
  return order ? buildBankTransferInfo(order, bankFromEnv()) : null;
}

/** Thông tin chuyển khoản cho đơn đã được xác thực ở nơi gọi (ví dụ tra cứu đơn đã khớp mã + SĐT). Không đọc cookie. */
export function bankTransferInfoForOrder(order: OrderConfirmation): BankTransferInfo | null {
  return buildBankTransferInfo(order, bankFromEnv());
}
