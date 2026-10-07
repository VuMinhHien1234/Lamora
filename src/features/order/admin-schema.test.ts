import { describe, expect, it } from "vitest";
import { adminListOrdersSchema, cancelOrderSchema, updateOrderStatusSchema } from "./admin-schema";

describe("adminListOrdersSchema", () => {
  it("mặc định trang 1, bỏ qua giá trị lạ trên URL", () => {
    const parsed = adminListOrdersSchema.parse({ status: "LUNG_TUNG", page: "abc", q: "  " });
    expect(parsed).toMatchObject({ status: undefined, page: 1, q: undefined });
  });

  it("nhận bộ lọc hợp lệ", () => {
    const parsed = adminListOrdersSchema.parse({
      status: "PENDING",
      paymentMethod: "BANK_TRANSFER",
      paymentStatus: "UNPAID",
      page: "3",
      dateFrom: "2026-10-01",
    });
    expect(parsed).toMatchObject({ status: "PENDING", page: 3, dateFrom: "2026-10-01" });
  });
});

describe("cancelOrderSchema", () => {
  it("bắt buộc có lý do", () => {
    expect(cancelOrderSchema.safeParse({ id: "x", reason: "  " }).success).toBe(false);
    expect(cancelOrderSchema.safeParse({ id: "x", reason: "Khách đổi ý" }).success).toBe(true);
  });
});

describe("updateOrderStatusSchema", () => {
  it("chỉ nhận trạng thái có trong hệ thống", () => {
    expect(updateOrderStatusSchema.safeParse({ id: "x", toStatus: "BAY_MAU" }).success).toBe(false);
    expect(
      updateOrderStatusSchema.safeParse({ id: "x", toStatus: "SHIPPING", carrier: "GHN" }).success,
    ).toBe(true);
  });
});
