import { formatVnd } from "@/lib/money";
import { cn } from "@/lib/utils";

/** Số tiền VND dạng chữ thường (bảng, danh sách). Dùng <Price> cho giá bán của sản phẩm. */
export function MoneyText({ amount, className }: { amount: number; className?: string }) {
  return <span className={cn("tabular-nums", className)}>{formatVnd(amount)}</span>;
}
