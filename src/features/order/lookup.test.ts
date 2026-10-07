import { describe, expect, it, vi } from "vitest";
vi.mock("./repository", () => ({}));
import { normalizeLookupInput, phoneMatchesOrder, toLookup } from "./lookup";
import type { LookupRow } from "./types";

const row: LookupRow = {
  code: "LMR-261005-K7QF",
  status: "SHIPPING",
  paymentMethod: "COD",
  paymentStatus: "UNPAID",
  subtotal: 100000,
  shippingFee: 25000,
  giftWrapFee: 0,
  total: 125000,
  recipientName: "Lan",
  addressLine: "1 Lý Thường Kiệt",
  wardName: "Phường A",
  provinceName: "Hà Nội",
  preferredDeliveryDate: null,
  isGift: false,
  items: [],
  customerPhone: "0912345678",
  recipientPhone: "0987654321",
  carrier: "Viettel Post",
  trackingCode: "VTP1",
  history: [{ toStatus: "PENDING", createdAt: new Date("2026-10-05T03:00:00Z") }],
};

describe("normalizeLookupInput", () => {
  it("chấp nhận mã không dấu gạch, chữ thường và SĐT +84", () => {
    expect(normalizeLookupInput("lmr261005k7qf", "+84 912 345 678")).toEqual({
      code: "LMR-261005-K7QF",
      phone: "0912345678",
    });
  });
  it("sai định dạng → null", () => {
    expect(normalizeLookupInput("abc", "0912345678")).toBeNull();
    expect(normalizeLookupInput("LMR-261005-K7QF", "123")).toBeNull();
  });
});

describe("phoneMatchesOrder", () => {
  it("khớp số người đặt hoặc người nhận, không khớp số khác", () => {
    expect(phoneMatchesOrder(row, "0912345678")).toBe(true);
    expect(phoneMatchesOrder(row, "0987654321")).toBe(true);
    expect(phoneMatchesOrder(row, "0900000000")).toBe(false);
  });
});

describe("toLookup", () => {
  it("không lộ số điện thoại, giữ vận chuyển và lịch sử", () => {
    const result = toLookup(row);
    expect(JSON.stringify(result)).not.toContain("0912345678");
    expect(result.carrier).toBe("Viettel Post");
    expect(result.history).toEqual([{ status: "PENDING", at: "2026-10-05T03:00:00.000Z" }]);
    expect(result.order.addressText).toBe("1 Lý Thường Kiệt, Phường A, Hà Nội");
  });
});
