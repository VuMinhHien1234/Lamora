import { beforeEach, describe, expect, it, vi } from "vitest";

const findConfirmationByCode = vi.fn();
vi.mock("./repository", () => ({
  findConfirmationByCode: (...a: unknown[]) => findConfirmationByCode(...a),
}));
vi.mock("@/lib/cloudinary", () => ({ cloudinaryUrl: (id: string) => `https://img/${id}` }));

const { getConfirmation } = await import("./confirmation-service");
const CODE = "LMR-261006-ABCD";
const row = {
  code: CODE,
  status: "PENDING",
  paymentMethod: "COD",
  paymentStatus: "UNPAID",
  subtotal: 100,
  shippingFee: 25,
  giftWrapFee: 0,
  total: 125,
  recipientName: "Lan",
  addressLine: "12 Phố Huế",
  wardName: "Phường A",
  provinceName: "Hà Nội",
  preferredDeliveryDate: new Date("2026-10-10T00:00:00Z"),
  isGift: false,
  items: [
    { productName: "Hoa", variantLabel: null, quantity: 1, lineTotal: 100, imagePublicId: "p/1" },
  ],
};

beforeEach(() => findConfirmationByCode.mockReset().mockResolvedValue(row));

describe("getConfirmation", () => {
  it("trả đơn khi cookie phiên khớp mã", async () => {
    const result = await getConfirmation(CODE, CODE);
    expect(result).toMatchObject({
      code: CODE,
      addressText: "12 Phố Huế, Phường A, Hà Nội",
      preferredDeliveryDate: "2026-10-10",
    });
    expect(result?.items[0]?.imageUrl).toBe("https://img/p/1");
  });

  it("không có cookie hoặc cookie của đơn khác → null, không đọc database", async () => {
    expect(await getConfirmation(CODE, null)).toBeNull();
    expect(await getConfirmation(CODE, "LMR-261006-ZZZZ")).toBeNull();
    expect(findConfirmationByCode).not.toHaveBeenCalled();
  });

  it("mã sai định dạng → null", async () => {
    expect(await getConfirmation("abc", "abc")).toBeNull();
  });

  it("không có đơn → null", async () => {
    findConfirmationByCode.mockResolvedValue(null);
    expect(await getConfirmation(CODE, CODE)).toBeNull();
  });

  it("không trả số điện thoại", async () => {
    expect(JSON.stringify(await getConfirmation(CODE, CODE))).not.toMatch(/Phone|phone/);
  });
});
