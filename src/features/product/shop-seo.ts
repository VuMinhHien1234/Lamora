import type { ShopProduct } from "./shop-types";

/** Dữ liệu cấu trúc schema.org/Product cho Google: giá thấp–cao và tình trạng còn hàng. */
export function buildProductJsonLd(product: ShopProduct, siteUrl: string): Record<string, unknown> {
  const prices = product.variants.map((v) => v.price);
  const inStock = product.variants.some((v) => v.stockQuantity > 0);
  const image = product.images.find((i) => i.url)?.url;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription ?? product.description ?? undefined,
    image: image ? [image] : undefined,
    category: product.categoryName,
    url: `${siteUrl.replace(/\/$/, "")}/san-pham/${product.slug}`,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "VND",
      lowPrice: prices.length ? Math.min(...prices) : 0,
      highPrice: prices.length ? Math.max(...prices) : 0,
      offerCount: product.variants.length,
      availability: inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };
}

export { jsonLdString } from "@/lib/seo";
