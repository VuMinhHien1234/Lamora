import { db } from "@/lib/db";
import type { ProductOption } from "./types";

const MAX_OPTIONS = 500;

/** Danh sách gọn mọi sản phẩm (kể cả nháp) để chọn vào bộ sưu tập: tên A→Z, kèm ảnh bìa. */
export async function findOptions(): Promise<
  Array<Omit<ProductOption, "previewUrl"> & { imagePublicId: string | null }>
> {
  const rows = await db.product.findMany({
    orderBy: { name: "asc" },
    take: MAX_OPTIONS,
    select: {
      id: true,
      name: true,
      status: true,
      images: { orderBy: { sortOrder: "asc" }, take: 1, select: { publicId: true } },
    },
  });
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    status: row.status,
    imagePublicId: row.images[0]?.publicId ?? null,
  }));
}
