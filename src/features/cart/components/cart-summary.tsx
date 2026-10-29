import { ButtonLink, Button } from "@/components/ui/button";
import { formatVnd } from "@/lib/money";
import { cn } from "@/lib/utils";
import { SHIPPING_FEE_ENABLED } from "@/config/shipping";
import { FreeShippingProgress } from "./free-shipping-progress";

type CartSummaryProps = {
  subtotal: number;
  /** Có dòng lỗi (hết hàng…) hoặc đang chưa có kết quả → khóa nút thanh toán. */
  blocked: boolean;
  loading: boolean;
  onNavigate?: () => void;
  /** false ở giỏ nhỏ: khách phải xem lại giỏ hàng rồi mới thanh toán. */
  showCheckout?: boolean;
  className?: string;
};

export function CartSummary({
  subtotal,
  blocked,
  loading,
  onNavigate,
  showCheckout = true,
  className,
}: CartSummaryProps) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {SHIPPING_FEE_ENABLED && <FreeShippingProgress subtotal={subtotal} />}
      <div className="flex items-baseline justify-between">
        <span className="type-body">Tạm tính</span>
        <span className={cn("type-price transition-opacity", loading && "opacity-50")}>
          {formatVnd(subtotal)}
        </span>
      </div>
      <p className="type-small text-stone-500">
        {SHIPPING_FEE_ENABLED
          ? "Phí vận chuyển được tính ở bước thanh toán."
          : "Phí vận chuyển shop sẽ báo khi liên hệ xác nhận đơn."}
      </p>
      {!showCheckout ? null : blocked ? (
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
