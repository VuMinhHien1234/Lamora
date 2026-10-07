import { db } from "@/lib/db";

/** Xóa các lần ghi giới hạn tần suất đã cũ hơn `before`. Trả số dòng đã xóa. */
export async function deleteRateLimitHitsBefore(before: Date): Promise<number> {
  const result = await db.rateLimitHit.deleteMany({ where: { createdAt: { lt: before } } });
  return result.count;
}

/** Xóa dấu IP (đã băm) khỏi các đơn đặt trước `before`. Trả số đơn đã cập nhật. */
export async function clearOrderIpHashBefore(before: Date): Promise<number> {
  const result = await db.order.updateMany({
    where: { createdAt: { lt: before }, ipHash: { not: null } },
    data: { ipHash: null },
  });
  return result.count;
}
