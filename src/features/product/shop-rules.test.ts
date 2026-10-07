import { describe, expect, it } from "vitest";
import {
  buildSwatches,
  compareAtFromCheapest,
  pageCountOf,
  toCardData,
  uniqueColors,
} from "./shop-rules";
import type { ShopVariant } from "./shop-types";

const v = (partial: Partial<ShopVariant>): ShopVariant => ({
  id: "v",
  colorName: "",
  colorHex: null,
  size: "",
  price: 100_000,
  compareAtPrice: null,
  stockQuantity: 5,
  ...partial,
});

describe("buildSwatches", () => {
  it("gộp theo tên màu và bỏ biến thể không màu", () => {
    const list = buildSwatches([
      v({ colorName: "Hồng", colorHex: "#f4c" }),
      v({ colorName: "Hồng", colorHex: "#f4c", stockQuantity: 0 }),
      v({}),
    ]);
    expect(list).toEqual([{ name: "Hồng", hex: "#f4c", soldOut: false }]);
  });

  it("đánh dấu hết hàng khi mọi biến thể của màu đã hết", () => {
    const list = buildSwatches([
      v({ colorName: "Trắng", colorHex: "#fff", stockQuantity: 0 }),
      v({ colorName: "Trắng", colorHex: "#fff", stockQuantity: 0, size: "L" }),
    ]);
    expect(list[0]?.soldOut).toBe(true);
  });
});

describe("compareAtFromCheapest", () => {
  it("lấy giá gốc của biến thể rẻ nhất khi đang giảm giá", () => {
    expect(
      compareAtFromCheapest([
        v({ price: 200_000, compareAtPrice: 300_000 }),
        v({ price: 150_000, compareAtPrice: 250_000 }),
      ]),
    ).toBe(250_000);
  });
  it("null khi không giảm giá hoặc giá gốc thấp hơn", () => {
    expect(compareAtFromCheapest([v({ compareAtPrice: 90_000 })])).toBeNull();
    expect(compareAtFromCheapest([])).toBeNull();
  });
});

describe("toCardData", () => {
  it("hết hàng khi không biến thể nào còn tồn, alt rỗng thì dùng tên", () => {
    const card = toCardData({
      id: "1",
      name: "Hoa hồng",
      slug: "hoa-hong",
      priceFrom: 100_000,
      image: { publicId: "lamora/products/a", alt: "" },
      variants: [v({ stockQuantity: 0 })],
    });
    expect(card).toMatchObject({ isOutOfStock: true, imageAlt: "Hoa hồng" });
  });
});

describe("uniqueColors và pageCountOf", () => {
  it("bỏ trùng, sắp theo tên", () => {
    const colors = uniqueColors([
      { colorName: "Tím", colorHex: "#a" },
      { colorName: "Đỏ", colorHex: "#b" },
      { colorName: "Tím", colorHex: "#a" },
      { colorName: "", colorHex: null },
    ]);
    expect(colors.map((c) => c.name)).toEqual(["Đỏ", "Tím"]);
  });
  it("luôn có ít nhất 1 trang", () => {
    expect(pageCountOf(0, 24)).toBe(1);
    expect(pageCountOf(25, 24)).toBe(2);
  });
});
