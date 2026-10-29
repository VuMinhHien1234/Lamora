import {
  ESTIMATED_DELIVERY_DAYS,
  FREE_SHIPPING_THRESHOLD,
  HANOI_PROVINCE_CODE,
  NORTH_PROVINCE_CODES,
  SHIPPING_FEES,
  SHIPPING_FEE_ENABLED,
  type ShippingZone,
} from "@/config/shipping";
import { logger } from "@/lib/logger";
import { findProvince, listProvinces, listWards } from "./address-data";
import type { AddressOption, ResolvedAddress, ShippingQuote } from "./types";

/** Vùng giao hàng theo mã tỉnh. Mã lạ → CENTRAL_SOUTH và ghi cảnh báo (docs/07 mục 3.2). */
export function getZoneByProvince(provinceCode: string): ShippingZone {
  if (provinceCode === HANOI_PROVINCE_CODE) return "HANOI_INNER";
  if (NORTH_PROVINCE_CODES.includes(provinceCode)) return "NORTH";
  if (!findProvince(provinceCode)) {
    logger.warn("Mã tỉnh không có trong dữ liệu, tính phí vùng CENTRAL_SOUTH", { provinceCode });
  }
  return "CENTRAL_SOUTH";
}

/** Phí giao hàng. `subtotal` là tiền hàng trước giảm giá; đạt mốc miễn phí thì 0đ. */
export function calculateShippingFee(zone: ShippingZone, subtotal: number): number {
  if (!SHIPPING_FEE_ENABLED) return 0;
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEES[zone];
}

export function quoteShipping(provinceCode: string, subtotal: number): ShippingQuote {
  const zone = getZoneByProvince(provinceCode);
  return {
    zone,
    shippingFee: calculateShippingFee(zone, subtotal),
    freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
    amountToFreeShipping: Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal),
    estimatedDelivery: ESTIMATED_DELIVERY_DAYS[zone],
  };
}

/** Không có `provinceCode` → danh sách tỉnh; có → phường/xã của tỉnh đó. */
export async function getAddressOptions(provinceCode?: string): Promise<AddressOption[]> {
  return provinceCode === undefined ? listProvinces() : listWards(provinceCode);
}

/** Kiểm tra phường/xã thuộc đúng tỉnh rồi trả tên đầy đủ để chụp vào đơn hàng. Sai → null. */
export async function resolveAddress(
  provinceCode: string,
  wardCode: string,
): Promise<ResolvedAddress | null> {
  const province = findProvince(provinceCode);
  if (!province) return null;
  const ward = (await listWards(provinceCode)).find((item) => item.code === wardCode);
  return ward ? { provinceName: province.name, wardName: ward.name } : null;
}
