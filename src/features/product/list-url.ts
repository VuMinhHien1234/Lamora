const BASE_PATH = "/admin/san-pham";

export type ListFilters = {
  q?: string;
  status?: string;
  categoryId?: string;
  lowStock?: boolean;
  page?: number;
};

/** Dựng địa chỉ trang danh sách từ bộ lọc; bỏ các giá trị mặc định để địa chỉ ngắn gọn. */
export function buildListUrl(filters: ListFilters, overrides: ListFilters = {}): string {
  const merged = { ...filters, ...overrides };
  const params = new URLSearchParams();
  if (merged.q) params.set("q", merged.q);
  if (merged.status) params.set("status", merged.status);
  if (merged.categoryId) params.set("categoryId", merged.categoryId);
  if (merged.lowStock) params.set("lowStock", "1");
  if (merged.page && merged.page > 1) params.set("page", String(merged.page));
  const query = params.toString();
  return query ? `${BASE_PATH}?${query}` : BASE_PATH;
}
