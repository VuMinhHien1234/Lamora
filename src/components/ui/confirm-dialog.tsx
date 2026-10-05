"use client";

import { useEffect, useRef } from "react";
import { Button } from "./button";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  /** Thao tác khó hoàn tác (hủy đơn, xóa): nút xác nhận màu đỏ. */
  danger?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

/** Hỏi lại trước thao tác khó hoàn tác (docs/06 mục 2). */
export function ConfirmDialog(props: ConfirmDialogProps) {
  const {
    open,
    title,
    description,
    confirmLabel,
    cancelLabel = "Quay lại",
    danger,
    loading,
  } = props;
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby="confirm-title"
      onClose={props.onCancel}
      className="m-auto w-[min(28rem,calc(100vw-2rem))] border border-sand-200 bg-ivory-50 p-6 text-ink-900 shadow-float backdrop:bg-ink-900/30"
    >
      <h2 id="confirm-title" className="type-h3">
        {title}
      </h2>
      <p className="type-body mt-3 text-stone-500">{description}</p>
      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button variant="subtle" onClick={props.onCancel} disabled={loading}>
          {cancelLabel}
        </Button>
        <Button
          variant={danger ? "danger" : "primary"}
          size="compact"
          loading={loading}
          onClick={props.onConfirm}
        >
          {confirmLabel}
        </Button>
      </div>
    </dialog>
  );
}
