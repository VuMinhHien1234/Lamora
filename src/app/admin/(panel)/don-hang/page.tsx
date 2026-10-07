import type { Metadata } from "next";
import { requireAdminPage } from "@/features/auth";
import { adminListOrders, OrderListView } from "@/features/order";

export const metadata: Metadata = { title: "Đơn hàng" };

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

/** Chỉ lấy giá trị chuỗi đầu tiên của mỗi tham số trên địa chỉ. */
function firstValues(
  raw: Record<string, string | string[] | undefined>,
): Record<string, string | undefined> {
  return Object.fromEntries(
    Object.entries(raw).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value]),
  );
}

// M3 — Danh sách đơn hàng (docs/06 mục 5).
export default async function OrdersPage({ searchParams }: PageProps) {
  await requireAdminPage();
  const params = firstValues(await searchParams);
  const result = await adminListOrders(params);
  const filters = {
    status: params.status || undefined,
    paymentStatus: params.paymentStatus || undefined,
    paymentMethod: params.paymentMethod || undefined,
    q: params.q?.trim() || undefined,
    dateFrom: params.dateFrom || undefined,
    dateTo: params.dateTo || undefined,
    page: result.page,
  };
  return <OrderListView result={result} filters={filters} />;
}
