import type { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import type { OrderDraft, OrderVariantSnapshot, PlaceOrderResult, PlanResult } from "./types";

const MAX_CODE_ATTEMPTS = 5;

type Tx = Prisma.TransactionClient;

export function countOrdersByIpSince(ipHash: string, since: Date): Promise<number> {
  return db.order.count({ where: { ipHash, createdAt: { gte: since } } });
}

/** Khóa dòng các biến thể (chống hai khách mua cùng món cuối cùng) rồi đọc dữ liệu. */
async function lockAndReadVariants(tx: Tx, ids: string[]): Promise<OrderVariantSnapshot[]> {
  await tx.$queryRaw`SELECT id FROM "ProductVariant" WHERE id = ANY(${ids}) FOR UPDATE`;
  return tx.productVariant.findMany({
    where: { id: { in: ids } },
    select: {
      id: true,
      colorName: true,
      size: true,
      sku: true,
      price: true,
      stockQuantity: true,
      isActive: true,
      product: {
        select: {
          id: true,
          name: true,
          status: true,
          images: { orderBy: { sortOrder: "asc" }, select: { publicId: true, variantId: true } },
        },
      },
    },
  });
}

async function uniqueCode(tx: Tx, makeCode: () => string): Promise<string> {
  for (let attempt = 0; attempt < MAX_CODE_ATTEMPTS; attempt++) {
    const code = makeCode();
    const exists = await tx.order.findUnique({ where: { code }, select: { id: true } });
    if (!exists) return code;
  }
  throw new Error("Không sinh được mã đơn duy nhất");
}

function orderData(draft: OrderDraft, code: string): Prisma.OrderCreateInput {
  const { items, ...fields } = draft;
  return {
    ...fields,
    code,
    items: { create: items },
    statusHistory: { create: { fromStatus: null, toStatus: "PENDING", note: "Khách đặt hàng" } },
  };
}

/**
 * Một transaction: khóa biến thể → `plan` kiểm tra và tính tiền → tạo đơn + dòng hàng + lịch sử → trừ kho.
 * Nếu `plan` báo lỗi thì không ghi gì.
 */
export function placeOrder(
  variantIds: string[],
  plan: (variants: OrderVariantSnapshot[]) => PlanResult,
  makeCode: () => string,
): Promise<PlaceOrderResult> {
  return db.$transaction(async (tx): Promise<PlaceOrderResult> => {
    const planned = plan(await lockAndReadVariants(tx, variantIds));
    if (!planned.ok) return planned;
    const { draft } = planned;
    const code = await uniqueCode(tx, makeCode);
    const order = await tx.order.create({ data: orderData(draft, code), select: { id: true } });
    for (const item of draft.items) {
      await tx.productVariant.update({
        where: { id: item.variantId },
        data: { stockQuantity: { decrement: item.quantity } },
      });
    }
    return {
      ok: true,
      order: { id: order.id, code, total: draft.total, paymentMethod: draft.paymentMethod },
    };
  });
}
