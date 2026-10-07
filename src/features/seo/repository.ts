import { db } from "@/lib/db";
import type { SitemapSource } from "./types";

const SELECT = { slug: true, updatedAt: true } as const;

/** Chỉ lấy những gì khách xem được: sản phẩm ACTIVE, danh mục và bộ sưu tập đang bật. */
export async function loadSitemapSource(): Promise<SitemapSource> {
  const [products, categories, collections] = await Promise.all([
    db.product.findMany({ where: { status: "ACTIVE" }, select: SELECT, orderBy: { slug: "asc" } }),
    db.category.findMany({ where: { isActive: true }, select: SELECT, orderBy: { slug: "asc" } }),
    db.collection.findMany({ where: { isActive: true }, select: SELECT, orderBy: { slug: "asc" } }),
  ]);
  return { products, categories, collections };
}
