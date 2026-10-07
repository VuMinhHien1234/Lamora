import { AdminPageHeader } from "@/components/layout/admin-page-header";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { buildListUrl, type ListFilters } from "../list-url";
import type { ProductListResult } from "../types";
import { ProductFilters, type CategoryOption } from "./product-filters";
import { ProductStatusTabs } from "./product-status-tabs";
import { ProductCards, ProductTable } from "./product-table";

type ProductListViewProps = {
  result: ProductListResult;
  filters: ListFilters;
  categories: CategoryOption[];
};

function Results({ result, filters }: Pick<ProductListViewProps, "result" | "filters">) {
  if (result.items.length > 0) {
    return (
      <>
        <ProductTable items={result.items} />
        <ProductCards items={result.items} />
        <Pagination
          page={result.page}
          pageCount={result.pageCount}
          hrefFor={(page) => buildListUrl(filters, { page })}
        />
      </>
    );
  }
  const filtered = Boolean(filters.q || filters.status || filters.categoryId || filters.lowStock);
  return (
    <EmptyState
      title={filtered ? "Không có sản phẩm phù hợp" : "Chưa có sản phẩm nào"}
      description={
        filtered
          ? "Thử đổi từ khóa hoặc bỏ bớt bộ lọc."
          : "Thêm sản phẩm đầu tiên để bắt đầu bán hàng."
      }
    />
  );
}

/** Màn hình M5: danh sách sản phẩm (docs/06 mục 7). Bộ lọc nằm trên địa chỉ trang nên chia sẻ/tải lại vẫn giữ nguyên. */
export function ProductListView({ result, filters, categories }: ProductListViewProps) {
  return (
    <>
      <AdminPageHeader
        title="Sản phẩm"
        description={`${result.total} sản phẩm`}
        actions={
          <ButtonLink href="/admin/san-pham/moi" variant="primary" size="compact">
            + Thêm sản phẩm
          </ButtonLink>
        }
      />
      <ProductStatusTabs filters={filters} />
      <ProductFilters filters={filters} categories={categories} />
      <Results result={result} filters={filters} />
    </>
  );
}
