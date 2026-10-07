import type { MetadataRoute } from "next";
import { listSitemapEntries } from "@/features/seo";
import { getEnv } from "@/lib/env";
import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

/** sitemap.xml (docs/08 mục 12): chỉ trang khách xem được. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getEnv().NEXT_PUBLIC_SITE_URL;
  const entries = await listSitemapEntries();
  return entries.map((entry) => ({
    url: absoluteUrl(siteUrl, entry.path),
    lastModified: entry.lastModified,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));
}
