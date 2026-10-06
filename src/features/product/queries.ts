import { requireAdmin } from "@/features/auth";
import { cloudinaryUrl } from "@/lib/cloudinary";
import { listProductsSchema } from "./schema";
import * as service from "./service";
import type { ProductDetail, ProductListResult } from "./types";

/** 🔐 Bảng sản phẩm. `input` là query string thô từ URL; lỗi định dạng thì dùng giá trị mặc định. */
export async function adminListProducts(input: unknown): Promise<ProductListResult> {
  await requireAdmin();
  const parsed = listProductsSchema.safeParse(input);
  return service.listAdminProducts(parsed.success ? parsed.data : listProductsSchema.parse({}));
}

/** 🔐 Một sản phẩm đầy đủ (kể cả nháp / lưu trữ). Không có thì ném NOT_FOUND. */
export async function adminGetProduct(id: string): Promise<ProductDetail> {
  await requireAdmin();
  const product = await service.getAdminProduct(id);
  return {
    ...product,
    images: product.images.map((image) => ({
      ...image,
      previewUrl: cloudinaryUrl(image.publicId, { width: 240 }),
    })),
  };
}
