import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { getCategoryBySlug, listActiveCategories, type CategoryRecord } from "@/features/category";
import { ShopListing, type RawSearchParams } from "@/features/product";
import { isAppError } from "@/lib/errors";

type PageProps = { params: Promise<{ slug: string }>; searchParams: Promise<RawSearchParams> };

async function loadCategory(slug: string): Promise<CategoryRecord> {
  try {
    return await getCategoryBySlug(slug);
  } catch (error) {
    if (isAppError(error) && error.code === "NOT_FOUND") notFound();
    throw error;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const category = await loadCategory((await params).slug);
  return {
    title: category.seoTitle ?? category.name,
    description: category.seoDescription ?? category.description ?? undefined,
    alternates: { canonical: `/danh-muc/${category.slug}` },
  };
}

/** Danh mục con của danh mục đang xem (nếu có). */
async function childLinks(category: CategoryRecord): Promise<{ name: string; slug: string }[]> {
  const tree = await listActiveCategories();
  return tree.find((node) => node.id === category.id)?.children ?? [];
}

/** S3 — Danh mục. */
export default async function CategoryPage({ params, searchParams }: PageProps) {
  const category = await loadCategory((await params).slug);
  const children = await childLinks(category);
  const basePath = `/danh-muc/${category.slug}`;
  const crumbs = [
    { label: "Trang chủ", href: "/" },
    { label: "Sản phẩm", href: "/san-pham" },
    { label: category.name },
  ];
  return (
    <div className="page-container py-8 lg:py-12">
      <Breadcrumb items={crumbs} />
      <BreadcrumbJsonLd items={crumbs} />
      <header className="mt-4 mb-8 lg:mb-12">
        <h1 className="type-h1">{category.name}</h1>
        {category.description && (
          <p className="type-lead mt-3 max-w-2xl text-stone-500">{category.description}</p>
        )}
        {children.length > 0 && (
          <ul className="mt-6 flex flex-wrap gap-2">
            {children.map((child) => (
              <li key={child.slug}>
                <Link
                  href={`/danh-muc/${child.slug}`}
                  className="type-small inline-flex min-h-11 items-center border border-sand-300 px-4 transition-colors duration-300 hover:border-ink-900"
                >
                  {child.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </header>
      <ShopListing
        basePath={basePath}
        fixed={{ categorySlug: category.slug }}
        searchParams={await searchParams}
        emptyDescription="Danh mục này đang được cập nhật thêm sản phẩm."
      />
    </div>
  );
}
