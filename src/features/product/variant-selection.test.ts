import { describe, expect, it } from "vitest";
import {
  colorOptions,
  findVariant,
  imageIdForSelection,
  initialSelection,
  maxQuantity,
  selectColor,
  sizeOptions,
} from "./variant-selection";
import type { ShopVariant } from "./shop-types";

const v = (id: string, colorName: string, size: string, stock = 5): ShopVariant => ({
  id,
  colorName,
  colorHex: colorName ? "#abc" : null,
  size,
  price: 100_000,
  compareAtPrice: null,
  stockQuantity: stock,
});

const variants = [
  v("1", "Hồng", "Nhỏ", 0),
  v("2", "Hồng", "Vừa"),
  v("3", "Trắng", "Nhỏ"),
  v("4", "Trắng", "Lớn", 0),
];

describe("tuỳ chọn màu và cỡ", () => {
  it("màu hết hàng khi mọi cỡ của màu đã hết", () => {
    expect(colorOptions(variants).map((c) => [c.name, c.soldOut])).toEqual([
      ["Hồng", false],
      ["Trắng", false],
    ]);
    expect(colorOptions([v("x", "Đỏ", "", 0)])[0]?.soldOut).toBe(true);
  });

  it("cỡ hết hàng vẫn hiện nhưng đánh dấu", () => {
    expect(sizeOptions(variants, "Hồng")).toEqual([
      { size: "Nhỏ", soldOut: true },
      { size: "Vừa", soldOut: false },
    ]);
  });
});

describe("lựa chọn", () => {
  it("ban đầu chọn biến thể đầu tiên còn hàng", () => {
    expect(initialSelection(variants)).toEqual({ colorName: "Hồng", size: "Vừa" });
    expect(initialSelection([])).toEqual({ colorName: "", size: "" });
  });

  it("đổi màu giữ cỡ nếu có, không thì lấy cỡ còn hàng", () => {
    expect(selectColor(variants, { colorName: "Hồng", size: "Nhỏ" }, "Trắng")).toEqual({
      colorName: "Trắng",
      size: "Nhỏ",
    });
    expect(selectColor(variants, { colorName: "Trắng", size: "Lớn" }, "Hồng")).toEqual({
      colorName: "Hồng",
      size: "Vừa",
    });
  });

  it("tìm biến thể theo màu và cỡ", () => {
    expect(findVariant(variants, { colorName: "Trắng", size: "Lớn" })?.id).toBe("4");
    expect(findVariant(variants, { colorName: "Đỏ", size: "" })).toBeNull();
  });

  it("chọn ảnh theo biến thể, rồi theo màu", () => {
    const images = [
      { id: "a", variantId: null },
      { id: "b", variantId: "3" },
      { id: "c", variantId: "2" },
    ];
    expect(imageIdForSelection(images, variants, { colorName: "Trắng", size: "Nhỏ" })).toBe("b");
    expect(imageIdForSelection(images, variants, { colorName: "Hồng", size: "Nhỏ" })).toBe("c");
    expect(imageIdForSelection(images, variants, { colorName: "Đỏ", size: "" })).toBeNull();
  });

  it("số lượng tối đa theo tồn kho và trần 99", () => {
    expect(maxQuantity(v("x", "", "", 4), 99)).toBe(4);
    expect(maxQuantity(v("x", "", "", 500), 99)).toBe(99);
    expect(maxQuantity(null, 99)).toBe(0);
  });
});
