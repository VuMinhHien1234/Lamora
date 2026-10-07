import { X } from "lucide-react";
import Link from "next/link";
import { buildShopUrl, priceRangeLabel, type ShopListState } from "../shop-url";

type Props = { basePath: string; state: ShopListState };

function Chip({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      aria-label={`Bỏ lọc ${label}`}
      className="type-small inline-flex min-h-11 items-center gap-2 border border-sand-300 px-3 transition-colors duration-300 hover:border-ink-900"
    >
      {label}
      <X aria-hidden strokeWidth={1.25} className="size-4" />
    </Link>
  );
}

/** Các bộ lọc đang chọn; bấm × để bỏ từng cái. */
export function ActiveFilterChips({ basePath, state }: Props) {
  const price = priceRangeLabel(state);
  if (state.colors.length === 0 && !price) return null;
  return (
    <ul className="mb-6 flex flex-wrap gap-2">
      {state.colors.map((color) => (
        <li key={color}>
          <Chip
            label={color}
            href={buildShopUrl(basePath, state, {
              colors: state.colors.filter((item) => item !== color),
              page: 1,
            })}
          />
        </li>
      ))}
      {price && (
        <li>
          <Chip
            label={price}
            href={buildShopUrl(basePath, state, {
              priceMin: undefined,
              priceMax: undefined,
              page: 1,
            })}
          />
        </li>
      )}
    </ul>
  );
}
