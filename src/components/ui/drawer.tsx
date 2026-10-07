"use client";

import { X } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type DrawerProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  /** Giỏ hàng: right · menu: left · bộ lọc trên điện thoại: bottom. */
  side?: "right" | "left" | "bottom";
  className?: string;
  children: ReactNode;
};

/** Ngăn trượt dựng trên thẻ <dialog>: tự khóa focus, đóng bằng phím Esc, bấm nền để đóng. */
export function Drawer({ open, onClose, title, side = "right", className, children }: DrawerProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="drawer"
      data-side={side}
      aria-label={title}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === ref.current) onClose();
      }}
    >
      <div className="flex h-full max-h-[inherit] flex-col">
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-sand-200 px-5">
          <h2 className="type-eyebrow">{title}</h2>
          <button
            type="button"
            aria-label="Đóng"
            onClick={onClose}
            className="-mr-3 grid size-11 place-items-center"
          >
            <X aria-hidden strokeWidth={1.25} className="size-5" />
          </button>
        </div>
        <div className={cn("min-h-0 flex-1 overflow-y-auto", className)}>{children}</div>
      </div>
    </dialog>
  );
}
