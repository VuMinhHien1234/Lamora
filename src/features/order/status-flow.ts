import { AppError } from "@/lib/errors";

export type OrderStatus =
  "PENDING" | "CONFIRMED" | "SHIPPING" | "DELIVERED" | "CANCELLED" | "RETURNED";
export type PaymentStatus = "UNPAID" | "PAID" | "REFUNDED";
export type PaymentMethod = "COD" | "BANK_TRANSFER";

// Luồng trạng thái đơn hợp lệ (docs/02 mục 2). Mọi chuyển khác bị từ chối.
const TRANSITIONS: Record<OrderStatus, readonly OrderStatus[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["SHIPPING", "CANCELLED"],
  SHIPPING: ["DELIVERED", "RETURNED"],
  DELIVERED: ["RETURNED"],
  CANCELLED: [],
  RETURNED: [],
};

export const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  SHIPPING: "Đang giao",
  DELIVERED: "Đã giao",
  CANCELLED: "Đã hủy",
  RETURNED: "Hoàn hàng",
};

export function allowedNextStatuses(from: OrderStatus): readonly OrderStatus[] {
  return TRANSITIONS[from];
}

export function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  return TRANSITIONS[from].includes(to);
}

/** Thông tin đơn cần để quyết định đổi trạng thái. */
export type OrderForTransition = {
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  items: { variantId: string | null; quantity: number }[];
};

export type StatusChangeInput = {
  toStatus: OrderStatus;
  note?: string;
  carrier?: string;
  trackingCode?: string;
  /** Khi hủy/hoàn đơn đã thanh toán: đánh dấu đã hoàn tiền. */
  markRefunded?: boolean;
};

/** Kết quả đã tính sẵn để repository chỉ việc ghi. */
export type StatusChangePlan = {
  fromStatus: OrderStatus;
  toStatus: OrderStatus;
  data: {
    status: OrderStatus;
    paymentStatus?: PaymentStatus;
    paidAt?: Date;
    confirmedAt?: Date;
    shippedAt?: Date;
    deliveredAt?: Date;
    cancelledAt?: Date;
    cancelReason?: string;
    carrier?: string;
    trackingCode?: string;
  };
  /** Số hàng cần cộng lại kho (khi hủy/hoàn). */
  restock: { variantId: string; quantity: number }[];
  note: string;
};

function invalid(from: OrderStatus, to: OrderStatus): AppError {
  return new AppError(
    "INVALID_STATUS_TRANSITION",
    `Không thể chuyển đơn từ "${STATUS_LABELS[from]}" sang "${STATUS_LABELS[to]}".`,
  );
}

function stampFor(to: OrderStatus, now: Date): Partial<StatusChangePlan["data"]> {
  if (to === "CONFIRMED") return { confirmedAt: now };
  if (to === "SHIPPING") return { shippedAt: now };
  if (to === "DELIVERED") return { deliveredAt: now };
  if (to === "CANCELLED") return { cancelledAt: now };
  return {};
}

/** COD giao xong = đã thu tiền; đơn đã trả tiền bị hủy/hoàn có thể đánh dấu hoàn tiền. */
function paymentEffect(
  order: OrderForTransition,
  input: StatusChangeInput,
  now: Date,
): Partial<StatusChangePlan["data"]> {
  const { toStatus } = input;
  if (
    toStatus === "DELIVERED" &&
    order.paymentMethod === "COD" &&
    order.paymentStatus === "UNPAID"
  ) {
    return { paymentStatus: "PAID", paidAt: now };
  }
  const ending = toStatus === "CANCELLED" || toStatus === "RETURNED";
  if (ending && input.markRefunded && order.paymentStatus === "PAID") {
    return { paymentStatus: "REFUNDED" };
  }
  return {};
}

function requireReason(input: StatusChangeInput): string | undefined {
  if (input.toStatus !== "CANCELLED") return input.note;
  const reason = input.note?.trim();
  if (!reason) {
    throw new AppError("VALIDATION_ERROR", "Vui lòng nhập lý do hủy đơn.", {
      fieldErrors: { note: ["Vui lòng nhập lý do hủy đơn."] },
    });
  }
  return reason;
}

/** Kiểm tra bước chuyển hợp lệ và tính mọi thay đổi kèm theo. Ném `INVALID_STATUS_TRANSITION` nếu sai luồng. */
export function planStatusChange(
  order: OrderForTransition,
  input: StatusChangeInput,
  now: Date,
): StatusChangePlan {
  if (!canTransition(order.status, input.toStatus)) throw invalid(order.status, input.toStatus);
  const note = requireReason(input);
  const ending = input.toStatus === "CANCELLED" || input.toStatus === "RETURNED";
  const restock = ending
    ? order.items.flatMap((item) =>
        item.variantId ? [{ variantId: item.variantId, quantity: item.quantity }] : [],
      )
    : [];
  const shipping =
    input.toStatus === "SHIPPING"
      ? { carrier: input.carrier, trackingCode: input.trackingCode }
      : {};
  return {
    fromStatus: order.status,
    toStatus: input.toStatus,
    data: {
      status: input.toStatus,
      ...stampFor(input.toStatus, now),
      ...paymentEffect(order, input, now),
      ...(input.toStatus === "CANCELLED" ? { cancelReason: note } : {}),
      ...shipping,
    },
    restock,
    note: note ?? "",
  };
}

export type PaidPlan = { data: { paymentStatus: "PAID"; paidAt: Date }; note: string };

/** Chủ shop xác nhận đã nhận tiền. Chỉ khi chưa thanh toán và đơn chưa hủy/hoàn. */
export function planMarkPaid(
  order: Pick<OrderForTransition, "status" | "paymentStatus">,
  paidAt: Date,
): PaidPlan {
  if (order.paymentStatus !== "UNPAID") {
    throw new AppError("CONFLICT", "Đơn này đã được đánh dấu thanh toán hoặc hoàn tiền rồi.");
  }
  if (order.status === "CANCELLED" || order.status === "RETURNED") {
    throw new AppError(
      "INVALID_STATUS_TRANSITION",
      "Đơn đã hủy hoặc hoàn hàng, không thể nhận tiền.",
    );
  }
  return { data: { paymentStatus: "PAID", paidAt }, note: "Đã nhận thanh toán" };
}
