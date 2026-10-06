import { describe, expect, it, vi } from "vitest";

vi.mock("./repository", () => ({ findVariantSnapshots: vi.fn() }));

import { buildValidation, mergeLines, pickImage, variantLabel } from "./validate-service";
import type { VariantSnapshot } from "./types";

const snap = (
  id: string,
  partial: Partial<VariantSnapshot> = {},
  product: Partial<VariantSnapshot["product"]> = {},
): VariantSnapshot => ({
  id,
  colorName: "Hồng",
  size: "Nhỏ",
  price: 100_000,
  stockQuantity: 5,
  isActive: true,
  product: { name: "Hoa hồng", slug: "hoa-hong", status: "ACTIVE", images: [], ...product },
  ...partial,
});

describe("mergeLines", () => {
  it("gộp dòng trùng, tối đa 99 mỗi dòng", () => {
    expect(
      mergeLines([
        { variantId: "a", quantity: 60 },
        { variantId: "b", quantity: 1 },
        { variantId: "a", quantity: 60 },
      ]),
    ).toEqual([
      { variantId: "a", quantity: 99 },
      { variantId: "b", quantity: 1 },
    ]);
  });
});

describe("buildValidation", () => {
  it("giá lấy từ DB, tạm tính cộng các dòng bán được", () => {
    const result = buildValidation(
      [
        { variantId: "a", quantity: 2 },
        { variantId: "b", quantity: 1 },
      ],
      [snap("a"), snap("b", { price: 250_000 })],
    );
    expect(result.subtotal).toBe(450_000);
    expect(result.warnings).toEqual([]);
    expect(result.lines[0]).toMatchObject({
      unitPrice: 100_000,
      lineTotal: 200_000,
      available: true,
      variantLabel: "Hồng / Nhỏ",
    });
  });

  it("hết hàng: dòng không bán được, không tính tiền, có cảnh báo", () => {
    const result = buildValidation(
      [{ variantId: "a", quantity: 1 }],
      [snap("a", { stockQuantity: 0 })],
    );
    expect(result.subtotal).toBe(0);
    expect(result.lines[0]).toMatchObject({ available: false, maxQuantity: 0 });
    expect(result.warnings[0]).toMatchObject({ code: "OUT_OF_STOCK" });
  });

  it("không đủ số lượng: báo số còn lại", () => {
    const result = buildValidation(
      [{ variantId: "a", quantity: 4 }],
      [snap("a", { stockQuantity: 3 })],
    );
    expect(result.lines[0]).toMatchObject({ available: false, maxQuantity: 3 });
    expect(result.warnings[0]).toMatchObject({ code: "INSUFFICIENT_STOCK" });
    expect(result.warnings[0]?.message).toContain("3");
  });

  it("sản phẩm ngừng bán, nháp hoặc biến thể bị tắt: UNAVAILABLE", () => {
    for (const s of [
      snap("a", {}, { status: "ARCHIVED" }),
      snap("a", {}, { status: "DRAFT" }),
      snap("a", { isActive: false }),
    ]) {
      const result = buildValidation([{ variantId: "a", quantity: 1 }], [s]);
      expect(result.warnings[0]).toMatchObject({ code: "UNAVAILABLE" });
      expect(result.lines[0]?.maxQuantity).toBe(0);
    }
  });

  it("biến thể không còn trong DB: vẫn trả dòng để khách xóa, không tính tiền", () => {
    const result = buildValidation([{ variantId: "zzz", quantity: 2 }], []);
    expect(result.lines[0]).toMatchObject({ available: false, unitPrice: 0, quantity: 2 });
    expect(result.warnings[0]).toMatchObject({ code: "UNAVAILABLE", variantId: "zzz" });
    expect(result.subtotal).toBe(0);
  });

  it("dòng tốt vẫn được tính khi có dòng lỗi khác", () => {
    const result = buildValidation(
      [
        { variantId: "a", quantity: 1 },
        { variantId: "b", quantity: 1 },
      ],
      [snap("a"), snap("b", { stockQuantity: 0 })],
    );
    expect(result.subtotal).toBe(100_000);
    expect(result.warnings).toHaveLength(1);
  });
});

describe("variantLabel và pickImage", () => {
  it("bỏ phần rỗng", () => {
    expect(variantLabel({ colorName: "", size: "Lớn" })).toBe("Lớn");
    expect(variantLabel({ colorName: "", size: "" })).toBe("");
  });

  it("ưu tiên ảnh của biến thể, không thì ảnh đầu", () => {
    const images = [
      { publicId: "p1", variantId: null },
      { publicId: "p2", variantId: "a" },
    ];
    expect(pickImage(snap("a", {}, { images }))).toBe("p2");
    expect(pickImage(snap("b", {}, { images }))).toBe("p1");
    expect(pickImage(snap("b"))).toBeNull();
  });
});
