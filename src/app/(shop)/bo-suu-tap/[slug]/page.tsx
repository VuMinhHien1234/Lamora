import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { getCollectionBySlug, type CollectionRecord } from "@/features/collection";
import { ShopListing, type RawSearchParams } from "@/features/product";
import { cloudinaryUrl } from "@/lib/cloudinary";
import { isAppError } from "@/lib/errors";

type PageProps = { params: Promise<{ slug: string }>; searchParams: Promise<RawSearchParams> };

const BANNER_WIDTH = 1600;

async function loadCollection(slug: string): Promise<CollectionRecord> {
  try {
    return await getCollectionBySlug(slug);
  } catch (error) {
    if (isAppError(error) && error.code === "NOT_FOUND") notFound();
    throw error;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const collection = await loadCollection((await params).slug);
  return {
    title: collection.name,
    description: collection.description ?? undefined,
    alternates: { canonical: `/bo-suu-tap/${collection.slug}` },
  };
}

/** S4 — Bộ sưu tập: ảnh banner, tên, mô tả rồi danh sách sản phẩm. */
export default async function CollectionPage({ params, searchParams }: PageProps) {
  const collection = await loadCollection((await params).slug);
  const crumbs = [
    { label: "Trang chủ", href: "/" },
    { label: "Bộ sưu tập" },
    { label: collection.name },
  ];
  const banner = collection.imagePublicId
    ? cloudinaryUrl(collection.imagePublicId, { width: BANNER_WIDTH, ratio: "21:9" })
    : null;
  return (
    <div className="page-container py-8 lg:py-12">
      <Breadcrumb items={crumbs} />
      <BreadcrumbJsonLd items={crumbs} />
      {banner && (
        <div className="relative mt-4 aspect-[16/9] w-full bg-ivory-100 sm:aspect-[21/9]">
          <Image
            src={banner}
            alt={`Bộ sưu tập ${collection.name}`}
            fill
            priority
            sizes="(min-width: 1280px) 1200px, 100vw"
            className="object-cover"
          />
        </div>
      )}
      <header className="mt-6 mb-8 lg:mb-12">
        <h1 className="type-h1">{collection.name}</h1>
        {collection.description && (
          <p className="type-lead mt-3 max-w-2xl text-stone-500">{collection.description}</p>
        )}
      </header>
      <ShopListing
        basePath={`/bo-suu-tap/${collection.slug}`}
        fixed={{ collectionSlug: collection.slug }}
        searchParams={await searchParams}
        emptyDescription="Bộ sưu tập này đang được cập nhật thêm sản phẩm."
      />
    </div>
  );
}
