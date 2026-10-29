import Image from "next/image";
import { SHIPPING_FEE_ENABLED } from "@/config/shipping";
import { formatVnd } from "@/lib/money";
import type { OrderConfirmation } from "../types";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="type-body">{label}</dt>
      <dd className="type-body tabular-nums">{value}</dd>
    </div>
  );
}

function formatDay(iso: string): string {
  const [year, month, day] = iso.split("-");
  return `${day}/${month}/${year}`;
}

function RecapItems({ items }: { items: OrderConfirmation["items"] }) {
  return (
    <ul className="flex flex-col gap-4">
      {items.map((item, index) => (
        <li key={index} className="flex gap-3">
          <div className="relative aspect-[4/5] w-14 shrink-0 bg-ivory-100">
            {item.imageUrl && (
              <Image
                src={item.imageUrl}
                alt={item.productName}
                fill
                unoptimized
                sizes="56px"
                className="object-cover"
              />
            )}
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="type-body">{item.productName}</span>
            {item.variantLabel && (
              <span className="type-small text-stone-500">{item.variantLabel}</span>
            )}
            <span className="type-small text-stone-500">Số lượng: {item.quantity}</span>
          </div>
          <span className="type-body tabular-nums">{formatVnd(item.lineTotal)}</span>
        </li>
      ))}
    </ul>
  );
}

function RecapAddress({ order }: { order: OrderConfirmation }) {
  return (
    <div className="flex flex-col gap-1 border-t border-sand-200 pt-4">
      <p className="type-eyebrow text-stone-500">{order.isGift ? "Giao tặng" : "Giao đến"}</p>
      <p className="type-body font-medium">{order.recipientName}</p>
      <p className="type-body">{order.addressText}</p>
      {order.preferredDeliveryDate && (
        <p className="type-small text-stone-500">
          Ngày muốn nhận: {formatDay(order.preferredDeliveryDate)}
        </p>
      )}
      <p className="type-small text-stone-500">
        {order.paymentMethod === "COD"
          ? "Thanh toán khi nhận hàng (COD)"
          : "Chuyển khoản ngân hàng"}
      </p>
    </div>
  );
}

/** Tóm tắt đơn: sản phẩm, nơi giao, tiền. */
export function OrderRecap({ order }: { order: OrderConfirmation }) {
  return (
    <section
      aria-labelledby="recap-title"
      className="flex flex-col gap-6 border border-sand-200 p-6"
    >
      <h2 id="recap-title" className="type-h3">
        Chi tiết đơn hàng
      </h2>
      <RecapItems items={order.items} />
      <dl className="flex flex-col gap-2 border-t border-sand-200 pt-4">
        <Row label="Tạm tính" value={formatVnd(order.subtotal)} />
        {(SHIPPING_FEE_ENABLED || order.shippingFee > 0) && (
          <Row
            label="Phí vận chuyển"
            value={order.shippingFee === 0 ? "Miễn phí" : formatVnd(order.shippingFee)}
          />
        )}
        {order.giftWrapFee > 0 && <Row label="Gói quà" value={formatVnd(order.giftWrapFee)} />}
        <div className="flex items-baseline justify-between border-t border-sand-200 pt-3">
          <dt className="type-body font-medium">Tổng cộng</dt>
          <dd className="type-price">{formatVnd(order.total)}</dd>
        </div>
      </dl>
      {!SHIPPING_FEE_ENABLED && order.shippingFee === 0 && (
        <p className="type-small text-stone-500">
          Chưa gồm phí vận chuyển. Shop sẽ báo phí khi liên hệ xác nhận đơn.
        </p>
      )}
      <RecapAddress order={order} />
    </section>
  );
}
