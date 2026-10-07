import type { Metadata } from "next";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ShopListing, type RawSearchParams } from "@/features/product";

export const metadata: Metadata = {
  alternates: { canonical: "/san-pham" },
  title: "Tất cả sản phẩm",
  description: "Hoa lụa cao cấp: bình hoa cắm sẵn, giỏ hoa, hoa treo tường và phụ kiện trang trí.",
};

type PageProps = { searchParams: Promise<RawSearchParams> };

/** S2 — Tất cả sản phẩm. */
export default async function AllProductsPage({ searchParams }: PageProps) {
  return (
    <div className="page-container py-8 lg:py-12">
      <Breadcrumb items={[{ label: "Trang chủ", href: "/" }, { label: "Tất cả sản phẩm" }]} />
      <header className="mt-4 mb-8 lg:mb-12">
        <h1 className="type-h1">Tất cả sản phẩm</h1>
      </header>
      <ShopListing
        basePath="/san-pham"
        fixed={{}}
        searchParams={await searchParams}
        emptyDescription="Cửa hàng đang cập nhật thêm sản phẩm mới."
      />
    </div>
  );
}
