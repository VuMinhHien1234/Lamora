import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { buildListUrl, type ListFilters } from "../list-url";

export type CategoryOption = { id: string; name: string };

type ProductFiltersProps = { filters: ListFilters; categories: CategoryOption[] };

/** Ô tìm kiếm và bộ lọc. Là form GET thường nên dùng được cả khi chưa tải xong JavaScript. */
export function ProductFilters({ filters, categories }: ProductFiltersProps) {
  const hasFilter = Boolean(filters.q || filters.categoryId || filters.lowStock);
  return (
    <form
      method="get"
      action={buildListUrl({})}
      className="mb-6 grid gap-4 md:grid-cols-[1fr_14rem_auto] md:items-end"
    >
      {filters.status && <input type="hidden" name="status" value={filters.status} />}
      <Input
        label="Tìm sản phẩm"
        name="q"
        type="search"
        defaultValue={filters.q}
        placeholder="Tên hoặc mã SKU"
      />
      <Select label="Danh mục" name="categoryId" defaultValue={filters.categoryId ?? ""}>
        <option value="">Tất cả danh mục</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </Select>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <label className="type-body flex min-h-11 items-center gap-2">
          <input
            type="checkbox"
            name="lowStock"
            value="1"
            defaultChecked={filters.lowStock}
            className="size-4 accent-ink-900"
          />
          Sắp hết hàng
        </label>
        <Button type="submit" variant="primary" size="compact">
          Lọc
        </Button>
        {hasFilter && (
          <Link
            href={buildListUrl({ status: filters.status })}
            className="type-small link-underline"
          >
            Xóa lọc
          </Link>
        )}
      </div>
    </form>
  );
}
