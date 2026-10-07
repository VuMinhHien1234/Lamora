import { LOW_STOCK_THRESHOLD } from "@/config/inventory";
import { vnDateString } from "@/lib/date";
import * as repo from "./repository";
import type { AdminSummary, SummaryRanges } from "./types";

const LOW_STOCK_LIMIT = 5;
const VN_OFFSET = "+07:00";

/** Đầu ngày hôm nay và đầu ngày của 6 ngày trước (tức 7 ngày gồm hôm nay), theo giờ Việt Nam. */
export function summaryRanges(now: Date): SummaryRanges {
  return {
    todayStart: new Date(`${vnDateString(now)}T00:00:00${VN_OFFSET}`),
    weekStart: new Date(`${vnDateString(now, -6)}T00:00:00${VN_OFFSET}`),
  };
}

export async function getAdminSummary(now: Date = new Date()): Promise<AdminSummary> {
  const [pendingOrders, unpaidTransferOrders, revenue, lowStock] = await Promise.all([
    repo.countPendingOrders(),
    repo.countUnpaidTransferOrders(),
    repo.sumRevenue(summaryRanges(now)),
    repo.listLowStock(LOW_STOCK_THRESHOLD, LOW_STOCK_LIMIT),
  ]);
  return {
    pendingOrders,
    unpaidTransferOrders,
    revenueToday: revenue.today,
    revenue7Days: revenue.week,
    lowStock,
  };
}

/** Kiểm tra sống: ném lỗi nếu không kết nối được cơ sở dữ liệu. */
export async function checkHealth(): Promise<void> {
  await repo.pingDatabase();
}
