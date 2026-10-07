import type { ShippingZone } from "@/config/shipping";

export type AddressOption = { code: string; name: string; nameAscii: string };

export type ShippingQuote = {
  zone: ShippingZone;
  shippingFee: number;
  freeShippingThreshold: number;
  /** Còn thiếu bao nhiêu để được miễn phí giao hàng (0 nếu đã đủ). */
  amountToFreeShipping: number;
  estimatedDelivery: string;
};

export type ResolvedAddress = { provinceName: string; wardName: string };
