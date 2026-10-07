import { describe, expect, it } from "vitest";
import { createOrderSchema } from "./schema";

const valid = {
  items: [{ variantId: "v1", quantity: 2, giftWrap: false }],
  customer: { name: "Nguyễn An", phone: "0912 345 678", email: "" },
  isGift: false,
  address: { provinceCode: "01", wardCode: "00001", addressLine: "12 Phố Huế" },
  paymentMethod: "COD",
};

describe("createOrderSchema", () => {
  it("chuẩn hóa số điện thoại, email rỗng thành không có", () => {
    const parsed = createOrderSchema.parse(valid);
    expect(parsed.customer.phone).toBe("0912345678");
    expect(parsed.customer.email).toBeUndefined();
  });

  it("từ chối giỏ trống", () => {
    expect(createOrderSchema.safeParse({ ...valid, items: [] }).success).toBe(false);
  });

  it("từ chối quá 30 dòng hoặc số lượng ngoài 1–99", () => {
    const many = Array.from({ length: 31 }, (_, i) => ({ variantId: `v${i}`, quantity: 1 }));
    expect(createOrderSchema.safeParse({ ...valid, items: many }).success).toBe(false);
    expect(
      createOrderSchema.safeParse({
        ...valid,
        items: [{ variantId: "v", quantity: 0, giftWrap: false }],
      }).success,
    ).toBe(false);
    expect(
      createOrderSchema.safeParse({
        ...valid,
        items: [{ variantId: "v", quantity: 100, giftWrap: false }],
      }).success,
    ).toBe(false);
  });

  it("quà tặng bắt buộc có người nhận", () => {
    const result = createOrderSchema.safeParse({ ...valid, isGift: true });
    expect(result.success).toBe(false);
  });

  it("không nhận giá hay tổng tiền từ trình duyệt", () => {
    const parsed = createOrderSchema.parse({ ...valid, total: 1, shippingFee: 0 });
    expect(parsed).not.toHaveProperty("total");
    expect(parsed).not.toHaveProperty("shippingFee");
  });

  it("giới hạn lời nhắn 300 và ghi chú 500 ký tự", () => {
    const longCard = {
      ...valid,
      items: [{ variantId: "v1", quantity: 1, cardMessage: "a".repeat(301) }],
    };
    expect(createOrderSchema.safeParse(longCard).success).toBe(false);
    expect(createOrderSchema.safeParse({ ...valid, customerNote: "a".repeat(501) }).success).toBe(
      false,
    );
  });

  it("từ chối cách thanh toán lạ và số điện thoại sai", () => {
    expect(createOrderSchema.safeParse({ ...valid, paymentMethod: "CARD" }).success).toBe(false);
    expect(
      createOrderSchema.safeParse({ ...valid, customer: { ...valid.customer, phone: "123" } })
        .success,
    ).toBe(false);
  });
});
