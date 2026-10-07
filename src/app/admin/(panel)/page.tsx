import { AdminPageHeader } from "@/components/layout/admin-page-header";
import { getAdminSummary, LowStockList, PendingOrdersList, StatCards } from "@/features/dashboard";
import { adminListOrders } from "@/features/order";

export const dynamic = "force-dynamic";

/** M2 — Tổng quan (docs/06 mục 4). */
export default async function AdminHomePage() {
  const [summary, pending] = await Promise.all([
    getAdminSummary(),
    adminListOrders({ status: "PENDING" }),
  ]);
  return (
    <>
      <AdminPageHeader title="Tổng quan" />
      <div className="flex flex-col gap-6">
        <StatCards summary={summary} now={new Date()} />
        <div className="grid gap-6 lg:grid-cols-2">
          <PendingOrdersList rows={pending.rows.slice(0, 5)} />
          <LowStockList items={summary.lowStock} />
        </div>
      </div>
    </>
  );
}
