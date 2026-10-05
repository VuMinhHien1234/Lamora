import { requireAdmin } from "@/features/auth";
import * as service from "./service";
import type { CategoryNode, CategoryRecord } from "./types";

/** 🔐 Tất cả danh mục (kể cả đang ẩn) kèm số sản phẩm. */
export async function adminListCategories(): Promise<CategoryNode[]> {
  await requireAdmin();
  return service.listAdminCategories();
}

/** 🌐 Cây danh mục đang bật, dùng cho menu. */
export function listActiveCategories(): Promise<CategoryNode[]> {
  return service.listActiveCategoryTree();
}

/** 🌐 Một danh mục đang bật theo slug; không có thì ném NOT_FOUND để trang gọi `notFound()`. */
export function getCategoryBySlug(slug: string): Promise<CategoryRecord> {
  return service.findActiveBySlug(slug);
}
