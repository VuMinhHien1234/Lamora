import { describe, expect, it } from "vitest";
import { buildProductJsonLd, jsonLdString } from "./shop-seo";
import type { ShopProduct } from "./shop-types";

const product = {
  name: "Hoa hồng",
  slug: "hoa-hong",
  shortDescription: "Đẹp",
  description: null,
  categoryName: "Bình hoa",
  images: [{ id: "i", url: "https://x/y.jpg" }],
  variants: [
    { price: 200_000, stockQuantity: 0 },
    { price: 150_000, stockQuantity: 3 },
  ],
} as unknown as ShopProduct;

describe("buildProductJsonLd", () => {
  it("giá thấp–cao, còn hàng khi có biến thể còn tồn", () => {
    const ld = buildProductJsonLd(product, "https://shop.vn/");
    expect(ld.url).toBe("https://shop.vn/san-pham/hoa-hong");
    expect(ld.offers).toMatchObject({
      lowPrice: 150_000,
      highPrice: 200_000,
      availability: "https://schema.org/InStock",
    });
  });
});

describe("jsonLdString", () => {
  it("không để lọt ký tự < nguyên bản", () => {
    expect(jsonLdString({ a: "</script><b>" })).not.toContain("<");
  });
});
