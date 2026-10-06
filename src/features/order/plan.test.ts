import { describe, expect, it } from "vitest";
import { planOrder, type PlanContext } from "./plan";
import { orderInput, variant } from "./fixtures.test-util";

const ctx: PlanContext = {
  provinceName: "Hà Nội",
  wardName: "Phường A",
  ipHash: "iphash",
  deliveryDate: null,
  quote: (subtotal) => ({ zone: "HANOI_INNER", shippingFee: subtotal >= 800_000 ? 0 : 25_000 }),
};

describe("planOrder", () => {
  it("tính tiền từ giá database, cộng phí ship", () => {
    const result = planOrder(
      orderInput({ items: [{ variantId: "v1", quantity: 2 }] }),
      [variant("v1", { price: 100_000 })],
      ctx,
    );
    expect(result.ok && result.draft).toMatchObject({
      subtotal: 200_000,
      shippingFee: 25_000,
      giftWrapFee: 0,
      total: 225_000,
      shippingZone: "HANOI_INNER",
    });
  });

  it("miễn phí ship khi đủ mốc", () => {
    const result = planOrder(
      orderInput({ items: [{ variantId: "v1", quantity: 2 }] }),
      [variant("v1", { price: 400_000 })],
      ctx,
    );
    expect(result.ok && result.draft.total).toBe(800_000);
  });

  it("gộp các dòng trùng biến thể", () => {
    const result = planOrder(
      orderInput({
        items: [
          { variantId: "v1", quantity: 1 },
          { variantId: "v1", quantity: 2 },
        ],
      }),
      [variant("v1")],
      ctx,
    );
    expect(result.ok && result.draft.items).toHaveLength(1);
    expect(result.ok && result.draft.items[0]?.quantity).toBe(3);
  });

  it("chụp lại tên, nhãn, SKU, ảnh vào dòng hàng", () => {
    const v = variant("v1", {}, { images: [{ publicId: "lamora/products/a", variantId: null }] });
    const result = planOrder(orderInput(), [v], ctx);
    expect(result.ok && result.draft.items[0]).toMatchObject({
      productName: "Hoa v1",
      variantLabel: "Hồng / M",
      sku: "SKU-v1",
      imagePublicId: "lamora/products/a",
      lineTotal: 350_000,
    });
  });

  it("báo hết hàng", () => {
    const result = planOrder(orderInput(), [variant("v1", { stockQuantity: 0 })], ctx);
    expect(result).toEqual({
      ok: false,
      errors: [{ variantId: "v1", message: '"Hoa v1" đã hết hàng.' }],
    });
  });

  it("báo không đủ số lượng", () => {
    const result = planOrder(
      orderInput({ items: [{ variantId: "v1", quantity: 4 }] }),
      [variant("v1", { stockQuantity: 3 })],
      ctx,
    );
    expect(!result.ok && result.errors[0]?.message).toContain("chỉ còn 3");
  });

  it("gộp dòng trùng rồi mới so với tồn kho", () => {
    const result = planOrder(
      orderInput({
        items: [
          { variantId: "v1", quantity: 3 },
          { variantId: "v1", quantity: 3 },
        ],
      }),
      [variant("v1", { stockQuantity: 5 })],
      ctx,
    );
    expect(result.ok).toBe(false);
  });

  it("từ chối sản phẩm ngừng bán, nháp, biến thể tắt, hoặc biến thể không tồn tại", () => {
    expect(planOrder(orderInput(), [variant("v1", {}, { status: "ARCHIVED" })], ctx).ok).toBe(
      false,
    );
    expect(planOrder(orderInput(), [variant("v1", {}, { status: "DRAFT" })], ctx).ok).toBe(false);
    expect(planOrder(orderInput(), [variant("v1", { isActive: false })], ctx).ok).toBe(false);
    expect(planOrder(orderInput(), [], ctx).ok).toBe(false);
  });

  it("gom mọi dòng lỗi, không chỉ dòng đầu", () => {
    const result = planOrder(
      orderInput({
        items: [
          { variantId: "v1", quantity: 1 },
          { variantId: "v2", quantity: 1 },
        ],
      }),
      [variant("v1", { stockQuantity: 0 })],
      ctx,
    );
    expect(!result.ok && result.errors.map((e) => e.variantId)).toEqual(["v1", "v2"]);
  });

  it("quà tặng: người nhận khác, gói quà +20.000đ, giữ lời nhắn", () => {
    const result = planOrder(
      orderInput({
        isGift: true,
        giftWrap: true,
        giftMessage: "Chúc mừng!",
        recipient: { name: "Lan", phone: "0987654321" },
      }),
      [variant("v1")],
      ctx,
    );
    expect(result.ok && result.draft).toMatchObject({
      recipientName: "Lan",
      recipientPhone: "0987654321",
      customerName: "Nguyễn An",
      giftWrap: true,
      giftWrapFee: 20_000,
      giftMessage: "Chúc mừng!",
      total: 350_000 + 25_000 + 20_000,
    });
  });

  it("không phải quà tặng: bỏ gói quà và lời nhắn, người nhận là người đặt", () => {
    const result = planOrder(
      orderInput({ giftWrap: true, giftMessage: "x" }),
      [variant("v1")],
      ctx,
    );
    expect(result.ok && result.draft).toMatchObject({
      recipientName: "Nguyễn An",
      giftWrap: false,
      giftWrapFee: 0,
      giftMessage: null,
    });
  });

  it("lưu ngày nhận mong muốn", () => {
    const result = planOrder(orderInput(), [variant("v1")], { ...ctx, deliveryDate: "2026-10-10" });
    expect(result.ok && result.draft.preferredDeliveryDate?.toISOString()).toBe(
      "2026-10-10T00:00:00.000Z",
    );
  });
});
