import { ButtonLink, Button } from "@/components/ui/button";
import { formatVnd } from "@/lib/money";
import { cn } from "@/lib/utils";
import { FreeShippingProgress } from "./free-shipping-progress";

type CartSummaryProps = {
  subtotal: number;
  /** Có dòng lỗi (hết hàng…) hoặc đang chưa có kết quả → khóa nút thanh toán. */
  blocked: boolean;
  loading: boolean;
  onNavigate?: () => void;
  className?: string;
};

export function CartSummary({
  subtotal,
  blocked,
  loading,
  onNavigate,
  className,
}: CartSummaryProps) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <FreeShippingProgress subtotal={subtotal} />
      <div className="flex items-baseline justify-between">
        <span className="type-body">Tạm tính</span>
        <span className={cn("type-price transition-opacity", loading && "opacity-50")}>
          {formatVnd(subtotal)}
        </span>
      </div>
      <p className="type-small text-stone-500">Phí vận chuyển được tính ở bước thanh toán.</p>
      {blocked ? (
        <Button fullWidth disabled>
          Thanh toán
        </Button>
      ) : (
        <ButtonLink href="/thanh-toan" fullWidth onClick={onNavigate}>
          Thanh toán
        </ButtonLink>
      )}
    </div>
  );
}
