"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/features/auth";
import { ok, toErrorResult, type ActionResult } from "@/lib/result";
import {
  cancelOrderSchema,
  markOrderPaidSchema,
  updateAdminNoteSchema,
  updateOrderShippingSchema,
  updateOrderStatusSchema,
} from "./admin-schema";
import * as service from "./admin-service";

const LIST_PATH = "/admin/don-hang";

function refresh(id: string): void {
  revalidatePath(LIST_PATH);
  revalidatePath(`${LIST_PATH}/${id}`);
  revalidatePath("/admin");
}

/** 🔐 Đổi trạng thái đơn theo luồng hợp lệ (docs/02 mục 2). Hủy/hoàn thì cộng lại kho. */
export async function updateOrderStatus(input: unknown): Promise<ActionResult<{ code: string }>> {
  try {
    const admin = await requireAdmin();
    const { id, ...rest } = updateOrderStatusSchema.parse(input);
    const result = await service.changeStatus(id, rest, admin.id);
    refresh(id);
    return ok(result);
  } catch (error) {
    return toErrorResult(error);
  }
}

/** 🔐 Hủy đơn, bắt buộc có lý do. */
export async function cancelOrder(input: unknown): Promise<ActionResult<{ code: string }>> {
  try {
    const admin = await requireAdmin();
    const { id, reason, markRefunded } = cancelOrderSchema.parse(input);
    const result = await service.changeStatus(
      id,
      { toStatus: "CANCELLED", note: reason, markRefunded },
      admin.id,
    );
    refresh(id);
    return ok(result);
  } catch (error) {
    return toErrorResult(error);
  }
}

/** 🔐 Xác nhận đã nhận tiền chuyển khoản. */
export async function markOrderPaid(input: unknown): Promise<ActionResult<{ code: string }>> {
  try {
    const admin = await requireAdmin();
    const { id, paidAt } = markOrderPaidSchema.parse(input);
    const result = await service.markPaid(id, paidAt, admin.id);
    refresh(id);
    return ok(result);
  } catch (error) {
    return toErrorResult(error);
  }
}

/** 🔐 Sửa người nhận, địa chỉ, đơn vị vận chuyển. Không tính lại phí ship. */
export async function updateOrderShippingInfo(
  input: unknown,
): Promise<ActionResult<{ code: string }>> {
  try {
    const admin = await requireAdmin();
    const parsed = updateOrderShippingSchema.parse(input);
    const result = await service.updateShipping(parsed, admin.id);
    refresh(parsed.id);
    return ok(result);
  } catch (error) {
    return toErrorResult(error);
  }
}

/** 🔐 Ghi chú nội bộ của chủ shop. */
export async function updateAdminNote(input: unknown): Promise<ActionResult<{ code: string }>> {
  try {
    const admin = await requireAdmin();
    const { id, adminNote } = updateAdminNoteSchema.parse(input);
    const result = await service.setAdminNote(id, adminNote, admin.id);
    revalidatePath(`${LIST_PATH}/${id}`);
    return ok(result);
  } catch (error) {
    return toErrorResult(error);
  }
}
