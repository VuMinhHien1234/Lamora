import type { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { ADMIN_ORDERS_PAGE_SIZE, type AdminOrderFilters } from "./admin-schema";
import { dateRange, normalizeOrderQuery } from "./order-search";
import type { OrderStatus } from "./status-flow";

/** Điều kiện lọc, không gồm trạng thái (để đếm số đơn theo từng tab). */
function baseWhere(filters: AdminOrderFilters): Prisma.OrderWhereInput {
  const { paymentStatus, paymentMethod, q, dateFrom, dateTo } = filters;
  const where: Prisma.OrderWhereInput = {};
  if (paymentStatus) where.paymentStatus = paymentStatus;
  if (paymentMethod) where.paymentMethod = paymentMethod;
  const range = dateRange(dateFrom, dateTo);
  if (range) where.createdAt = range;
  if (q) {
    const { text, exactCode } = normalizeOrderQuery(q);
    where.OR = [
      ...(exactCode ? [{ code: exactCode }] : []),
      { code: { contains: text.toUpperCase() } },
      { customerPhone: { contains: text.replaceAll(/[\s.]/g, "") } },
      { customerName: { contains: text, mode: "insensitive" } },
      { recipientName: { contains: text, mode: "insensitive" } },
    ];
  }
  return where;
}

const LIST_SELECT = {
  id: true,
  code: true,
  createdAt: true,
  customerName: true,
  customerPhone: true,
  total: true,
  paymentMethod: true,
  paymentStatus: true,
  status: true,
  preferredDeliveryDate: true,
  _count: { select: { items: true } },
} satisfies Prisma.OrderSelect;

export type OrderListRow = Prisma.OrderGetPayload<{ select: typeof LIST_SELECT }>;

export async function listOrders(
  filters: AdminOrderFilters,
): Promise<{ rows: OrderListRow[]; total: number }> {
  const where: Prisma.OrderWhereInput = {
    ...baseWhere(filters),
    ...(filters.status ? { status: filters.status } : {}),
  };
  const [rows, total] = await Promise.all([
    db.order.findMany({
      where,
      select: LIST_SELECT,
      orderBy: { createdAt: "desc" },
      skip: (filters.page - 1) * ADMIN_ORDERS_PAGE_SIZE,
      take: ADMIN_ORDERS_PAGE_SIZE,
    }),
    db.order.count({ where }),
  ]);
  return { rows, total };
}

/** Số đơn theo từng trạng thái, áp dụng các bộ lọc khác. */
export async function countByStatus(
  filters: AdminOrderFilters,
): Promise<Partial<Record<OrderStatus, number>>> {
  const groups = await db.order.groupBy({
    by: ["status"],
    where: baseWhere(filters),
    _count: { _all: true },
  });
  return Object.fromEntries(groups.map((g) => [g.status, g._count._all]));
}

const DETAIL_INCLUDE = {
  items: { orderBy: { id: "asc" } },
  statusHistory: {
    orderBy: { createdAt: "asc" },
    include: { changedBy: { select: { name: true } } },
  },
} satisfies Prisma.OrderInclude;

export type OrderDetailRow = Prisma.OrderGetPayload<{ include: typeof DETAIL_INCLUDE }>;

export function findOrderDetail(id: string): Promise<OrderDetailRow | null> {
  return db.order.findUnique({ where: { id }, include: DETAIL_INCLUDE });
}
