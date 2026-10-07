import { cloudinaryUrl } from "@/lib/cloudinary";
import * as repo from "./repository";
import type { ConfirmationRow, OrderConfirmation } from "./types";

const THUMB_WIDTH = 160;
const ORDER_CODE_PATTERN = /^LMR-\d{6}-[A-Z0-9]{4}$/;

export function toConfirmation(row: ConfirmationRow): OrderConfirmation {
  const { addressLine, wardName, provinceName, preferredDeliveryDate, items, ...rest } = row;
  return {
    ...rest,
    addressText: `${addressLine}, ${wardName}, ${provinceName}`,
    preferredDeliveryDate: preferredDeliveryDate?.toISOString().slice(0, 10) ?? null,
    items: items.map(({ imagePublicId, ...item }) => ({
      ...item,
      imageUrl: imagePublicId ? cloudinaryUrl(imagePublicId, { width: THUMB_WIDTH }) : null,
    })),
  };
}

/**
 * Chỉ trả đơn khi cookie phiên đặt hàng (đã được kiểm tra chữ ký) đúng là của mã này.
 * Người không vừa đặt đơn không xem được dù biết mã (docs/04 mục 8.1 #2).
 */
export async function getConfirmation(
  code: string,
  sessionCode: string | null,
): Promise<OrderConfirmation | null> {
  if (!ORDER_CODE_PATTERN.test(code) || sessionCode !== code) return null;
  const row = await repo.findConfirmationByCode(code);
  return row ? toConfirmation(row) : null;
}
