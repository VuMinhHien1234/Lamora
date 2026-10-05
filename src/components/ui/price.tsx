import { formatVnd } from "@/lib/money";
import { cn } from "@/lib/utils";

type PriceProps = {
  price: number;
  /** Giá gốc; chỉ hiện (gạch ngang) khi lớn hơn giá bán. */
  compareAtPrice?: number | null;
  /** Thêm chữ "Từ" phía trước (sản phẩm có nhiều biến thể). */
  from?: boolean;
  className?: string;
};

export function Price({ price, compareAtPrice, from, className }: PriceProps) {
  const onSale = typeof compareAtPrice === "number" && compareAtPrice > price;
  return (
    <p className={cn("flex flex-wrap items-baseline gap-x-3 gap-y-1", className)}>
      {from && <span className="type-small text-stone-500">Từ</span>}
      <span className={cn("type-price", onSale ? "text-rose-700" : "text-ink-900")}>
        {formatVnd(price)}
      </span>
      {onSale && (
        <s className="type-small text-stone-500">
          <span className="sr-only">Giá gốc </span>
          {formatVnd(compareAtPrice)}
        </s>
      )}
    </p>
  );
}
