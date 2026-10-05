import Link from "next/link";
import { cn } from "@/lib/utils";
import { buildListUrl, type ListFilters } from "../list-url";

const TABS = [
  { value: undefined, label: "Tất cả" },
  { value: "ACTIVE", label: "Đang bán" },
  { value: "DRAFT", label: "Nháp" },
  { value: "ARCHIVED", label: "Ngừng bán" },
] as const;

/** Lọc nhanh theo trạng thái; đổi tab thì về trang 1 và giữ các bộ lọc khác. */
export function ProductStatusTabs({ filters }: { filters: ListFilters }) {
  return (
    <nav
      aria-label="Lọc theo trạng thái"
      className="-mx-4 mb-5 flex overflow-x-auto border-b border-sand-200 px-4 sm:mx-0 sm:px-0"
    >
      {TABS.map((tab) => {
        const active = (filters.status ?? undefined) === tab.value;
        return (
          <Link
            key={tab.label}
            href={buildListUrl(filters, { status: tab.value, page: 1 })}
            aria-current={active ? "page" : undefined}
            className={cn(
              "type-eyebrow -mb-px min-h-11 shrink-0 border-b px-4 py-3 transition-colors duration-300",
              active
                ? "border-ink-900 text-ink-900"
                : "border-transparent text-stone-500 hover:text-ink-900",
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
