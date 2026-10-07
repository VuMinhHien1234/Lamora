import { beforeEach, describe, expect, it, vi } from "vitest";
import { orderInput, variant } from "./fixtures.test-util";

const placeOrder = vi.fn();
const countOrdersByIpSince = vi.fn();
vi.mock("./repository", () => ({
  placeOrder: (...args: unknown[]) => placeOrder(...args),
  countOrdersByIpSince: (...args: unknown[]) => countOrdersByIpSince(...args),
}));
const notifyNewOrder = vi.fn();
vi.mock("@/features/notification", () => ({
  notifyNewOrder: (...a: unknown[]) => notifyNewOrder(...a),
}));
vi.mock("@/features/shipping", () => ({
  resolveAddress: vi.fn(async (province: string, ward: string) =>
    province === "01" && ward === "00001" ? { provinceName: "Hà Nội", wardName: "Phường A" } : null,
  ),
  computeShippingQuote: () => ({ zone: "HANOI_INNER", shippingFee: 25_000 }),
}));

const { createOrder } = await import("./service");
const NOW = new Date("2026-10-05T05:00:00Z");
const ctx = { ipHash: "ip", now: NOW };

const draft = {
  customerName: "A",
  customerPhone: "0912345678",
  wardName: "W",
  provinceName: "P",
  preferredDeliveryDate: null,
  isGift: false,
  giftWrap: false,
  paymentMethod: "COD",
  total: 1,
  items: [],
};

beforeEach(() => {
  notifyNewOrder.mockReset();
  placeOrder.mockReset();
  countOrdersByIpSince.mockReset().mockResolvedValue(0);
});

describe("createOrder", () => {
  it("tạo đơn thành công và trả mã, tổng, cách thanh toán", async () => {
    placeOrder.mockResolvedValue({
      ok: true,
      order: { id: "o1", code: "LMR-261005-ABCD", total: 375_000, paymentMethod: "COD" },
      draft,
    });
    await expect(createOrder(orderInput(), ctx)).resolves.toEqual({
      code: "LMR-261005-ABCD",
      total: 375_000,
      paymentMethod: "COD",
    });
    expect(placeOrder.mock.calls[0]?.[0]).toEqual(["v1"]);
    expect(notifyNewOrder).toHaveBeenCalledWith(
      expect.objectContaining({ id: "o1", code: "LMR-261005-ABCD" }),
    );
  });

  it("không báo Telegram khi đặt hàng lỗi", async () => {
    placeOrder.mockResolvedValue({ ok: false, errors: [{ variantId: "v1", message: "x" }] });
    await expect(createOrder(orderInput(), ctx)).rejects.toBeTruthy();
    expect(notifyNewOrder).not.toHaveBeenCalled();
  });

  it("hàm plan gửi vào repository tính tiền theo biến thể thật", async () => {
    placeOrder.mockImplementation(async (_ids, plan) => {
      const result = plan([variant("v1", { price: 100_000 })]);
      return result.ok
        ? {
            ok: true,
            order: { id: "o", code: "C", total: result.draft.total, paymentMethod: "COD" },
            draft: result.draft,
          }
        : result;
    });
    const out = await createOrder(orderInput(), ctx);
    expect(out.total).toBe(125_000);
  });

  it("ô bẫy bot bị điền → thành công giả, không đụng database", async () => {
    const out = await createOrder(orderInput({ website: "http://spam" }), ctx);
    expect(out.code).toMatch(/^LMR-/);
    expect(out.total).toBe(0);
    expect(placeOrder).not.toHaveBeenCalled();
    expect(countOrdersByIpSince).not.toHaveBeenCalled();
  });

  it("quá 3 đơn / 10 phút cùng IP → TOO_MANY_ORDERS", async () => {
    countOrdersByIpSince.mockResolvedValue(3);
    await expect(createOrder(orderInput(), ctx)).rejects.toMatchObject({ code: "TOO_MANY_ORDERS" });
    expect(placeOrder).not.toHaveBeenCalled();
  });

  it("đếm đơn trong cửa sổ 10 phút", async () => {
    placeOrder.mockResolvedValue({
      ok: true,
      order: { id: "o", code: "C", total: 1, paymentMethod: "COD" },
      draft,
    });
    await createOrder(orderInput(), ctx);
    const since = countOrdersByIpSince.mock.calls[0]?.[1] as Date;
    expect(NOW.getTime() - since.getTime()).toBe(10 * 60 * 1000);
  });

  it("địa chỉ sai → INVALID_ADDRESS", async () => {
    const input = orderInput({
      address: { provinceCode: "01", wardCode: "99999", addressLine: "abc" },
    });
    await expect(createOrder(input, ctx)).rejects.toMatchObject({ code: "INVALID_ADDRESS" });
    expect(placeOrder).not.toHaveBeenCalled();
  });

  it("giỏ lỗi → CART_INVALID kèm dòng lỗi theo mã biến thể", async () => {
    placeOrder.mockResolvedValue({
      ok: false,
      errors: [{ variantId: "v1", message: '"Hoa" đã hết hàng.' }],
    });
    await expect(createOrder(orderInput(), ctx)).rejects.toMatchObject({
      code: "CART_INVALID",
      fieldErrors: { v1: ['"Hoa" đã hết hàng.'] },
    });
  });

  it("ngày nhận: từ ngày mai đến +30 ngày (giờ Việt Nam)", async () => {
    placeOrder.mockResolvedValue({
      ok: true,
      order: { id: "o", code: "C", total: 1, paymentMethod: "COD" },
      draft,
    });
    const bad = (d: string) => createOrder(orderInput({ preferredDeliveryDate: d }), ctx);
    await expect(bad("2026-10-05")).rejects.toMatchObject({ code: "VALIDATION_ERROR" });
    await expect(bad("2026-11-05")).rejects.toMatchObject({ code: "VALIDATION_ERROR" });
    await expect(bad("2026-10-06")).resolves.toBeTruthy();
    await expect(bad("2026-11-04")).resolves.toBeTruthy();
  });
});
