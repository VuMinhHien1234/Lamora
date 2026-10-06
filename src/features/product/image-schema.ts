import { z } from "zod";

export const MAX_PRODUCT_IMAGES = 20;
const MAX_ALT = 200;
const MAX_DIMENSION = 20_000;

const altSchema = z.string().trim().max(MAX_ALT, "Mô tả ảnh quá dài");

export const saveProductImagesSchema = z.object({
  productId: z.string().min(1),
  images: z
    .array(
      z.object({
        publicId: z.string().min(1).max(300),
        alt: altSchema,
        width: z.number().int().positive().max(MAX_DIMENSION),
        height: z.number().int().positive().max(MAX_DIMENSION),
        variantId: z.string().min(1).optional(),
      }),
    )
    .min(1, "Chưa có ảnh nào")
    .max(MAX_PRODUCT_IMAGES, `Tối đa ${MAX_PRODUCT_IMAGES} ảnh mỗi sản phẩm`),
});

export const updateProductImagesSchema = z.object({
  productId: z.string().min(1),
  images: z
    .array(
      z.object({
        id: z.string().min(1),
        alt: altSchema,
        sortOrder: z.number().int().min(0).max(1000),
        variantId: z.string().min(1).nullable(),
      }),
    )
    .max(MAX_PRODUCT_IMAGES),
  deleteIds: z.array(z.string().min(1)).max(MAX_PRODUCT_IMAGES).default([]),
});

export type SaveProductImagesInput = z.infer<typeof saveProductImagesSchema>;
export type UpdateProductImagesInput = z.infer<typeof updateProductImagesSchema>;
