import { AdminPageHeader } from "@/components/layout/admin-page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import type { AdminOrderList } from "../admin-types";
import { buildOrderListUrl, type OrderListFilters } from "../list-url";
import { OrderFilters } from "./order-filters";
import { OrderStatusTabs } from "./order-status-tabs";
import { OrderCards, OrderTable } from "./order-table";

type Props = { result: AdminOrderList; filters: OrderListFilters };

function Results({ result, filters }: Props) {
  if (result.rows.length === 0) {
    const filtered = Boolean(
      filters.status ||
      filters.q ||
      filters.paymentStatus ||
      filters.paymentMethod ||
      filters.dateFrom ||
      filters.dateTo,
    );
    return (
      <EmptyState
        title={filtered ? "Không có đơn phù hợp" : "Chưa có đơn hàng nào"}
        description={
          filtered ? "Thử đổi từ khóa hoặc bỏ bớt bộ lọc." : "Đơn khách đặt trên web sẽ hiện ở đây."
        }
      />
    );
  }
  const now = new Date();
  return (
    <>
      <OrderTable rows={result.rows} now={now} />
      <OrderCards rows={result.rows} now={now} />
      <Pagination
        page={result.page}
        pageCount={result.pageCount}
        hrefFor={(page) => buildOrderListUrl(filters, { page })}
      />
    </>
  );
}

/** Màn hình M3: danh sách đơn hàng (docs/06 mục 5). Bộ lọc nằm trên địa chỉ trang. */
export function OrderListView({ result, filters }: Props) {
  return (
    <>
      <AdminPageHeader title="Đơn hàng" description={`${result.total} đơn`} />
      <OrderStatusTabs filters={filters} counts={result.statusCounts} />
      <OrderFilters filters={filters} />
      <Results result={result} filters={filters} />
    </>
  );
}
