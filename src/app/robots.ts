import type { MetadataRoute } from "next";
import { getEnv } from "@/lib/env";
import { absoluteUrl } from "@/lib/seo";

const DISALLOWED = [
  "/admin",
  "/api",
  "/gio-hang",
  "/thanh-toan",
  "/dat-hang-thanh-cong",
  "/tra-cuu-don",
];

/** robots.txt (docs/08 mục 12): chặn khu quản trị, API và các trang giao dịch. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: DISALLOWED }],
    sitemap: absoluteUrl(getEnv().NEXT_PUBLIC_SITE_URL, "/sitemap.xml"),
  };
}
