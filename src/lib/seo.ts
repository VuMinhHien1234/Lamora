// Dữ liệu cấu trúc schema.org (docs/08 mục 11). Chỉ tạo object thuần; giao diện nhúng bằng <JsonLd>.

export type JsonLdData = Record<string, unknown>;

/** Chuỗi JSON an toàn để nhúng vào thẻ <script>: không để chữ "<" kết thúc thẻ sớm. */
export function jsonLdString(data: JsonLdData): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function absoluteUrl(siteUrl: string, path: string): string {
  return `${siteUrl.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
}

type OrganizationInput = {
  name: string;
  description: string;
  phone: string;
  email: string;
  sameAs: string[];
};

export function organizationJsonLd(siteUrl: string, org: OrganizationInput): JsonLdData {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: org.name,
    description: org.description,
    url: absoluteUrl(siteUrl, "/"),
    telephone: org.phone,
    email: org.email,
    sameAs: org.sameAs.length > 0 ? org.sameAs : undefined,
  };
}

export function websiteJsonLd(siteUrl: string, name: string): JsonLdData {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    url: absoluteUrl(siteUrl, "/"),
    potentialAction: {
      "@type": "SearchAction",
      target: `${absoluteUrl(siteUrl, "/tim-kiem")}?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export type BreadcrumbEntry = { label: string; href?: string };

/** BreadcrumbList: mục cuối (trang hiện tại) không cần địa chỉ. */
export function breadcrumbJsonLd(siteUrl: string, items: BreadcrumbEntry[]): JsonLdData {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: item.href ? absoluteUrl(siteUrl, item.href) : undefined,
    })),
  };
}
