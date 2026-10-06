import { requireAdmin } from "@/features/auth";
import { cloudinaryUrl } from "@/lib/cloudinary";
import * as service from "./service";
import type { CollectionDetail, CollectionRecord, CollectionWithCount } from "./types";

const PREVIEW_WIDTH = 240;

function preview(publicId: string | null): string | null {
  return publicId ? cloudinaryUrl(publicId, { width: PREVIEW_WIDTH }) : null;
}

/** 🔐 Tất cả bộ sưu tập (kể cả đang ẩn) kèm số sản phẩm. */
export async function adminListCollections(): Promise<CollectionWithCount[]> {
  await requireAdmin();
  const rows = await service.listAdminCollections();
  return rows.map((row) => ({ ...row, imagePreviewUrl: preview(row.imagePublicId) }));
}

/** 🔐 Một bộ sưu tập kèm danh sách sản phẩm theo thứ tự. Không có thì ném NOT_FOUND. */
export async function adminGetCollection(id: string): Promise<CollectionDetail> {
  await requireAdmin();
  const found = await service.getAdminCollection(id);
  return {
    ...found,
    imagePreviewUrl: preview(found.imagePublicId),
    products: found.products.map((p) => ({ ...p, imagePreviewUrl: preview(p.imagePublicId) })),
  };
}

/** 🌐 Một bộ sưu tập đang bật theo slug; không có thì ném NOT_FOUND để trang gọi `notFound()`. */
export function getCollectionBySlug(slug: string): Promise<CollectionRecord> {
  return service.findActiveBySlug(slug);
}
