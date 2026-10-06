import { FREE_SHIPPING_THRESHOLD } from "@/config/shipping";
import { formatVnd } from "@/lib/money";

/** Thanh tiến độ miễn phí vận chuyển (mảnh 2px, docs/03). */
export function FreeShippingProgress({ subtotal }: { subtotal: number }) {
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const percent = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
  return (
    <div className="flex flex-col gap-2">
      <p className="type-small text-stone-500">
        {remaining === 0
          ? "Đơn hàng của bạn được miễn phí vận chuyển."
          : `Mua thêm ${formatVnd(remaining)} để được miễn phí vận chuyển.`}
      </p>
      <div
        role="progressbar"
        aria-label="Tiến độ miễn phí vận chuyển"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        className="h-0.5 bg-sand-200"
      >
        <div
          className="h-full bg-gold-500 transition-[width] duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
