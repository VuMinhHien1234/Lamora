import Link from "next/link";
import { MoneyText } from "@/components/ui/money-text";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDate } from "@/lib/date";
import type { AdminOrderRow } from "../admin-types";
import { isDeliverySoon } from "../order-search";
import { OrderQuickActions } from "./order-quick-actions";

const METHOD_LABEL = { COD: "COD", BANK_TRANSFER: "Chuyển khoản" } as const;
const TH = "type-eyebrow px-3 py-3 text-left font-normal text-stone-500";
const TD = "px-3 py-3 align-middle";

function formatDay(iso: string): string {
  const [year, month, day] = iso.split("-");
  return `${day}/${month}/${year}`;
}

function DeliveryText({ row, now }: { row: AdminOrderRow; now: Date }) {
  if (!row.preferredDeliveryDate) return <span className="text-stone-500">—</span>;
  const soon =
    isDeliverySoon(row.preferredDeliveryDate, now) &&
    row.status !== "DELIVERED" &&
    row.status !== "CANCELLED";
  return (
    <span className={soon ? "font-medium text-rose-700" : undefined}>
      {formatDay(row.preferredDeliveryDate)}
      {soon && <span className="type-small block">Giao sớm</span>}
    </span>
  );
}

function PaymentCell({ row }: { row: AdminOrderRow }) {
  return (
    <div className="flex flex-col items-start gap-1">
      <span className="type-small text-stone-500">{METHOD_LABEL[row.paymentMethod]}</span>
      <StatusBadge kind="payment" status={row.paymentStatus} />
    </div>
  );
}

function OrderTableRow({ row, now }: { row: AdminOrderRow; now: Date }) {
  return (
    <tr className="border-b border-sand-200 transition-colors duration-300 hover:bg-ivory-100">
      <td className={TD}>
        <Link
          href={`/admin/don-hang/${row.id}`}
          className="link-underline font-medium whitespace-nowrap"
        >
          {row.code}
        </Link>
        <span className="type-small block text-stone-500">{formatDate(row.createdAt)}</span>
      </td>
      <td className={TD}>
        <span className="block">{row.customerName}</span>
        <span className="type-small block text-stone-500">
          {row.customerPhone} · {row.itemCount} sản phẩm
        </span>
      </td>
      <td className={`${TD} text-right`}>
        <MoneyText amount={row.total} />
      </td>
      <td className={TD}>
        <PaymentCell row={row} />
      </td>
      <td className={TD}>
        <StatusBadge kind="order" status={row.status} />
      </td>
      <td className={TD}>
        <DeliveryText row={row} now={now} />
      </td>
      <td className={TD}>
        <OrderQuickActions row={row} />
      </td>
    </tr>
  );
}

/** Bảng cho màn hình rộng (≥ 768px). Điện thoại dùng OrderCards. */
export function OrderTable({ rows, now }: { rows: AdminOrderRow[]; now: Date }) {
  return (
    <table className="hidden w-full border-collapse text-[0.875rem] md:table">
      <thead>
        <tr className="border-b border-sand-200">
          <th className={TH}>Mã đơn</th>
          <th className={TH}>Khách</th>
          <th className={`${TH} text-right`}>Tổng tiền</th>
          <th className={TH}>Thanh toán</th>
          <th className={TH}>Trạng thái</th>
          <th className={TH}>Ngày nhận</th>
          <th className={TH}>
            <span className="sr-only">Thao tác</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <OrderTableRow key={row.id} row={row} now={now} />
        ))}
      </tbody>
    </table>
  );
}

/** Thẻ cho điện thoại (docs/03 mục 10: bảng chuyển thành thẻ). */
export function OrderCards({ rows, now }: { rows: AdminOrderRow[]; now: Date }) {
  return (
    <ul className="md:hidden">
      {rows.map((row) => (
        <li key={row.id} className="border-b border-sand-200 py-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <Link href={`/admin/don-hang/${row.id}`} className="link-underline font-medium">
                {row.code}
              </Link>
              <p className="type-small text-stone-500">{formatDate(row.createdAt)}</p>
            </div>
            <StatusBadge kind="order" status={row.status} />
          </div>
          <p className="type-body mt-2">
            {row.customerName} · <span className="text-stone-500">{row.customerPhone}</span>
          </p>
          <dl className="type-small mt-2 grid grid-cols-3 gap-2 text-stone-500">
            <div>
              <dt>Tổng tiền</dt>
              <dd className="text-ink-900">
                <MoneyText amount={row.total} />
              </dd>
            </div>
            <div>
              <dt>Thanh toán</dt>
              <dd>
                <PaymentCell row={row} />
              </dd>
            </div>
            <div>
              <dt>Ngày nhận</dt>
              <dd className="text-ink-900">
                <DeliveryText row={row} now={now} />
              </dd>
            </div>
          </dl>
          <div className="mt-3">
            <OrderQuickActions row={row} />
          </div>
        </li>
      ))}
    </ul>
  );
}
