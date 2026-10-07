import * as service from "./service";
import type { SitemapEntry } from "./types";

/** 🌐 Các địa chỉ đưa vào sitemap.xml. */
export function listSitemapEntries(): Promise<SitemapEntry[]> {
  return service.listSitemapEntries();
}
