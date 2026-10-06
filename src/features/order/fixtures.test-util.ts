import type { CreateOrderInput } from "./schema";
import type { OrderVariantSnapshot } from "./types";

export function variant(
  id: string,
  partial: Partial<OrderVariantSnapshot> = {},
  product: Partial<OrderVariantSnapshot["product"]> = {},
): OrderVariantSnapshot {
  return {
    id,
    colorName: "Hồng",
    size: "M",
    sku: `SKU-${id}`,
    price: 350_000,
    stockQuantity: 5,
    isActive: true,
    product: { id: `p-${id}`, name: `Hoa ${id}`, status: "ACTIVE", images: [], ...product },
    ...partial,
  };
}

export function orderInput(partial: Partial<CreateOrderInput> = {}): CreateOrderInput {
  return {
    items: [{ variantId: "v1", quantity: 1 }],
    customer: { name: "Nguyễn An", phone: "0912345678", email: undefined },
    isGift: false,
    recipient: undefined,
    address: { provinceCode: "01", wardCode: "00001", addressLine: "12 Phố Huế" },
    giftMessage: undefined,
    giftWrap: false,
    preferredDeliveryDate: undefined,
    customerNote: undefined,
    paymentMethod: "COD",
    website: undefined,
    ...partial,
  };
}
