"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CARRIERS } from "@/config/shipping";
import { cancelOrder, updateOrderStatus } from "../admin-actions";
import { FormDialog } from "./form-dialog";
import { useOrderAction } from "./use-order-action";

type DialogProps = { open: boolean; orderId: string; onClose: () => void; paid: boolean };

function Buttons({
  busy,
  onClose,
  label,
  danger,
}: {
  busy: boolean;
  onClose: () => void;
  label: string;
  danger?: boolean;
}) {
  return (
    <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
      <Button type="button" variant="ghost" onClick={onClose} disabled={busy}>
        Quay lại
      </Button>
      <Button type="submit" variant={danger ? "danger" : "primary"} loading={busy}>
        {label}
      </Button>
    </div>
  );
}

export function ShipDialog({ open, orderId, onClose }: DialogProps) {
  const { busy, run } = useOrderAction();
  const [carrier, setCarrier] = useState("");
  const [trackingCode, setTrackingCode] = useState("");
  async function submit(): Promise<void> {
    const done = await run(
      () => updateOrderStatus({ id: orderId, toStatus: "SHIPPING", carrier, trackingCode }),
      "Đã chuyển sang đang giao",
    );
    if (done) onClose();
  }
  return (
    <FormDialog open={open} title="Giao hàng" onClose={onClose}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void submit();
        }}
        className="flex flex-col gap-4"
      >
        <datalist id="carrier-list">
          {CARRIERS.map((name) => (
            <option key={name} value={name} />
          ))}
        </datalist>
        <Input
          label="Đơn vị vận chuyển"
          list="carrier-list"
          value={carrier}
          onChange={(e) => setCarrier(e.target.value)}
          hint="Chọn từ gợi ý hoặc tự nhập."
        />
        <Input
          label="Mã vận đơn"
          value={trackingCode}
          onChange={(e) => setTrackingCode(e.target.value)}
          hint="Khách sẽ thấy mã này khi tra cứu đơn."
        />
        <Buttons busy={busy} onClose={onClose} label="Bắt đầu giao" />
      </form>
    </FormDialog>
  );
}

type ReasonProps = DialogProps & { mode: "cancel" | "return" };

const TEXT = {
  cancel: {
    title: "Hủy đơn hàng",
    label: "Lý do hủy",
    button: "Hủy đơn",
    success: "Đã hủy đơn",
    note: "Kho sẽ được cộng lại.",
  },
  return: {
    title: "Hoàn hàng",
    label: "Lý do hoàn hàng",
    button: "Xác nhận hoàn hàng",
    success: "Đã ghi nhận hoàn hàng",
    note: "Kho sẽ được cộng lại.",
  },
} as const;

/** Hủy đơn hoặc hoàn hàng: bắt buộc nhập lý do; đơn đã thanh toán có thể đánh dấu đã hoàn tiền. */
export function ReasonDialog({ open, orderId, onClose, paid, mode }: ReasonProps) {
  const { busy, run } = useOrderAction();
  const [reason, setReason] = useState("");
  const [refunded, setRefunded] = useState(false);
  const [error, setError] = useState<string>();
  const text = TEXT[mode];

  async function submit(): Promise<void> {
    if (!reason.trim()) return setError("Vui lòng nhập lý do.");
    setError(undefined);
    const input = { id: orderId, markRefunded: paid && refunded };
    const action =
      mode === "cancel"
        ? () => cancelOrder({ ...input, reason })
        : () => updateOrderStatus({ ...input, toStatus: "RETURNED", note: reason });
    if (await run(action, text.success)) onClose();
  }

  return (
    <FormDialog open={open} title={text.title} onClose={onClose}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void submit();
        }}
        className="flex flex-col gap-4"
      >
        <Textarea
          label={text.label}
          required
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          error={error}
          hint={text.note}
        />
        {paid && (
          <label className="type-body flex items-start gap-3">
            <input
              type="checkbox"
              checked={refunded}
              onChange={(e) => setRefunded(e.target.checked)}
              className="mt-1 size-4 accent-ink-900"
            />
            Tôi đã chuyển hoàn tiền cho khách (đánh dấu “Đã hoàn tiền”)
          </label>
        )}
        <Buttons busy={busy} onClose={onClose} label={text.button} danger />
      </form>
    </FormDialog>
  );
}
