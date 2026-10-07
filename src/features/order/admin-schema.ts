import { z } from "zod";
import { emptyToUndefined } from "@/lib/zod-helpers";
import { normalizePhone } from "@/lib/phone";

const ORDER_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "SHIPPING",
  "DELIVERED",
  "CANCELLED",
  "RETURNED",
] as const;
const PAYMENT_STATUSES = ["UNPAID", "PAID", "REFUNDED"] as const;
const PAYMENT_METHODS = ["COD", "BANK_TRANSFER"] as const;

export const ADMIN_ORDERS_PAGE_SIZE = 20;

const optional = <T extends z.ZodType>(schema: T) =>
  z.preprocess(emptyToUndefined, schema.optional());
const day = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

/** Bộ lọc nằm trên URL: giá trị lạ bị bỏ qua thay vì báo lỗi. */
export const adminListOrdersSchema = z.object({
  status: optional(z.enum(ORDER_STATUSES)).catch(undefined),
  paymentStatus: optional(z.enum(PAYMENT_STATUSES)).catch(undefined),
  paymentMethod: optional(z.enum(PAYMENT_METHODS)).catch(undefined),
  q: optional(z.string().trim().max(80)).catch(undefined),
  dateFrom: optional(day).catch(undefined),
  dateTo: optional(day).catch(undefined),
  page: z.coerce.number().int().min(1).max(10_000).catch(1).default(1),
});

export type AdminOrderFilters = z.infer<typeof adminListOrdersSchema>;

const idSchema = z.string().min(1).max(40);
const carrier = optional(z.string().trim().max(60, "Tối đa 60 ký tự"));
const note = optional(z.string().trim().max(500, "Tối đa 500 ký tự"));

export const updateOrderStatusSchema = z.object({
  id: idSchema,
  toStatus: z.enum(ORDER_STATUSES),
  note,
  carrier,
  trackingCode: carrier,
  markRefunded: z.boolean().optional(),
});

export const cancelOrderSchema = z.object({
  id: idSchema,
  reason: z
    .string("Vui lòng nhập lý do hủy đơn")
    .trim()
    .min(1, "Vui lòng nhập lý do hủy đơn")
    .max(500, "Tối đa 500 ký tự"),
  markRefunded: z.boolean().optional(),
});

export const markOrderPaidSchema = z.object({
  id: idSchema,
  paidAt: optional(z.coerce.date()),
});

const phone = z
  .string()
  .trim()
  .transform((value, ctx) => {
    const normalized = normalizePhone(value);
    if (!normalized) {
      ctx.addIssue({ code: "custom", message: "Số điện thoại chưa đúng" });
      return z.NEVER;
    }
    return normalized;
  });

export const updateOrderShippingSchema = z.object({
  id: idSchema,
  carrier,
  trackingCode: carrier,
  recipientName: optional(z.string().trim().min(2, "Vui lòng nhập tên").max(80)),
  recipientPhone: optional(phone),
  addressLine: optional(z.string().trim().min(3, "Vui lòng nhập địa chỉ").max(200)),
  provinceCode: optional(z.string().max(10)),
  wardCode: optional(z.string().max(10)),
});

export const updateAdminNoteSchema = z.object({
  id: idSchema,
  adminNote: z.string().trim().max(1000, "Tối đa 1000 ký tự"),
});

export type UpdateOrderShippingInput = z.infer<typeof updateOrderShippingSchema>;
