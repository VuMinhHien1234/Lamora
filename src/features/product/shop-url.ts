import { formatVnd } from "@/lib/money";
import type { ShopSort } from "./shop-types";

/** Trạng thái bộ lọc/sắp xếp/phân trang của trang danh sách, đọc từ và ghi lại lên URL (docs/05 mục 3). */
export type ShopListState = {
  colors: string[];
  priceMin?: number;
  priceMax?: number;
  sort: ShopSort;
  page: number;
  q?: string;
};

export type RawSearchParams = Record<string, string | string[] | undefined>;

export const SORT_OPTIONS: { value: ShopSort; param: string; label: string }[] = [
  { value: "newest", param: "moi-nhat", label: "Mới nhất" },
  { value: "price_asc", param: "gia-tang", label: "Giá tăng dần" },
  { value: "price_desc", param: "gia-giam", label: "Giá giảm dần" },
  { value: "featured", param: "noi-bat", label: "Nổi bật" },
];

/** Các mức giá chọn nhanh; giá trị là chuỗi `min-max` (bỏ trống phía không giới hạn). */
export const PRICE_RANGES: { value: string; label: string }[] = [
  { value: "0-200000", label: "Dưới 200.000₫" },
  { value: "200000-500000", label: "200.000₫ – 500.000₫" },
  { value: "500000-1000000", label: "500.000₫ – 1.000.000₫" },
  { value: "1000000-", label: "Trên 1.000.000₫" },
];

const MAX_COLORS = 10;
const MAX_PAGE = 1000;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function parseColors(value: string | string[] | undefined): string[] {
  const list = Array.isArray(value) ? value : value ? [value] : [];
  const cleaned = list.map((item) => item.trim()).filter((item) => item && item.length <= 40);
  return [...new Set(cleaned)].slice(0, MAX_COLORS);
}

function parsePrice(value: string | undefined): Pick<ShopListState, "priceMin" | "priceMax"> {
  const match = /^(\d{0,9})-(\d{0,9})$/.exec(value ?? "");
  if (!match) return {};
  const min = match[1] ? Number(match[1]) : undefined;
  const max = match[2] ? Number(match[2]) : undefined;
  if (min !== undefined && max !== undefined && min > max) return {};
  return { priceMin: min || undefined, priceMax: max };
}

/** Đọc query string; giá trị lạ bị bỏ qua thay vì báo lỗi. */
export function parseShopState(raw: RawSearchParams, q?: string): ShopListState {
  const sort = SORT_OPTIONS.find((option) => option.param === first(raw["sap-xep"]));
  const page = Number(first(raw.trang));
  return {
    colors: parseColors(raw.mau),
    ...parsePrice(first(raw.gia)),
    sort: sort?.value ?? "newest",
    page: Number.isInteger(page) && page >= 1 ? Math.min(page, MAX_PAGE) : 1,
    q,
  };
}

export function priceRangeValue(state: ShopListState): string {
  const { priceMin, priceMax } = state;
  if (priceMin === undefined && priceMax === undefined) return "";
  return `${priceMin ?? 0}-${priceMax ?? ""}`;
}

/** Dựng địa chỉ trang; giá trị mặc định được bỏ để địa chỉ ngắn gọn. */
export function buildShopUrl(
  basePath: string,
  state: ShopListState,
  overrides: Partial<ShopListState> = {},
): string {
  const merged = { ...state, ...overrides };
  const params = new URLSearchParams();
  if (merged.q) params.set("q", merged.q);
  for (const color of merged.colors) params.append("mau", color);
  const price = priceRangeValue(merged);
  if (price) params.set("gia", price);
  const sort = SORT_OPTIONS.find((option) => option.value === merged.sort);
  if (sort && merged.sort !== "newest") params.set("sap-xep", sort.param);
  if (merged.page > 1) params.set("trang", String(merged.page));
  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}

export function hasActiveFilter(state: ShopListState): boolean {
  return state.colors.length > 0 || priceRangeValue(state) !== "";
}

export function priceRangeLabel(state: ShopListState): string | null {
  const value = priceRangeValue(state);
  if (!value) return null;
  const preset = PRICE_RANGES.find((range) => range.value === value);
  if (preset) return preset.label;
  const { priceMin, priceMax } = state;
  if (priceMin === undefined) return `Dưới ${formatVnd(priceMax ?? 0)}`;
  if (priceMax === undefined) return `Trên ${formatVnd(priceMin)}`;
  return `${formatVnd(priceMin)} – ${formatVnd(priceMax)}`;
}
