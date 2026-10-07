"use client";

import { useEffect, useRef, type ReactNode } from "react";

type FormDialogProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
};

/** Hộp thoại chứa form (nhập lý do, mã vận đơn…). Đóng bằng Esc hoặc nút Quay lại. */
export function FormDialog({ open, title, onClose, children }: FormDialogProps) {
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
      aria-labelledby="form-dialog-title"
      onClose={onClose}
      className="m-auto max-h-[calc(100dvh-2rem)] w-[min(32rem,calc(100vw-2rem))] overflow-y-auto border border-sand-200 bg-ivory-50 p-6 text-ink-900 shadow-float backdrop:bg-ink-900/30"
    >
      <h2 id="form-dialog-title" className="type-h3">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </dialog>
  );
}
