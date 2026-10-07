import Image from "next/image";
import { GIFT_WRAP_FEE } from "@/config/shipping";
import type { CartValidation } from "@/features/cart";
import { formatVnd } from "@/lib/money";

type OrderSummaryProps = {
  validation: CartValidation | null;
  /** null = chưa chọn tỉnh hoặc đang tính. */
  shippingFee: number | null;
  /** Số sản phẩm được chọn gói quà. */
  wrapCount: number;
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="type-body">{label}</dt>
      <dd className="type-body tabular-nums">{value}</dd>
    </div>
  );
}

function SummaryLines({ validation }: { validation: CartValidation }) {
  return (
    <ul className="flex flex-col gap-4">
      {validation.lines.map((line) => (
        <li key={line.variantId} className="flex gap-3">
          <div className="relative aspect-[4/5] w-14 shrink-0 bg-ivory-100">
            {line.imageUrl && (
              <Image
                src={line.imageUrl}
                alt={line.productName}
                fill
                unoptimized
                sizes="56px"
                className="object-cover"
              />
            )}
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="type-small line-clamp-2">{line.productName}</span>
            {line.variantLabel && (
              <span className="type-small text-stone-500">{line.variantLabel}</span>
            )}
            <span className="type-small text-stone-500">Số lượng: {line.quantity}</span>
          </div>
          <span className="type-small tabular-nums">{formatVnd(line.lineTotal)}</span>
        </li>
      ))}
    </ul>
  );
}

/** Tóm tắt đơn (S8). Số tiền chỉ để xem; server tính lại khi đặt hàng. */
export function OrderSummary({ validation, shippingFee, wrapCount }: OrderSummaryProps) {
  if (!validation) return <p className="type-small text-stone-500">Đang tải đơn hàng…</p>;
  const wrapFee = wrapCount * GIFT_WRAP_FEE;
  const total = validation.subtotal + (shippingFee ?? 0) + wrapFee;
  return (
    <div className="flex flex-col gap-5">
      <SummaryLines validation={validation} />
      <dl className="flex flex-col gap-2 border-t border-sand-200 pt-4">
        <Row label="Tạm tính" value={formatVnd(validation.subtotal)} />
        <Row
          label="Phí vận chuyển"
          value={
            shippingFee === null
              ? "Chọn tỉnh để tính"
              : shippingFee === 0
                ? "Miễn phí"
                : formatVnd(shippingFee)
          }
        />
        {wrapFee > 0 && <Row label="Gói quà" value={formatVnd(wrapFee)} />}
      </dl>
      <div className="flex items-baseline justify-between border-t border-sand-200 pt-4">
        <span className="type-body font-medium">Tổng cộng</span>
        <span className="type-price">{formatVnd(total)}</span>
      </div>
    </div>
  );
}
