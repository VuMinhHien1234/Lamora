import { cn } from "@/lib/utils";

// Màu trạng thái theo docs/03 mục 10. Khai báo kiểu tại đây để component không phụ thuộc Prisma.
export type OrderStatusValue =
  "PENDING" | "CONFIRMED" | "SHIPPING" | "DELIVERED" | "CANCELLED" | "RETURNED";
export type PaymentStatusValue = "UNPAID" | "PAID" | "REFUNDED";
export type ProductStatusValue = "DRAFT" | "ACTIVE" | "ARCHIVED";

type Tone = { label: string; className: string };

const ORDER: Record<OrderStatusValue, Tone> = {
  PENDING: { label: "Chờ xác nhận", className: "bg-blush-100 text-rose-700" },
  CONFIRMED: { label: "Đã xác nhận", className: "bg-ivory-100 text-ink-900" },
  SHIPPING: { label: "Đang giao", className: "bg-admin-shipping-bg text-admin-shipping-fg" },
  DELIVERED: { label: "Đã giao", className: "bg-sage-100 text-sage-700" },
  CANCELLED: { label: "Đã hủy", className: "bg-sand-200 text-stone-500" },
  RETURNED: { label: "Hoàn hàng", className: "bg-sand-200 text-stone-500" },
};

const PAYMENT: Record<PaymentStatusValue, Tone> = {
  UNPAID: { label: "Chưa thanh toán", className: "border border-warning-700 text-warning-700" },
  PAID: { label: "Đã thanh toán", className: "border border-sage-700 text-sage-700" },
  REFUNDED: { label: "Đã hoàn tiền", className: "bg-sand-200 text-stone-500" },
};

const PRODUCT: Record<ProductStatusValue, Tone> = {
  DRAFT: { label: "Nháp", className: "bg-ivory-100 text-stone-500" },
  ACTIVE: { label: "Đang bán", className: "bg-sage-100 text-sage-700" },
  ARCHIVED: { label: "Ngừng bán", className: "bg-sand-200 text-stone-500" },
};

type StatusBadgeProps =
  | { kind: "order"; status: OrderStatusValue }
  | { kind: "payment"; status: PaymentStatusValue }
  | { kind: "product"; status: ProductStatusValue };

function pickTone(props: StatusBadgeProps): Tone {
  if (props.kind === "order") return ORDER[props.status];
  if (props.kind === "payment") return PAYMENT[props.status];
  return PRODUCT[props.status];
}

export function StatusBadge(props: StatusBadgeProps) {
  const tone = pickTone(props);
  return (
    <span
      className={cn(
        "inline-block px-2.5 py-1 text-[0.8125rem] leading-none font-medium",
        tone.className,
      )}
    >
      {tone.label}
    </span>
  );
}
