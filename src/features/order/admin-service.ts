import { getZoneByProvince, resolveAddress } from "@/features/shipping";
import { cloudinaryUrl } from "@/lib/cloudinary";
import { AppError } from "@/lib/errors";
import * as repo from "./admin-repository";
import {
  ADMIN_ORDERS_PAGE_SIZE,
  type AdminOrderFilters,
  type UpdateOrderShippingInput,
} from "./admin-schema";
import type { AdminOrderDetail, AdminOrderList, AdminOrderRow, StatusCounts } from "./admin-types";
import { mutateOrder } from "./admin-write-repository";
import { planShippingEdit, type ResolvedShippingAddress } from "./shipping-edit";
import {
  allowedNextStatuses,
  planMarkPaid,
  planStatusChange,
  type OrderStatus,
  type StatusChangeInput,
} from "./status-flow";

const THUMB_WIDTH = 160;
const day = (date: Date | null): string | null => date?.toISOString().slice(0, 10) ?? null;

function toRow(row: repo.OrderListRow): AdminOrderRow {
  const { _count, preferredDeliveryDate, ...rest } = row;
  return { ...rest, itemCount: _count.items, preferredDeliveryDate: day(preferredDeliveryDate) };
}

function toCounts(counts: Partial<Record<OrderStatus, number>>): StatusCounts {
  const base: StatusCounts = {
    ALL: 0,
    PENDING: 0,
    CONFIRMED: 0,
    SHIPPING: 0,
    DELIVERED: 0,
    CANCELLED: 0,
    RETURNED: 0,
  };
  for (const [status, count] of Object.entries(counts)) {
    base[status as OrderStatus] = count;
    base.ALL += count;
  }
  return base;
}

/** M3: danh sách đơn kèm số đơn theo từng tab trạng thái. */
export async function listOrders(filters: AdminOrderFilters): Promise<AdminOrderList> {
  const [{ rows, total }, counts] = await Promise.all([
    repo.listOrders(filters),
    repo.countByStatus(filters),
  ]);
  return {
    rows: rows.map(toRow),
    total,
    page: filters.page,
    pageCount: Math.max(1, Math.ceil(total / ADMIN_ORDERS_PAGE_SIZE)),
    statusCounts: toCounts(counts),
  };
}

function toDetail(row: repo.OrderDetailRow): AdminOrderDetail {
  const { items, statusHistory, preferredDeliveryDate, wardName, provinceName, ...rest } = row;
  const status = row.status;
  return {
    ...rest,
    addressText: `${row.addressLine}, ${wardName}, ${provinceName}`,
    preferredDeliveryDate: day(preferredDeliveryDate),
    items: items.map((item) => ({
      productName: item.productName,
      variantLabel: item.variantLabel,
      sku: item.sku,
      unitPrice: item.unitPrice,
      quantity: item.quantity,
      lineTotal: item.lineTotal,
      cardMessage: item.cardMessage,
      giftWrap: item.giftWrap,
      imageUrl: item.imagePublicId
        ? cloudinaryUrl(item.imagePublicId, { width: THUMB_WIDTH })
        : null,
    })),
    history: statusHistory.map(({ changedBy, ...entry }) => ({
      id: entry.id,
      fromStatus: entry.fromStatus,
      toStatus: entry.toStatus,
      note: entry.note,
      createdAt: entry.createdAt,
      changedByName: changedBy?.name ?? null,
    })),
    nextStatuses: [...allowedNextStatuses(status)],
    canEditShipping: status === "PENDING" || status === "CONFIRMED",
    canMarkPaid: row.paymentStatus === "UNPAID" && status !== "CANCELLED" && status !== "RETURNED",
  };
}

/** M4: chi tiết một đơn. */
export async function getOrder(id: string): Promise<AdminOrderDetail> {
  const row = await repo.findOrderDetail(id);
  if (!row) throw new AppError("NOT_FOUND", "Không tìm thấy đơn hàng.");
  return toDetail(row);
}

export function changeStatus(
  id: string,
  input: StatusChangeInput,
  actorId: string,
): Promise<{ code: string }> {
  return mutateOrder(
    id,
    (order) => {
      const plan = planStatusChange(order, input, new Date());
      return {
        data: plan.data,
        restock: plan.restock,
        history: { fromStatus: plan.fromStatus, toStatus: plan.toStatus, note: plan.note },
      };
    },
    actorId,
  );
}

export function markPaid(
  id: string,
  paidAt: Date | undefined,
  actorId: string,
): Promise<{ code: string }> {
  return mutateOrder(
    id,
    (order) => {
      const plan = planMarkPaid(order, paidAt ?? new Date());
      return {
        data: plan.data,
        restock: [],
        history: { fromStatus: order.status, toStatus: order.status, note: plan.note },
      };
    },
    actorId,
  );
}

async function resolveNewAddress(
  input: UpdateOrderShippingInput,
): Promise<ResolvedShippingAddress | null> {
  const { provinceCode, wardCode } = input;
  if (!provinceCode && !wardCode) return null;
  const resolved = provinceCode && wardCode ? await resolveAddress(provinceCode, wardCode) : null;
  if (!provinceCode || !resolved) {
    throw new AppError(
      "INVALID_ADDRESS",
      "Địa chỉ chưa đúng, vui lòng chọn lại tỉnh và phường/xã.",
    );
  }
  return { ...resolved, zone: getZoneByProvince(provinceCode) };
}

export async function updateShipping(
  input: UpdateOrderShippingInput,
  actorId: string,
): Promise<{ code: string }> {
  const address = await resolveNewAddress(input);
  return mutateOrder(
    input.id,
    (order) => {
      const plan = planShippingEdit(order.status, input, address);
      return {
        data: plan.data,
        restock: [],
        history: { fromStatus: order.status, toStatus: order.status, note: plan.note },
      };
    },
    actorId,
  );
}

export function setAdminNote(
  id: string,
  adminNote: string,
  actorId: string,
): Promise<{ code: string }> {
  return mutateOrder(
    id,
    () => ({
      data: { adminNote: adminNote === "" ? null : adminNote },
      restock: [],
      history: null,
    }),
    actorId,
  );
}
