import Link from "next/link";
import type { AdminOrderRow } from "@/features/order";
import { formatVnd } from "@/lib/money";

function timeText(date: Date): string {
  return new Intl.DateTimeFormat("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

/** 5 đơn chờ xác nhận mới nhất; bấm vào mở chi tiết đơn (M4). */
export function PendingOrdersList({ rows }: { rows: AdminOrderRow[] }) {
  return (
    <section className="border border-sand-200 p-5">
      <div className="mb-4 flex items-baseline justify-between gap-4">
        <h2 className="type-h3">Đơn chờ xác nhận</h2>
        <Link href="/admin/don-hang?status=PENDING" className="type-small underline">
          Xem tất cả
        </Link>
      </div>
      {rows.length === 0 ? (
        <p className="type-body text-stone-500">Không có đơn nào đang chờ. 🌸</p>
      ) : (
        <ul className="flex flex-col divide-y divide-sand-200">
          {rows.map((row) => (
            <li key={row.id}>
              <Link
                href={`/admin/don-hang/${row.id}`}
                className="flex min-h-11 items-center justify-between gap-4 py-3 hover:text-rose-700"
              >
                <span className="type-body">
                  {row.customerName}
                  <span className="type-small block text-stone-500">
                    {row.code} · {timeText(row.createdAt)}
                  </span>
                </span>
                <span className="type-body shrink-0 tabular-nums">{formatVnd(row.total)}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
