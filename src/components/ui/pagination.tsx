import Link from "next/link";
import { pageWindow } from "@/lib/pagination";
import { cn } from "@/lib/utils";

type PaginationProps = {
  page: number;
  pageCount: number;
  /** Trả về địa chỉ của một trang, ví dụ (n) => `/admin/san-pham?page=${n}`. */
  hrefFor: (page: number) => string;
};

const ITEM =
  "type-small grid min-h-11 min-w-11 place-items-center px-2 transition-colors duration-300";

/** Phân trang bằng liên kết (không cần JavaScript). Chỉ hiện khi có từ 2 trang. */
export function Pagination({ page, pageCount, hrefFor }: PaginationProps) {
  if (pageCount < 2) return null;
  return (
    <nav aria-label="Phân trang" className="mt-6 flex flex-wrap items-center justify-center gap-1">
      {page > 1 && (
        <Link href={hrefFor(page - 1)} className={cn(ITEM, "hover:text-rose-700")}>
          ‹ Trước
        </Link>
      )}
      {pageWindow(page, pageCount).map((item, index) =>
        item === "gap" ? (
          <span key={`gap-${index}`} aria-hidden className={cn(ITEM, "text-stone-500")}>
            …
          </span>
        ) : (
          <Link
            key={item}
            href={hrefFor(item)}
            aria-current={item === page ? "page" : undefined}
            className={cn(
              ITEM,
              item === page
                ? "border border-ink-900 text-ink-900"
                : "text-stone-500 hover:text-ink-900",
            )}
          >
            {item}
          </Link>
        ),
      )}
      {page < pageCount && (
        <Link href={hrefFor(page + 1)} className={cn(ITEM, "hover:text-rose-700")}>
          Sau ›
        </Link>
      )}
    </nav>
  );
}
