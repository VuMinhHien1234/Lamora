import { z } from "zod";
import { emptyToUndefined, optionalText } from "@/lib/zod-helpers";

const NAME_MAX = 80;
const SLUG_MAX = 100;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const MAX_COLLECTION_PRODUCTS = 200;

export const collectionInputSchema = z.object({
  name: z.string().trim().min(1, "Vui lòng nhập tên bộ sưu tập").max(NAME_MAX, "Tên quá dài"),
  slug: z.preprocess(
    emptyToUndefined,
    z
      .string()
      .trim()
      .max(SLUG_MAX, "Đường dẫn quá dài")
      .regex(SLUG_PATTERN, "Chỉ dùng chữ thường không dấu, số và dấu gạch ngang")
      .optional(),
  ) as unknown as z.ZodOptional<z.ZodString>,
  description: optionalText(1000, "Mô tả quá dài"),
  imagePublicId: optionalText(200, "Mã ảnh không hợp lệ"),
  isActive: z.boolean(),
  showOnHome: z.boolean(),
});

export const updateCollectionSchema = collectionInputSchema.extend({ id: z.string().min(1) });

export const deleteCollectionSchema = z.object({ id: z.string().min(1) });

export const reorderCollectionsSchema = z
  .array(z.object({ id: z.string().min(1), sortOrder: z.number().int().min(0) }))
  .min(1)
  .max(100);

export const setCollectionProductsSchema = z.object({
  collectionId: z.string().min(1),
  productIds: z.array(z.string().min(1)).max(MAX_COLLECTION_PRODUCTS),
});

export type CollectionInput = z.infer<typeof collectionInputSchema>;
export type ReorderItem = z.infer<typeof reorderCollectionsSchema>[number];
