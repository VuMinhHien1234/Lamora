import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type BadgeProps = {
  /** "soft": nhãn Mới/Bán chạy; "outline": nhãn Hết hàng. */
  tone?: "soft" | "outline";
  className?: string;
  children: ReactNode;
};

/** Đặt ở góc trên trái ảnh, cách 12px (class `absolute top-3 left-3`). */
export function Badge({ tone = "soft", className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        "type-eyebrow inline-block px-3 py-1.5",
        tone === "soft"
          ? "bg-blush-100 text-rose-700"
          : "border border-ink-900 bg-ivory-50 text-ink-900",
        className,
      )}
    >
      {children}
    </span>
  );
}
