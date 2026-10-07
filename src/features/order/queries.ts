import { getConfirmation } from "./confirmation-service";
import * as lookupService from "./lookup-service";
import { readLookedUpOrderCode, readPlacedOrderCode } from "./order-session";
import type { OrderConfirmation, OrderLookup } from "./types";

/** 🌐 Thông tin trang cảm ơn. Chỉ xem được ngay sau khi đặt (cookie ký, hết hạn 1 giờ). */
export async function getOrderConfirmation(code: string): Promise<OrderConfirmation | null> {
  return getConfirmation(code, await readPlacedOrderCode());
}

/** 🌐 Dữ liệu tra cứu đơn. KHÔNG tự giới hạn tần suất: chỉ gọi từ action đã áp `checkRateLimit` (feature `tracking`). */
export function lookupOrderData(code: string, phone: string): Promise<OrderLookup | null> {
  return lookupService.lookupOrder(code, phone);
}

/** 🌐 Kết quả tra cứu của đơn vừa tra cứu thành công trên trình duyệt này (cookie ký 30 phút). Không có/hết hạn → null. */
export async function getLookedUpOrder(code: string): Promise<OrderLookup | null> {
  return lookupService.lookupVerified(code, await readLookedUpOrderCode());
}
