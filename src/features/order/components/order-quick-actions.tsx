"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { markOrderPaid, updateOrderStatus } from "../admin-actions";
import type { AdminOrderRow } from "../admin-types";

/** Nút nhanh trên mỗi dòng: "Xác nhận" cho đơn chờ, "Đã nhận tiền" cho đơn chuyển khoản chưa trả. */
export function OrderQuickActions({ row }: { row: AdminOrderRow }) {
  const router = useRouter();
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const canConfirm = row.status === "PENDING";
  const closed = row.status === "CANCELLED" || row.status === "RETURNED";
  const canMarkPaid =
    row.paymentMethod === "BANK_TRANSFER" && row.paymentStatus === "UNPAID" && !closed;

  async function run(
    action: () => ReturnType<typeof markOrderPaid>,
    success: string,
  ): Promise<void> {
    setBusy(true);
    const result = await action();
    setBusy(false);
    toast(result.ok ? success : result.error.message, result.ok ? "default" : "error");
    router.refresh();
  }

  return (
    <div className="flex flex-wrap gap-2">
      {canConfirm && (
        <Button
          variant="secondary"
          size="compact"
          disabled={busy}
          onClick={() =>
            void run(
              () => updateOrderStatus({ id: row.id, toStatus: "CONFIRMED" }),
              "Đã xác nhận đơn",
            )
          }
        >
          Xác nhận
        </Button>
      )}
      {canMarkPaid && (
        <Button
          variant="secondary"
          size="compact"
          disabled={busy}
          onClick={() => void run(() => markOrderPaid({ id: row.id }), "Đã ghi nhận thanh toán")}
        >
          Đã nhận tiền
        </Button>
      )}
    </div>
  );
}
