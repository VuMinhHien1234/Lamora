const BASE_PATH = "/admin/don-hang";

export type OrderListFilters = {
  status?: string;
  paymentStatus?: string;
  paymentMethod?: string;
  q?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
};

const KEYS = ["status", "paymentStatus", "paymentMethod", "q", "dateFrom", "dateTo"] as const;

/** Dựng địa chỉ trang M3 từ bộ lọc; bỏ giá trị trống để địa chỉ ngắn gọn. */
export function buildOrderListUrl(
  filters: OrderListFilters,
  overrides: OrderListFilters = {},
): string {
  const merged = { ...filters, ...overrides };
  const params = new URLSearchParams();
  for (const key of KEYS) {
    const value = merged[key];
    if (value) params.set(key, value);
  }
  if (merged.page && merged.page > 1) params.set("page", String(merged.page));
  const query = params.toString();
  return query ? `${BASE_PATH}?${query}` : BASE_PATH;
}
