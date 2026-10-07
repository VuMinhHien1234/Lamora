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
  cardMessage: string | null;
  giftWrap: boolean;
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
  { ok: true; order: PlacedOrder; draft: OrderDraft } | { ok: false; errors: OrderLineError[] };

/** Kết quả trả cho trình duyệt sau khi đặt đơn. */
export type CreateOrderData = { code: string; total: number; paymentMethod: PaymentMethod };

/** Dữ liệu trang "Đặt hàng thành công" (S9). Không có số điện thoại hay địa chỉ chi tiết đầy đủ ngoài người nhận cần xác nhận. */
export type OrderConfirmation = {
  code: string;
  status: string;
  paymentMethod: "COD" | "BANK_TRANSFER";
  paymentStatus: string;
  subtotal: number;
  shippingFee: number;
  giftWrapFee: number;
  total: number;
  recipientName: string;
  addressText: string;
  /** YYYY-MM-DD */
  preferredDeliveryDate: string | null;
  isGift: boolean;
  items: {
    productName: string;
    variantLabel: string | null;
    quantity: number;
    lineTotal: number;
    imageUrl: string | null;
  }[];
};

export type ConfirmationRow = {
  code: string;
  status: string;
  paymentMethod: "COD" | "BANK_TRANSFER";
  paymentStatus: string;
  subtotal: number;
  shippingFee: number;
  giftWrapFee: number;
  total: number;
  recipientName: string;
  addressLine: string;
  wardName: string;
  provinceName: string;
  preferredDeliveryDate: Date | null;
  isGift: boolean;
  items: {
    productName: string;
    variantLabel: string | null;
    quantity: number;
    lineTotal: number;
    imagePublicId: string | null;
  }[];
};

/** Dòng dữ liệu cho tra cứu đơn (S10): như xác nhận đơn + số điện thoại để đối chiếu, vận chuyển, lịch sử. */
export type LookupRow = ConfirmationRow & {
  customerPhone: string;
  recipientPhone: string;
  carrier: string | null;
  trackingCode: string | null;
  history: { toStatus: string; createdAt: Date }[];
};

/** Kết quả tra cứu trả cho khách. Không chứa số điện thoại. */
export type OrderLookup = {
  order: OrderConfirmation;
  carrier: string | null;
  trackingCode: string | null;
  history: { status: string; at: string }[];
};
