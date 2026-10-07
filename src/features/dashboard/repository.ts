import type { OrderStatus } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import type { LowStockItem, SummaryRanges } from "./types";

const COUNTED: { notIn: OrderStatus[] } = { notIn: ["CANCELLED", "RETURNED"] };

async function revenueSince(from: Date): Promise<number> {
  const sum = await db.order.aggregate({
    _sum: { total: true },
    where: { createdAt: { gte: from }, status: COUNTED },
  });
  return sum._sum?.total ?? 0;
}

export async function countPendingOrders(): Promise<number> {
  return db.order.count({ where: { status: "PENDING" } });
}

/** Đơn chuyển khoản chưa nhận tiền và còn hiệu lực (chưa hủy/hoàn). */
export async function countUnpaidTransferOrders(): Promise<number> {
  return db.order.count({
    where: { paymentMethod: "BANK_TRANSFER", paymentStatus: "UNPAID", status: COUNTED },
  });
}

export async function sumRevenue(ranges: SummaryRanges): Promise<{ today: number; week: number }> {
  const [today, week] = await Promise.all([
    revenueSince(ranges.todayStart),
    revenueSince(ranges.weekStart),
  ]);
  return { today, week };
}

/** Biến thể đang bán của sản phẩm đang bán, tồn ≤ ngưỡng, ít nhất lên trước. */
export async function listLowStock(threshold: number, limit: number): Promise<LowStockItem[]> {
  const rows = await db.productVariant.findMany({
    where: { isActive: true, stockQuantity: { lte: threshold }, product: { status: "ACTIVE" } },
    orderBy: [{ stockQuantity: "asc" }, { sku: "asc" }],
    take: limit,
    select: {
      id: true,
      sku: true,
      colorName: true,
      size: true,
      stockQuantity: true,
      product: { select: { id: true, name: true } },
    },
  });
  return rows.map((row) => ({
    variantId: row.id,
    productId: row.product.id,
    productName: row.product.name,
    variantLabel: [row.colorName, row.size].filter(Boolean).join(" · ") || null,
    sku: row.sku,
    stockQuantity: row.stockQuantity,
  }));
}

/** Kiểm tra kết nối cơ sở dữ liệu cho `/api/health`. */
export async function pingDatabase(): Promise<void> {
  await db.$queryRaw`SELECT 1`;
}
