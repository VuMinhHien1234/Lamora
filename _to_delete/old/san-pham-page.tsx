import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { buttonStyles } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { listProducts, ProductGrid } from "@/features/product";

export const metadata: Metadata = {
  title: "Tất cả sản phẩm",
  description: "Hoa lụa cao cấp: bình hoa cắm sẵn, giỏ hoa, hoa treo tường và phụ kiện trang trí.",
};

type PageProps = { searchParams: Promise<{ trang?: string }> };

const pageHref = (page: number): string => (page <= 1 ? "/san-pham" : `/san-pham?trang=${page}`);

export default async function AllProductsPage({ searchParams }: PageProps) {
  const { trang } = await searchParams;
  const result = await listProducts({ page: Number(trang) || 1 });
  return (
    <div className="page-container py-8 lg:py-12">
      <Breadcrumb items={[{ label: "Trang chủ", href: "/" }, { label: "Tất cả sản phẩm" }]} />
      <header className="mt-4 mb-8 lg:mb-12">
        <h1 className="type-h1">Tất cả sản phẩm</h1>
        <p className="type-small mt-2 text-stone-500">{result.total} sản phẩm</p>
      </header>
      {result.items.length === 0 ? (
        <EmptyState
          title="Chưa có sản phẩm phù hợp"
          description="Cửa hàng đang cập nhật thêm sản phẩm mới."
          action={
            <Link href="/" className={buttonStyles({ variant: "secondary" })}>
              Về trang chủ
            </Link>
          }
        />
      ) : (
        <ProductGrid products={result.items} />
      )}
      <Pagination page={result.page} pageCount={result.pageCount} hrefFor={pageHref} />
    </div>
  );
}
