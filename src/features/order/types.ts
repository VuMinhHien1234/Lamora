import type { PaymentMethod } from "@/generated/prisma/client";
import type { ShippingZone } from "@/config/shipping";

/** Biến thể được đọc (và khóa dòng) trong transaction đặt hàng. */
export type OrderVariantSnapshot = {
  id: string;
  colorName: string;
  size: string;
  sku: string;
  price: number;
  stockQuantity: number;
  isActive: boolean;
  product: {
    id: string;
    name: string;
    status: string;
    images: { publicId: string; variantId: string | null }[];
  };
};

/** Dòng hàng đã chụp lại tên, nhãn, SKU, ảnh, giá tại thời điểm đặt (docs/02 mục 3.9). */
export type OrderItemDraft = {
  productId: string;
  variantId: string;
  productName: string;
  variantLabel: string | null;
  sku: string;
  imagePublicId: string | null;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
};

export type OrderDraft = {
  paymentMethod: PaymentMethod;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  recipientName: string;
  recipientPhone: string;
  provinceCode: string;
  provinceName: string;
  wardCode: string;
  wardName: string;
  addressLine: string;
  shippingZone: ShippingZone;
  isGift: boolean;
  giftMessage: string | null;
  giftWrap: boolean;
  preferredDeliveryDate: Date | null;
  customerNote: string | null;
  subtotal: number;
  shippingFee: number;
  giftWrapFee: number;
  total: number;
  ipHash: string | null;
  items: OrderItemDraft[];
};

export type OrderLineError = { variantId: string; message: string };

export type PlanResult = { ok: true; draft: OrderDraft } | { ok: false; errors: OrderLineError[] };

export type PlacedOrder = { id: string; code: string; total: number; paymentMethod: PaymentMethod };

export type PlaceOrderResult =
  { ok: true; order: PlacedOrder } | { ok: false; errors: OrderLineError[] };

/** Kết quả trả cho trình duyệt sau khi đặt đơn. */
export type CreateOrderData = { code: string; total: number; paymentMethod: PaymentMethod };
