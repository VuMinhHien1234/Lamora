import { z } from "zod";
import { emptyToUndefined, optionalText } from "@/lib/zod-helpers";
import { PRODUCT_STATUSES } from "./types";

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SKU_PATTERN = /^[A-Za-z0-9][A-Za-z0-9-]*$/;
const HEX_PATTERN = /^#[0-9A-Fa-f]{6}$/;
const MAX_PRICE = 100_000_000;
const MAX_STOCK = 100_000;
const MAX_VARIANTS = 100;

const statusSchema = z.enum(PRODUCT_STATUSES as [string, ...string[]]);

export const productFieldsSchema = z.object({
  name: z.string().trim().min(1, "Vui lòng nhập tên sản phẩm").max(120, "Tên quá dài"),
  slug: z.preprocess(
    emptyToUndefined,
    z
      .string()
      .trim()
      .max(120, "Đường dẫn quá dài")
      .regex(SLUG_PATTERN, "Chỉ dùng chữ thường không dấu, số và dấu gạch ngang")
      .optional(),
  ) as unknown as z.ZodOptional<z.ZodString>,
  categoryId: z.string().min(1, "Vui lòng chọn danh mục"),
  shortDescription: optionalText(300, "Mô tả ngắn tối đa 300 ký tự"),
  description: optionalText(5000, "Mô tả quá dài"),
  material: optionalText(200, "Chất liệu quá dài"),
  careInstructions: optionalText(2000, "Hướng dẫn bảo quản quá dài"),
  isFeatured: z.boolean(),
  seoTitle: optionalText(70, "Tiêu đề SEO tối đa 70 ký tự"),
  seoDescription: optionalText(160, "Mô tả SEO tối đa 160 ký tự"),
});

const optionalInt = (max: number, message: string): z.ZodType<number | undefined> =>
  z.preprocess(
    (value) => (value === "" || value === null ? undefined : value),
    z.number().int(message).min(0, message).max(max, message).optional(),
  ) as unknown as z.ZodType<number | undefined>;

export const variantInputSchema = z
  .object({
    id: z.preprocess(
      emptyToUndefined,
      z.string().optional(),
    ) as unknown as z.ZodOptional<z.ZodString>,
    colorName: z.string().trim().max(40, "Tên màu quá dài").default(""),
    colorHex: z.preprocess(
      emptyToUndefined,
      z.string().regex(HEX_PATTERN, "Mã màu dạng #RRGGBB").optional(),
    ) as unknown as z.ZodOptional<z.ZodString>,
    size: z.string().trim().max(40, "Tên cỡ quá dài").default(""),
    sku: z.preprocess(
      emptyToUndefined,
      z
        .string()
        .trim()
        .max(40, "SKU quá dài")
        .regex(SKU_PATTERN, "SKU chỉ gồm chữ, số và dấu gạch ngang")
        .optional(),
    ) as unknown as z.ZodOptional<z.ZodString>,
    price: z
      .number("Vui lòng nhập giá")
      .int("Giá phải là số nguyên")
      .min(0, "Giá không được âm")
      .max(MAX_PRICE, "Giá quá lớn"),
    compareAtPrice: optionalInt(MAX_PRICE, "Giá gốc không hợp lệ"),
    stockQuantity: z
      .number("Vui lòng nhập tồn kho")
      .int("Tồn kho phải là số nguyên")
      .min(0, "Tồn kho không được âm")
      .max(MAX_STOCK, "Tồn kho quá lớn"),
    isActive: z.boolean(),
    sortOrder: z.number().int().min(0).default(0),
  })
  .refine((v) => v.compareAtPrice === undefined || v.compareAtPrice > v.price, {
    path: ["compareAtPrice"],
    message: "Giá gốc phải lớn hơn giá bán",
  });

export type VariantInput = z.infer<typeof variantInputSchema>;

const variantListSchema = z
  .array(variantInputSchema)
  .min(1, "Cần ít nhất một biến thể")
  .max(MAX_VARIANTS, "Quá nhiều biến thể")
  .superRefine((variants, ctx) => {
    const seen = new Set<string>();
    variants.forEach((variant, index) => {
      const key = `${variant.colorName.toLowerCase()}|${variant.size.toLowerCase()}`;
      if (seen.has(key)) {
        ctx.addIssue({
          code: "custom",
          path: [index, "colorName"],
          message: "Trùng màu và cỡ với biến thể khác",
        });
      }
      seen.add(key);
    });
  });

export const createProductSchema = productFieldsSchema.extend({ variants: variantListSchema });
export const updateProductSchema = productFieldsSchema.extend({ id: z.string().min(1) });
export const upsertVariantsSchema = z.object({
  productId: z.string().min(1),
  variants: variantListSchema,
});
export const setProductStatusSchema = z.object({ id: z.string().min(1), status: statusSchema });

export const listProductsSchema = z.object({
  q: optionalText(100, "Từ khóa quá dài"),
  status: z.preprocess(
    emptyToUndefined,
    statusSchema.optional(),
  ) as unknown as z.ZodOptional<z.ZodString>,
  categoryId: optionalText(40, "Danh mục không hợp lệ"),
  lowStock: z.preprocess((v) => v === true || v === "1" || v === "true", z.boolean()),
  page: z.preprocess(
    (v) => (v === undefined || v === "" ? 1 : Number(v)),
    z.number().int().min(1).max(10_000),
  ),
});

export type ProductFields = z.infer<typeof productFieldsSchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type ListProductsInput = z.infer<typeof listProductsSchema>;
