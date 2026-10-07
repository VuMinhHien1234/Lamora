import { cn } from "@/lib/utils";

type DividerProps = {
  /** "line": đường kẻ 1px; "ornament": đường vàng 48px có ✿ ở giữa (dưới tiêu đề khối quan trọng). */
  variant?: "line" | "ornament";
  className?: string;
};

export function Divider({ variant = "line", className }: DividerProps) {
  if (variant === "line")
    return <hr className={cn("border-0 border-t border-sand-200", className)} />;
  return (
    <div
      aria-hidden
      className={cn("flex items-center justify-center gap-3 text-gold-500", className)}
    >
      <span className="h-px w-12 bg-gold-500" />
      <span className="text-sm leading-none">✿</span>
      <span className="h-px w-12 bg-gold-500" />
    </div>
  );
}

/** Đường vàng mảnh dài 48px, căn giữa. */
export function GoldRule({ className }: { className?: string }) {
  return <div aria-hidden className={cn("mx-auto h-px w-12 bg-gold-500", className)} />;
}
