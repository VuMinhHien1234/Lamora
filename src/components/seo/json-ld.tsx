import { getEnv } from "@/lib/env";
import { breadcrumbJsonLd, jsonLdString, type BreadcrumbEntry, type JsonLdData } from "@/lib/seo";

/** Nhúng một khối dữ liệu cấu trúc vào trang. */
export function JsonLd({ data }: { data: JsonLdData }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(data) }} />
  );
}

/** BreadcrumbList cho các trang cần lên Google (sản phẩm, danh mục, bộ sưu tập, trang tĩnh). */
export function BreadcrumbJsonLd({ items }: { items: BreadcrumbEntry[] }) {
  return <JsonLd data={breadcrumbJsonLd(getEnv().NEXT_PUBLIC_SITE_URL, items)} />;
}
