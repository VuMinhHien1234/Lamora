import { JsonLd } from "@/components/seo/json-ld";
import { SITE } from "@/config/site";
import { listActiveCategories } from "@/features/category";
import { listHomeCollections, type CollectionRecord } from "@/features/collection";
import { listFeaturedProducts, listProducts } from "@/features/product";
import { getEnv } from "@/lib/env";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { BrandPromise } from "./brand-promise";
import { CategoryShortcuts } from "./category-shortcuts";
import { HeroBanner } from "./hero-banner";
import { ProductStrip } from "./product-strip";
import { SectionHeading } from "./section-heading";

const FEATURED_COUNT = 8;

async function CollectionSection({ collection }: { collection: CollectionRecord }) {
  const { items } = await listProducts({ collectionSlug: collection.slug });
  if (items.length === 0) return null;
  return (
    <section className="page-container py-12 lg:py-16">
      <SectionHeading title={collection.name} href={`/bo-suu-tap/${collection.slug}`} />
      <ProductStrip products={items} />
    </section>
  );
}

/** S1 — Trang chủ: banner, danh mục, nổi bật, bộ sưu tập, cam kết (docs/05 mục 4). */
export async function HomeView() {
  const [categories, featured, collections] = await Promise.all([
    listActiveCategories(),
    listFeaturedProducts(FEATURED_COUNT),
    listHomeCollections(),
  ]);
  const siteUrl = getEnv().NEXT_PUBLIC_SITE_URL;
  const sameAs = Object.values(SITE.social).filter(Boolean);
  return (
    <>
      <JsonLd
        data={organizationJsonLd(siteUrl, {
          name: SITE.name,
          description: SITE.description,
          phone: SITE.contact.phone,
          email: SITE.contact.email,
          sameAs,
        })}
      />
      <JsonLd data={websiteJsonLd(siteUrl, SITE.name)} />
      <HeroBanner />
      <CategoryShortcuts categories={categories} />
      {featured.length > 0 && (
        <section className="page-container pb-12 lg:pb-16">
          <SectionHeading title="Sản phẩm nổi bật" href="/san-pham" />
          <ProductStrip products={featured} />
        </section>
      )}
      {collections.map((collection) => (
        <CollectionSection key={collection.id} collection={collection} />
      ))}
      <BrandPromise />
    </>
  );
}
