import { describe, expect, it } from "vitest";
import { createProductSchema, listProductsSchema, variantInputSchema } from "./schema";

const base = { name: "Bình hoa", categoryId: "c1", isFeatured: false };
const variant = { price: 100_000, stockQuantity: 5, isActive: true };

describe("variantInputSchema", () => {
  it("mặc định màu và cỡ là chuỗi rỗng", () => {
    const parsed = variantInputSchema.parse(variant);
    expect(parsed.colorName).toBe("");
    expect(parsed.size).toBe("");
  });

  it("giá gốc phải lớn hơn giá bán", () => {
    expect(variantInputSchema.safeParse({ ...variant, compareAtPrice: 100_000 }).success).toBe(
      false,
    );
    expect(variantInputSchema.safeParse({ ...variant, compareAtPrice: 120_000 }).success).toBe(
      true,
    );
  });

  it("từ chối giá âm, tồn kho âm, số lẻ", () => {
    expect(variantInputSchema.safeParse({ ...variant, price: -1 }).success).toBe(false);
    expect(variantInputSchema.safeParse({ ...variant, stockQuantity: -1 }).success).toBe(false);
    expect(variantInputSchema.safeParse({ ...variant, price: 10.5 }).success).toBe(false);
  });

  it("kiểm tra mã màu #RRGGBB; để trống thì bỏ qua", () => {
    expect(variantInputSchema.safeParse({ ...variant, colorHex: "hong" }).success).toBe(false);
    expect(variantInputSchema.safeParse({ ...variant, colorHex: "#E8B4B8" }).success).toBe(true);
    expect(variantInputSchema.safeParse({ ...variant, colorHex: "" }).success).toBe(true);
  });
});

describe("createProductSchema", () => {
  it("cần ít nhất một biến thể", () => {
    expect(createProductSchema.safeParse({ ...base, variants: [] }).success).toBe(false);
  });

  it("từ chối hai biến thể trùng màu và cỡ (không phân biệt hoa thường)", () => {
    const result = createProductSchema.safeParse({
      ...base,
      variants: [
        { ...variant, colorName: "Hồng" },
        { ...variant, colorName: "hồng" },
      ],
    });
    expect(result.success).toBe(false);
  });

  it("nhận dữ liệu hợp lệ, ô trống thành không có", () => {
    const result = createProductSchema.parse({
      ...base,
      slug: "",
      description: "  ",
      variants: [variant],
    });
    expect(result.slug).toBeUndefined();
    expect(result.description).toBeUndefined();
  });
});

describe("listProductsSchema", () => {
  it("mặc định trang 1, không lọc tồn kho", () => {
    expect(listProductsSchema.parse({})).toMatchObject({ page: 1, lowStock: false });
  });

  it("đọc tham số từ URL dạng chuỗi", () => {
    const parsed = listProductsSchema.parse({
      page: "3",
      lowStock: "1",
      status: "ACTIVE",
      q: " hoa ",
    });
    expect(parsed).toMatchObject({ page: 3, lowStock: true, status: "ACTIVE", q: "hoa" });
  });

  it("từ chối trạng thái lạ", () => {
    expect(listProductsSchema.safeParse({ status: "XYZ" }).success).toBe(false);
  });
});
