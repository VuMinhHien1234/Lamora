"use client";

import { Button } from "@/components/ui/button";
import { markOrderPaid } from "../admin-actions";
import type { AdminOrderDetail } from "../admin-types";
import { useOrderAction } from "./use-order-action";

/** "Xác nhận đã nhận tiền" cho đơn chuyển khoản chưa thanh toán. */
export function PaymentAction({ order }: { order: AdminOrderDetail }) {
  const { busy, run } = useOrderAction();
  if (order.paymentMethod !== "BANK_TRANSFER" || !order.canMarkPaid) return null;
  return (
    <Button
      variant="secondary"
      loading={busy}
      onClick={() => void run(() => markOrderPaid({ id: order.id }), "Đã ghi nhận thanh toán")}
    >
      Xác nhận đã nhận tiền
    </Button>
  );
}
