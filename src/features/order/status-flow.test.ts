import { describe, expect, it } from "vitest";
import {
  allowedNextStatuses,
  canTransition,
  planMarkPaid,
  planStatusChange,
  type OrderForTransition,
  type OrderStatus,
} from "./status-flow";

const NOW = new Date("2026-10-06T03:00:00Z");
const order = (partial: Partial<OrderForTransition> = {}): OrderForTransition => ({
  status: "PENDING",
  paymentStatus: "UNPAID",
  paymentMethod: "COD",
  items: [
    { variantId: "v1", quantity: 2 },
    { variantId: null, quantity: 1 },
  ],
  ...partial,
});

describe("luồng trạng thái", () => {
  const ALL: OrderStatus[] = [
    "PENDING",
    "CONFIRMED",
    "SHIPPING",
    "DELIVERED",
    "CANCELLED",
    "RETURNED",
  ];
  const VALID = new Set([
    "PENDING>CONFIRMED",
    "PENDING>CANCELLED",
    "CONFIRMED>SHIPPING",
    "CONFIRMED>CANCELLED",
    "SHIPPING>DELIVERED",
    "SHIPPING>RETURNED",
    "DELIVERED>RETURNED",
  ]);

  it("chỉ đúng 7 bước chuyển hợp lệ, mọi bước khác bị từ chối", () => {
    for (const from of ALL) {
      for (const to of ALL) {
        expect(canTransition(from, to), `${from}>${to}`).toBe(VALID.has(`${from}>${to}`));
      }
    }
  });

  it("trạng thái cuối không có bước tiếp", () => {
    expect(allowedNextStatuses("CANCELLED")).toEqual([]);
    expect(allowedNextStatuses("RETURNED")).toEqual([]);
  });

  it("bước sai ném INVALID_STATUS_TRANSITION", () => {
    expect(() =>
      planStatusChange(order({ status: "DELIVERED" }), { toStatus: "PENDING" }, NOW),
    ).toThrowError(expect.objectContaining({ code: "INVALID_STATUS_TRANSITION" }));
    expect(() => planStatusChange(order(), { toStatus: "DELIVERED" }, NOW)).toThrow();
  });
});

describe("planStatusChange", () => {
  it("xác nhận: ghi confirmedAt, không đụng kho", () => {
    const plan = planStatusChange(order(), { toStatus: "CONFIRMED" }, NOW);
    expect(plan.data).toEqual({ status: "CONFIRMED", confirmedAt: NOW });
    expect(plan.restock).toEqual([]);
  });

  it("đang giao: ghi shippedAt, đơn vị vận chuyển và mã vận đơn", () => {
    const plan = planStatusChange(
      order({ status: "CONFIRMED" }),
      { toStatus: "SHIPPING", carrier: "Viettel Post", trackingCode: "VTP123" },
      NOW,
    );
    expect(plan.data).toMatchObject({
      status: "SHIPPING",
      shippedAt: NOW,
      carrier: "Viettel Post",
      trackingCode: "VTP123",
    });
  });

  it("COD giao xong → tự đánh dấu đã thanh toán", () => {
    const plan = planStatusChange(order({ status: "SHIPPING" }), { toStatus: "DELIVERED" }, NOW);
    expect(plan.data).toMatchObject({ deliveredAt: NOW, paymentStatus: "PAID", paidAt: NOW });
  });

  it("chuyển khoản giao xong → không đổi thanh toán", () => {
    const plan = planStatusChange(
      order({ status: "SHIPPING", paymentMethod: "BANK_TRANSFER", paymentStatus: "PAID" }),
      { toStatus: "DELIVERED" },
      NOW,
    );
    expect(plan.data.paymentStatus).toBeUndefined();
  });

  it("hủy cần lý do", () => {
    expect(() => planStatusChange(order(), { toStatus: "CANCELLED" }, NOW)).toThrowError(
      expect.objectContaining({ code: "VALIDATION_ERROR" }),
    );
    expect(() => planStatusChange(order(), { toStatus: "CANCELLED", note: "   " }, NOW)).toThrow();
  });

  it("hủy: ghi lý do, cộng lại kho (bỏ qua dòng đã mất biến thể)", () => {
    const plan = planStatusChange(order(), { toStatus: "CANCELLED", note: "Khách đổi ý" }, NOW);
    expect(plan.data).toMatchObject({ cancelledAt: NOW, cancelReason: "Khách đổi ý" });
    expect(plan.restock).toEqual([{ variantId: "v1", quantity: 2 }]);
  });

  it("hoàn hàng: cộng lại kho", () => {
    const plan = planStatusChange(
      order({ status: "DELIVERED" }),
      { toStatus: "RETURNED", note: "Hoa lỗi" },
      NOW,
    );
    expect(plan.restock).toEqual([{ variantId: "v1", quantity: 2 }]);
  });

  it("hủy đơn đã thanh toán có thể đánh dấu đã hoàn tiền; mặc định thì không", () => {
    const paid = order({
      status: "CONFIRMED",
      paymentMethod: "BANK_TRANSFER",
      paymentStatus: "PAID",
    });
    expect(
      planStatusChange(paid, { toStatus: "CANCELLED", note: "x", markRefunded: true }, NOW).data
        .paymentStatus,
    ).toBe("REFUNDED");
    expect(
      planStatusChange(paid, { toStatus: "CANCELLED", note: "x" }, NOW).data.paymentStatus,
    ).toBeUndefined();
  });

  it("markRefunded không có tác dụng với đơn chưa thanh toán", () => {
    const plan = planStatusChange(
      order(),
      { toStatus: "CANCELLED", note: "x", markRefunded: true },
      NOW,
    );
    expect(plan.data.paymentStatus).toBeUndefined();
  });
});

describe("planMarkPaid", () => {
  it("đơn chưa trả → đã trả", () => {
    expect(planMarkPaid({ status: "PENDING", paymentStatus: "UNPAID" }, NOW).data).toEqual({
      paymentStatus: "PAID",
      paidAt: NOW,
    });
  });

  it("đã trả hoặc đã hoàn tiền → CONFLICT", () => {
    expect(() => planMarkPaid({ status: "PENDING", paymentStatus: "PAID" }, NOW)).toThrowError(
      expect.objectContaining({ code: "CONFLICT" }),
    );
    expect(() => planMarkPaid({ status: "PENDING", paymentStatus: "REFUNDED" }, NOW)).toThrow();
  });

  it("đơn đã hủy/hoàn → từ chối", () => {
    expect(() => planMarkPaid({ status: "CANCELLED", paymentStatus: "UNPAID" }, NOW)).toThrow();
    expect(() => planMarkPaid({ status: "RETURNED", paymentStatus: "UNPAID" }, NOW)).toThrow();
  });
});
