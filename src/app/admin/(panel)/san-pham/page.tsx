import type { Metadata } from "next";
import { requireAdminPage } from "@/features/auth";
import { adminListProducts, ProductListView } from "@/features/product";
import { loadCategoryOptions } from "./category-options";

export const metadata: Metadata = { title: "Sản phẩm" };

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

/** Chỉ lấy giá trị chuỗi đầu tiên của mỗi tham số trên địa chỉ. */
function firstValues(
  raw: Record<string, string | string[] | undefined>,
): Record<string, string | undefined> {
  return Object.fromEntries(
    Object.entries(raw).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value]),
  );
}

export default async function ProductsPage({ searchParams }: PageProps) {
  await requireAdminPage();
  const params = firstValues(await searchParams);
  const [result, categories] = await Promise.all([
    adminListProducts(params),
    loadCategoryOptions(),
  ]);
  const filters = {
    q: params.q?.trim() || undefined,
    status: params.status || undefined,
    categoryId: params.categoryId || undefined,
    lowStock: params.lowStock === "1",
    page: result.page,
  };
  return <ProductListView result={result} filters={filters} categories={categories} />;
}
