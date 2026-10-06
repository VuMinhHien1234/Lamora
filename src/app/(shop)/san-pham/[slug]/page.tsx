import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import {
  getProductBySlug,
  listRelatedProducts,
  ProductDetailView,
  ProductDetailsAccordion,
  ProductGrid,
  buildProductJsonLd,
  jsonLdString,
  type ShopProduct,
} from "@/features/product";
import { getEnv } from "@/lib/env";
import { isAppError } from "@/lib/errors";

type PageProps = { params: Promise<{ slug: string }> };

async function loadProduct(slug: string): Promise<ShopProduct> {
  try {
    return await getProductBySlug(slug);
  } catch (error) {
    if (isAppError(error) && error.code === "NOT_FOUND") notFound();
    throw error;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = await loadProduct((await params).slug);
  const image = product.images.find((i) => i.url)?.url;
  return {
    title: product.seoTitle ?? product.name,
    description: product.seoDescription ?? product.shortDescription ?? undefined,
    openGraph: { title: product.seoTitle ?? product.name, images: image ? [image] : undefined },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const product = await loadProduct((await params).slug);
  const related = await listRelatedProducts(product.id);
  const jsonLd = buildProductJsonLd(product, getEnv().NEXT_PUBLIC_SITE_URL);
  return (
    <div className="page-container py-6 lg:py-10">
      <Breadcrumb
        items={[
          { label: "Trang chủ", href: "/" },
          { label: "Sản phẩm", href: "/san-pham" },
          { label: product.categoryName },
        ]}
      />
      <div className="mt-6">
        <ProductDetailView
          product={product}
          details={<ProductDetailsAccordion product={product} />}
        />
      </div>
      {related.length > 0 && (
        <section className="mt-16 lg:mt-24">
          <h2 className="type-h2 mb-8 text-center">Bạn có thể thích</h2>
          <ProductGrid products={related} />
        </section>
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
      />
    </div>
  );
}
