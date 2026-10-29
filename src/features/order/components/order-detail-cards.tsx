import Image from "next/image";
import type { ReactNode } from "react";
import { CopyButton } from "@/components/ui/copy-button";
import { MoneyText } from "@/components/ui/money-text";
import { StatusBadge } from "@/components/ui/status-badge";
import { SHIPPING_FEE_ENABLED } from "@/config/shipping";
import type { AddressOption } from "@/features/shipping";
import { formatDate } from "@/lib/date";
import type { AdminOrderDetail } from "../admin-types";
import { STATUS_LABELS } from "../status-flow";
import { ShippingEditor } from "./shipping-editor";

function formatDay(iso: string): string {
  const [year, month, day] = iso.split("-");
  return `${day}/${month}/${year}`;
}

function dateTime(date: Date): string {
  return `${formatDate(date)} ${new Intl.DateTimeFormat("vi-VN", { timeZone: "Asia/Ho_Chi_Minh", hour: "2-digit", minute: "2-digit" }).format(date)}`;
}

export function Card({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="border border-sand-200 p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="type-eyebrow">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export function OrderHeader({ order }: { order: AdminOrderDetail }) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 className="type-h3">{order.code}</h2>
        <p className="type-small text-stone-500">Đặt lúc {dateTime(order.createdAt)}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge kind="order" status={order.status} />
        <StatusBadge kind="payment" status={order.paymentStatus} />
        <span className="type-small text-stone-500">
          {order.paymentMethod === "COD" ? "COD" : "Chuyển khoản"}
        </span>
      </div>
    </header>
  );
}

function ItemCard({ giftWrap, message }: { giftWrap: boolean; message: string | null }) {
  if (!giftWrap && !message) return null;
  return (
    <div className="mt-2 border-l-2 border-sand-200 pl-3">
      {giftWrap && <p className="type-small">🎁 Có gói quà</p>}
      {message && <p className="type-small whitespace-pre-wrap">💌 Thiệp: “{message}”</p>}
    </div>
  );
}

export function OrderItems({ order }: { order: AdminOrderDetail }) {
  return (
    <Card title="Sản phẩm (giá lúc đặt)">
      <ul className="divide-y divide-sand-200">
        {order.items.map((item, index) => (
          <li key={index} className="flex gap-3 py-3 first:pt-0 last:pb-0">
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
            <div className="min-w-0 flex-1">
              <p className="type-body">{item.productName}</p>
              {item.variantLabel && (
                <p className="type-small text-stone-500">{item.variantLabel}</p>
              )}
              <p className="type-small text-stone-500">
                SKU {item.sku} · <MoneyText amount={item.unitPrice} /> × {item.quantity}
              </p>
              <ItemCard giftWrap={item.giftWrap} message={item.cardMessage} />
            </div>
            <MoneyText amount={item.lineTotal} className="type-body" />
          </li>
        ))}
      </ul>
      <OrderTotals order={order} />
    </Card>
  );
}

function TotalRow({ label, amount, strong }: { label: string; amount: number; strong?: boolean }) {
  return (
    <div
      className={`flex justify-between ${strong ? "type-body border-t border-sand-200 pt-2 font-medium" : "type-small"}`}
    >
      <dt>{label}</dt>
      <dd>
        <MoneyText amount={amount} />
      </dd>
    </div>
  );
}

function OrderTotals({ order }: { order: AdminOrderDetail }) {
  return (
    <dl className="mt-4 flex flex-col gap-1 border-t border-sand-200 pt-3">
      <TotalRow label="Tạm tính" amount={order.subtotal} />
      {(SHIPPING_FEE_ENABLED || order.shippingFee > 0) && (
        <TotalRow label="Phí vận chuyển" amount={order.shippingFee} />
      )}
      {order.giftWrapFee > 0 && <TotalRow label="Gói quà" amount={order.giftWrapFee} />}
      {order.discountAmount > 0 && <TotalRow label="Giảm giá" amount={-order.discountAmount} />}
      <TotalRow label="Tổng cộng" amount={order.total} strong />
    </dl>
  );
}

export function CustomerCard({ order }: { order: AdminOrderDetail }) {
  return (
    <Card title="Người đặt">
      <p className="type-body font-medium">{order.customerName}</p>
      <p className="type-body">
        <a href={`tel:${order.customerPhone}`} className="link-underline">
          {order.customerPhone}
        </a>
        {" · "}
        <a
          href={`https://zalo.me/${order.customerPhone}`}
          target="_blank"
          rel="noopener noreferrer"
          className="link-underline"
        >
          Zalo
        </a>
      </p>
      {order.customerEmail && <p className="type-small text-stone-500">{order.customerEmail}</p>}
    </Card>
  );
}

export function ShippingCard({
  order,
  provinces,
}: {
  order: AdminOrderDetail;
  provinces: AddressOption[];
}) {
  return (
    <Card title="Giao hàng" action={<ShippingEditor order={order} provinces={provinces} />}>
      <p className="type-body font-medium">{order.recipientName}</p>
      <p className="type-body">
        <a href={`tel:${order.recipientPhone}`} className="link-underline">
          {order.recipientPhone}
        </a>
      </p>
      <div className="flex items-start justify-between gap-2">
        <p className="type-body">{order.addressText}</p>
        <CopyButton value={order.addressText} what="địa chỉ" />
      </div>
      {order.preferredDeliveryDate && (
        <p className="type-small text-stone-500">
          Ngày muốn nhận: {formatDay(order.preferredDeliveryDate)}
        </p>
      )}
      {(order.carrier || order.trackingCode) && (
        <p className="type-small mt-1">
          Vận chuyển: {order.carrier ?? "—"} · Mã vận đơn: {order.trackingCode ?? "—"}
        </p>
      )}
    </Card>
  );
}

export function NotesCards({ order }: { order: AdminOrderDetail }) {
  return (
    <>
      {order.giftMessage && (
        <Card title="Lời nhắn thiệp (đơn cũ)">
          <p className="type-body whitespace-pre-wrap">“{order.giftMessage}”</p>
        </Card>
      )}
      {order.customerNote && (
        <Card title="Ghi chú của khách">
          <p className="type-body whitespace-pre-wrap">{order.customerNote}</p>
        </Card>
      )}
      {order.cancelReason && (
        <Card title="Lý do hủy">
          <p className="type-body whitespace-pre-wrap">{order.cancelReason}</p>
        </Card>
      )}
    </>
  );
}

export function StatusHistory({ order }: { order: AdminOrderDetail }) {
  return (
    <Card title="Lịch sử">
      <ol className="flex flex-col gap-3">
        {order.history.map((entry) => (
          <li key={entry.id} className="border-l border-sand-300 pl-4">
            <p className="type-body">
              {entry.fromStatus && entry.fromStatus !== entry.toStatus
                ? `${STATUS_LABELS[entry.fromStatus]} → ${STATUS_LABELS[entry.toStatus]}`
                : STATUS_LABELS[entry.toStatus]}
            </p>
            {entry.note && <p className="type-small">{entry.note}</p>}
            <p className="type-small text-stone-500">
              {dateTime(entry.createdAt)}
              {entry.changedByName ? ` · ${entry.changedByName}` : ""}
            </p>
          </li>
        ))}
      </ol>
    </Card>
  );
}
