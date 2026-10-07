import Link from "next/link";
import { cn } from "@/lib/utils";
import { buildShopUrl, SORT_OPTIONS, type ShopListState } from "../shop-url";

/** Sắp xếp bằng liên kết (không cần JavaScript). Đổi cách sắp xếp thì về trang 1. */
export function ProductSort({ basePath, state }: { basePath: string; state: ShopListState }) {
  return (
    <nav aria-label="Sắp xếp" className="-mx-4 flex overflow-x-auto px-4 sm:mx-0 sm:px-0">
      {SORT_OPTIONS.map((option) => {
        const active = option.value === state.sort;
        return (
          <Link
            key={option.value}
            href={buildShopUrl(basePath, state, { sort: option.value, page: 1 })}
            aria-current={active ? "true" : undefined}
            className={cn(
              "type-small -mb-px min-h-11 shrink-0 border-b px-3 py-3 whitespace-nowrap transition-colors duration-300",
              active
                ? "border-ink-900 text-ink-900"
                : "border-transparent text-stone-500 hover:text-ink-900",
            )}
          >
            {option.label}
          </Link>
        );
      })}
    </nav>
  );
}
