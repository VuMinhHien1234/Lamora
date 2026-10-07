import Link from "next/link";
import { formatVnd } from "@/lib/money";
import { vnDateString } from "@/lib/date";
import type { AdminSummary } from "../types";

type Card = { label: string; value: string; href: string; attention: boolean };

function buildCards(summary: AdminSummary, now: Date): Card[] {
  const today = vnDateString(now);
  const weekFrom = vnDateString(now, -6);
  return [
    {
      label: "Đơn chờ xác nhận",
      value: String(summary.pendingOrders),
      href: "/admin/don-hang?status=PENDING",
      attention: summary.pendingOrders > 0,
    },
    {
      label: "Chuyển khoản chưa thanh toán",
      value: String(summary.unpaidTransferOrders),
      href: "/admin/don-hang?paymentMethod=BANK_TRANSFER&paymentStatus=UNPAID",
      attention: summary.unpaidTransferOrders > 0,
    },
    {
      label: "Doanh thu hôm nay",
      value: formatVnd(summary.revenueToday),
      href: `/admin/don-hang?dateFrom=${today}&dateTo=${today}`,
      attention: false,
    },
    {
      label: "Doanh thu 7 ngày",
      value: formatVnd(summary.revenue7Days),
      href: `/admin/don-hang?dateFrom=${weekFrom}&dateTo=${today}`,
      attention: false,
    },
  ];
}

/** Bốn thẻ số liệu; bấm vào mở danh sách đơn đã lọc sẵn (docs/06 mục 4). */
export function StatCards({ summary, now }: { summary: AdminSummary; now: Date }) {
  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {buildCards(summary, now).map((card) => (
        <li key={card.label}>
          <Link
            href={card.href}
            className="flex h-full min-h-11 flex-col gap-2 border border-sand-200 p-5 transition-colors duration-300 hover:border-ink-900"
          >
            <span className="type-eyebrow text-stone-500">{card.label}</span>
            <span
              className={`type-h2 tabular-nums ${card.attention ? "text-rose-700" : "text-ink-900"}`}
            >
              {card.value}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
