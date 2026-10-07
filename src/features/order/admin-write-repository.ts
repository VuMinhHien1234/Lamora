import type { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { AppError } from "@/lib/errors";
import type { OrderForTransition, OrderStatus } from "./status-flow";

type Tx = Prisma.TransactionClient;

/** Việc cần ghi sau khi đã kiểm tra: tính sẵn bằng hàm thuần, repository chỉ ghi. */
export type OrderMutation = {
  data: Prisma.OrderUpdateInput;
  restock: { variantId: string; quantity: number }[];
  history: { fromStatus: OrderStatus | null; toStatus: OrderStatus; note: string } | null;
};

export type LockedOrder = OrderForTransition & {
  id: string;
  code: string;
};

async function lockAndRead(tx: Tx, id: string): Promise<LockedOrder> {
  await tx.$queryRaw`SELECT id FROM "Order" WHERE id = ${id} FOR UPDATE`;
  const order = await tx.order.findUnique({
    where: { id },
    select: {
      id: true,
      code: true,
      status: true,
      paymentStatus: true,
      paymentMethod: true,
      items: { select: { variantId: true, quantity: true } },
    },
  });
  if (!order) throw new AppError("NOT_FOUND", "Không tìm thấy đơn hàng.");
  return order;
}

async function restock(tx: Tx, items: OrderMutation["restock"]): Promise<void> {
  for (const { variantId, quantity } of items) {
    await tx.productVariant.update({
      where: { id: variantId },
      data: { stockQuantity: { increment: quantity } },
    });
  }
}

/**
 * Khóa dòng đơn → `plan` kiểm tra và tính thay đổi → ghi đơn, cộng lại kho, ghi lịch sử, tất cả trong một transaction.
 * `plan` ném AppError thì không ghi gì.
 */
export function mutateOrder(
  id: string,
  plan: (order: LockedOrder) => OrderMutation,
  actorId: string,
): Promise<{ code: string }> {
  return db.$transaction(async (tx) => {
    const order = await lockAndRead(tx, id);
    const mutation = plan(order);
    await tx.order.update({ where: { id }, data: mutation.data });
    await restock(tx, mutation.restock);
    if (mutation.history) {
      await tx.orderStatusHistory.create({
        data: { orderId: id, changedById: actorId, ...mutation.history },
      });
    }
    return { code: order.code };
  });
}
