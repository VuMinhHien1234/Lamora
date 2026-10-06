import { GIFT_WRAP_FEE, type ShippingZone } from "@/config/shipping";
import type {
  OrderDraft,
  OrderItemDraft,
  OrderLineError,
  OrderVariantSnapshot,
  PlanResult,
} from "./types";
import type { CreateOrderInput } from "./schema";

export type PlanContext = {
  provinceName: string;
  wardName: string;
  ipHash: string | null;
  /** Ngày nhận mong muốn đã kiểm tra hợp lệ, dạng YYYY-MM-DD. */
  deliveryDate: string | null;
  quote: (subtotal: number) => { zone: ShippingZone; shippingFee: number };
};

type Line = { variantId: string; quantity: number };

function mergeLines(items: Line[]): Line[] {
  const merged = new Map<string, number>();
  for (const { variantId, quantity } of items) {
    merged.set(variantId, (merged.get(variantId) ?? 0) + quantity);
  }
  return [...merged].map(([variantId, quantity]) => ({ variantId, quantity }));
}

function label(variant: OrderVariantSnapshot): string | null {
  return [variant.colorName, variant.size].filter(Boolean).join(" / ") || null;
}

function pickImage(variant: OrderVariantSnapshot): string | null {
  const images = variant.product.images;
  return (images.find((i) => i.variantId === variant.id) ?? images[0])?.publicId ?? null;
}

/** Lỗi của một dòng (null = bán được). */
function lineProblem(variant: OrderVariantSnapshot | undefined, quantity: number): string | null {
  if (!variant) return "Sản phẩm không còn bán.";
  const name = variant.product.name;
  if (!variant.isActive || variant.product.status !== "ACTIVE") return `"${name}" tạm ngừng bán.`;
  if (variant.stockQuantity <= 0) return `"${name}" đã hết hàng.`;
  if (variant.stockQuantity < quantity) {
    return `"${name}" chỉ còn ${variant.stockQuantity} sản phẩm, vui lòng giảm số lượng.`;
  }
  return null;
}

function toItem(variant: OrderVariantSnapshot, quantity: number): OrderItemDraft {
  return {
    productId: variant.product.id,
    variantId: variant.id,
    productName: variant.product.name,
    variantLabel: label(variant),
    sku: variant.sku,
    imagePublicId: pickImage(variant),
    unitPrice: variant.price,
    quantity,
    lineTotal: variant.price * quantity,
  };
}

/** Gom dòng hàng hợp lệ và lỗi. Giá luôn lấy từ database, không từ trình duyệt. */
function buildItems(
  lines: Line[],
  variants: OrderVariantSnapshot[],
): { items: OrderItemDraft[]; errors: OrderLineError[] } {
  const byId = new Map(variants.map((v) => [v.id, v]));
  const items: OrderItemDraft[] = [];
  const errors: OrderLineError[] = [];
  for (const { variantId, quantity } of lines) {
    const variant = byId.get(variantId);
    const message = lineProblem(variant, quantity);
    if (message || !variant)
      errors.push({ variantId, message: message ?? "Sản phẩm không còn bán." });
    else items.push(toItem(variant, quantity));
  }
  return { items, errors };
}

/** Thuần túy, không đụng database: từ dữ liệu biến thể đã khóa dòng → bản nháp đơn hàng với tiền tính lại ở server. */
export function planOrder(
  input: CreateOrderInput,
  variants: OrderVariantSnapshot[],
  ctx: PlanContext,
): PlanResult {
  const { items, errors } = buildItems(mergeLines(input.items), variants);
  if (errors.length > 0) return { ok: false, errors };

  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const { zone, shippingFee } = ctx.quote(subtotal);
  const wrap = input.isGift && input.giftWrap;
  const giftWrapFee = wrap ? GIFT_WRAP_FEE : 0;
  const recipient = input.isGift && input.recipient ? input.recipient : input.customer;

  const draft: OrderDraft = {
    paymentMethod: input.paymentMethod,
    customerName: input.customer.name,
    customerPhone: input.customer.phone,
    customerEmail: input.customer.email ?? null,
    recipientName: recipient.name,
    recipientPhone: recipient.phone,
    provinceCode: input.address.provinceCode,
    provinceName: ctx.provinceName,
    wardCode: input.address.wardCode,
    wardName: ctx.wardName,
    addressLine: input.address.addressLine,
    shippingZone: zone,
    isGift: input.isGift,
    giftMessage: input.isGift ? (input.giftMessage ?? null) : null,
    giftWrap: wrap,
    preferredDeliveryDate: ctx.deliveryDate ? new Date(`${ctx.deliveryDate}T00:00:00.000Z`) : null,
    customerNote: input.customerNote ?? null,
    subtotal,
    shippingFee,
    giftWrapFee,
    total: subtotal + shippingFee + giftWrapFee,
    ipHash: ctx.ipHash,
    items,
  };
  return { ok: true, draft };
}
