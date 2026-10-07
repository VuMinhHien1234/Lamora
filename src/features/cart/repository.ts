import { db } from "@/lib/db";
import type { VariantSnapshot } from "./types";

/** Đọc các biến thể trong giỏ kèm sản phẩm và vài ảnh để chọn ảnh hiển thị. */
export function findVariantSnapshots(ids: string[]): Promise<VariantSnapshot[]> {
  return db.productVariant.findMany({
    where: { id: { in: ids } },
    select: {
      id: true,
      colorName: true,
      size: true,
      price: true,
      stockQuantity: true,
      isActive: true,
      product: {
        select: {
          name: true,
          slug: true,
          status: true,
          images: {
            orderBy: { sortOrder: "asc" },
            select: { publicId: true, variantId: true },
          },
        },
      },
    },
  });
}
