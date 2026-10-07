import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { STATIC_PAGE_SLUGS, getStaticPage, type StaticPage } from "@/content/pages";
import { ContactDetails, StaticPageLayout } from "@/features/content";

type PageProps = { params: Promise<{ page: string }> };

// Chỉ các địa chỉ trong danh sách này tồn tại; địa chỉ khác rơi vào trang 404.
export const dynamicParams = false;

export function generateStaticParams(): { page: string }[] {
  return STATIC_PAGE_SLUGS.map((page) => ({ page }));
}

async function loadPage(params: PageProps["params"]): Promise<StaticPage> {
  const page = getStaticPage((await params).page);
  if (!page) notFound();
  return page;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const page = await loadPage(params);
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: `/${page.slug}` },
  };
}

/** S11 — Trang tĩnh: giới thiệu, liên hệ, các chính sách. Nội dung ở `src/content/pages.ts`. */
export default async function StaticPageRoute({ params }: PageProps) {
  const page = await loadPage(params);
  return (
    <StaticPageLayout title={page.title} body={page.body}>
      {page.slug === "lien-he" && <ContactDetails />}
    </StaticPageLayout>
  );
}
