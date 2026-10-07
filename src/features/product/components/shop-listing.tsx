import { Pagination } from "@/components/ui/pagination";
import { listProducts } from "../queries";
import type { ShopListQuery } from "../shop-schema";
import {
  buildShopUrl,
  hasActiveFilter,
  parseShopState,
  priceRangeValue,
  type RawSearchParams,
} from "../shop-url";
import { ActiveFilterChips } from "./active-filter-chips";
import { FilterDrawer } from "./filter-drawer";
import { ProductGrid } from "./product-grid";
import { ShopEmpty } from "./shop-empty";
import { ProductSort } from "./product-sort";
import { ShopFilterForm } from "./shop-filter-form";

type FixedQuery = Pick<ShopListQuery, "categorySlug" | "collectionSlug" | "q">;

type Props = {
  /** Đường dẫn trang, ví dụ "/danh-muc/binh-hoa". */
  basePath: string;
  /** Phần lọc cố định của trang (danh mục, bộ sưu tập hoặc từ khóa tìm kiếm). */
  fixed: FixedQuery;
  searchParams: RawSearchParams;
  /** Câu hiện khi chưa có sản phẩm nào và cũng chưa lọc gì. */
  emptyDescription?: string;
};

/** Khung danh sách dùng chung cho S2–S5 (docs/05 mục 3): bộ lọc, sắp xếp, lưới, phân trang. */
export async function ShopListing({ basePath, fixed, searchParams, emptyDescription }: Props) {
  const state = parseShopState(searchParams, fixed.q);
  const result = await listProducts({ ...fixed, ...state, colors: state.colors });
  const filtered = hasActiveFilter(state);
  const form = (idPrefix: string) => (
    <ShopFilterForm
      basePath={basePath}
      state={state}
      colors={result.availableColors}
      idPrefix={idPrefix}
    />
  );
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-x-6 border-b border-sand-200">
        <div className="flex items-center gap-4 py-1">
          <FilterDrawer count={state.colors.length + (priceRangeValue(state) ? 1 : 0)}>
            {form("m")}
          </FilterDrawer>
          <p className="type-small text-stone-500">{result.total} sản phẩm</p>
        </div>
        <ProductSort basePath={basePath} state={state} />
      </div>
      <ActiveFilterChips basePath={basePath} state={state} />
      <div className="lg:grid lg:grid-cols-[14rem_1fr] lg:gap-10">
        <aside className="hidden lg:block">{form("d")}</aside>
        <div>
          {result.items.length === 0 ? (
            <ShopEmpty
              basePath={basePath}
              state={state}
              filtered={filtered}
              description={emptyDescription}
            />
          ) : (
            <ProductGrid products={result.items} withSidebar />
          )}
          <Pagination
            page={result.page}
            pageCount={result.pageCount}
            hrefFor={(page) => buildShopUrl(basePath, state, { page })}
          />
        </div>
      </div>
    </div>
  );
}
