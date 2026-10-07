import { requireAdmin } from "@/features/auth";
import { adminListOrdersSchema } from "./admin-schema";
import * as service from "./admin-service";
import type { AdminOrderDetail, AdminOrderList } from "./admin-types";

/** 🔐 Bảng đơn hàng (M3). Bộ lọc lạ trên URL bị bỏ qua. */
export async function adminListOrders(input: unknown): Promise<AdminOrderList> {
  await requireAdmin();
  return service.listOrders(adminListOrdersSchema.parse(input ?? {}));
}

/** 🔐 Chi tiết đơn (M4). Không có → ném NOT_FOUND để trang gọi `notFound()`. */
export async function adminGetOrder(id: string): Promise<AdminOrderDetail> {
  await requireAdmin();
  return service.getOrder(id);
}
