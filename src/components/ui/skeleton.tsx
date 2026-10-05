import { cn } from "@/lib/utils";

/** Khối giữ chỗ khi đang tải: nhấp nháy rất nhẹ (100% ↔ 60%, 1.6s). */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("animate-[lamora-pulse_1.6s_ease-in-out_infinite] bg-ivory-100", className)}
    />
  );
}
