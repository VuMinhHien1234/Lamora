import Link from "next/link";
import { cn } from "@/lib/utils";
import type { StatusCounts } from "../admin-types";
import { buildOrderListUrl, type OrderListFilters } from "../list-url";

const TABS = [
  { value: undefined, key: "ALL", label: "Tất cả" },
  { value: "PENDING", key: "PENDING", label: "Chờ xác nhận" },
  { value: "CONFIRMED", key: "CONFIRMED", label: "Đã xác nhận" },
  { value: "SHIPPING", key: "SHIPPING", label: "Đang giao" },
  { value: "DELIVERED", key: "DELIVERED", label: "Đã giao" },
  { value: "CANCELLED", key: "CANCELLED", label: "Đã hủy" },
  { value: "RETURNED", key: "RETURNED", label: "Hoàn hàng" },
] as const;

type Props = { filters: OrderListFilters; counts: StatusCounts };

/** Tab trạng thái kèm số đơn; đổi tab thì về trang 1 và giữ các bộ lọc khác. */
export function OrderStatusTabs({ filters, counts }: Props) {
  return (
    <nav
      aria-label="Lọc theo trạng thái"
      className="-mx-4 mb-5 flex overflow-x-auto border-b border-sand-200 px-4 sm:mx-0 sm:px-0"
    >
      {TABS.map((tab) => {
        const active = (filters.status ?? undefined) === tab.value;
        return (
          <Link
            key={tab.key}
            href={buildOrderListUrl(filters, { status: tab.value, page: 1 })}
            aria-current={active ? "page" : undefined}
            className={cn(
              "type-eyebrow -mb-px min-h-11 shrink-0 border-b px-4 py-3 whitespace-nowrap transition-colors duration-300",
              active
                ? "border-ink-900 text-ink-900"
                : "border-transparent text-stone-500 hover:text-ink-900",
            )}
          >
            {tab.label} <span className="tabular-nums">({counts[tab.key]})</span>
          </Link>
        );
      })}
    </nav>
  );
}
