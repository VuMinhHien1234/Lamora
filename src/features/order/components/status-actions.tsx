"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { updateOrderStatus } from "../admin-actions";
import type { AdminOrderDetail } from "../admin-types";
import type { OrderStatus } from "../status-flow";
import { ReasonDialog, ShipDialog } from "./status-dialogs";
import { useOrderAction } from "./use-order-action";

type Dialog = "ship" | "cancel" | "return" | null;

type StatusButtonsProps = {
  next: OrderStatus[];
  busy: boolean;
  onGo: (to: "CONFIRMED" | "DELIVERED", success: string) => void;
  onDialog: (dialog: Dialog) => void;
};

function StatusButtons({ next, busy, onGo, onDialog }: StatusButtonsProps) {
  const has = (status: OrderStatus): boolean => next.includes(status);
  return (
    <>
      {has("CONFIRMED") && (
        <Button disabled={busy} onClick={() => onGo("CONFIRMED", "Đã xác nhận đơn")}>
          Xác nhận đơn
        </Button>
      )}
      {has("SHIPPING") && (
        <Button disabled={busy} onClick={() => onDialog("ship")}>
          Giao hàng
        </Button>
      )}
      {has("DELIVERED") && (
        <Button disabled={busy} onClick={() => onGo("DELIVERED", "Đã ghi nhận giao thành công")}>
          Đã giao
        </Button>
      )}
      {has("RETURNED") && (
        <Button variant="secondary" disabled={busy} onClick={() => onDialog("return")}>
          Hoàn hàng
        </Button>
      )}
      {has("CANCELLED") && (
        <Button variant="danger" disabled={busy} onClick={() => onDialog("cancel")}>
          Hủy đơn
        </Button>
      )}
    </>
  );
}

/** Chỉ hiện nút cho các bước chuyển hợp lệ (docs/06 mục 6). */
export function StatusActions({ order }: { order: AdminOrderDetail }) {
  const [dialog, setDialog] = useState<Dialog>(null);
  const { busy, run } = useOrderAction();
  const paid = order.paymentStatus === "PAID";
  const close = (): void => setDialog(null);
  const go = (toStatus: "CONFIRMED" | "DELIVERED", success: string): void => {
    void run(() => updateOrderStatus({ id: order.id, toStatus }), success);
  };

  if (order.nextStatuses.length === 0) {
    return <p className="type-small text-stone-500">Đơn đã kết thúc, không còn thao tác nào.</p>;
  }
  return (
    <div className="flex flex-wrap gap-3">
      <StatusButtons next={order.nextStatuses} busy={busy} onGo={go} onDialog={setDialog} />
      <ShipDialog open={dialog === "ship"} orderId={order.id} paid={paid} onClose={close} />
      <ReasonDialog
        open={dialog === "cancel"}
        mode="cancel"
        orderId={order.id}
        paid={paid}
        onClose={close}
      />
      <ReasonDialog
        open={dialog === "return"}
        mode="return"
        orderId={order.id}
        paid={paid}
        onClose={close}
      />
    </div>
  );
}
