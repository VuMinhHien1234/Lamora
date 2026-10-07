import { STATIC_PAGE_SLUGS } from "@/content/pages";
import * as repo from "./repository";
import type { SitemapEntry, SitemapRow, SitemapSource } from "./types";

function rows(prefix: string, list: SitemapRow[], priority: number): SitemapEntry[] {
  return list.map((row) => ({
    path: `${prefix}/${row.slug}`,
    lastModified: row.updatedAt,
    changeFrequency: "weekly",
    priority,
  }));
}

/** Trang chủ, danh sách sản phẩm, trang tĩnh, danh mục, bộ sưu tập, sản phẩm (docs/08 mục 12). */
export function buildSitemapEntries(source: SitemapSource): SitemapEntry[] {
  return [
    { path: "/", changeFrequency: "daily", priority: 1 },
    { path: "/san-pham", changeFrequency: "daily", priority: 0.9 },
    ...rows("/danh-muc", source.categories, 0.8),
    ...rows("/bo-suu-tap", source.collections, 0.7),
    ...rows("/san-pham", source.products, 0.8),
    ...STATIC_PAGE_SLUGS.map((slug): SitemapEntry => ({
      path: `/${slug}`,
      changeFrequency: "monthly",
      priority: 0.3,
    })),
  ];
}

export async function listSitemapEntries(): Promise<SitemapEntry[]> {
  return buildSitemapEntries(await repo.loadSitemapSource());
}
