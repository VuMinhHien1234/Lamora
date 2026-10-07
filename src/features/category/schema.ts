import { z } from "zod";

const NAME_MAX = 80;
const SLUG_MAX = 100;
const DESCRIPTION_MAX = 1000;
const SEO_TITLE_MAX = 70;
const SEO_DESCRIPTION_MAX = 160;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Ô để trống trên form gửi lên chuỗi rỗng; coi như "không nhập". */
function optionalText(max: number, message: string): z.ZodOptional<z.ZodString> {
  return z.preprocess(
    (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
    z.string().trim().max(max, message).optional(),
  ) as unknown as z.ZodOptional<z.ZodString>;
}

export const categoryInputSchema = z.object({
  name: z.string().trim().min(1, "Vui lòng nhập tên danh mục").max(NAME_MAX, "Tên quá dài"),
  slug: z.preprocess(
    (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
    z
      .string()
      .trim()
      .max(SLUG_MAX, "Đường dẫn quá dài")
      .regex(SLUG_PATTERN, "Chỉ dùng chữ thường không dấu, số và dấu gạch ngang")
      .optional(),
  ) as unknown as z.ZodOptional<z.ZodString>,
  description: optionalText(DESCRIPTION_MAX, "Mô tả quá dài"),
  imagePublicId: optionalText(200, "Mã ảnh không hợp lệ"),
  parentId: optionalText(40, "Danh mục cha không hợp lệ"),
  isActive: z.boolean(),
  seoTitle: optionalText(SEO_TITLE_MAX, `Tiêu đề SEO tối đa ${SEO_TITLE_MAX} ký tự`),
  seoDescription: optionalText(
    SEO_DESCRIPTION_MAX,
    `Mô tả SEO tối đa ${SEO_DESCRIPTION_MAX} ký tự`,
  ),
});

export const updateCategorySchema = categoryInputSchema.extend({ id: z.string().min(1) });

export const reorderCategoriesSchema = z
  .array(z.object({ id: z.string().min(1), sortOrder: z.number().int().min(0) }))
  .min(1)
  .max(200);

export const deleteCategorySchema = z.object({ id: z.string().min(1) });

export type CategoryInput = z.infer<typeof categoryInputSchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type ReorderItem = z.infer<typeof reorderCategoriesSchema>[number];
