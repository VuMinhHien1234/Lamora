export type PageItem = number | "gap";

/** Các số trang cần hiện: trang đầu, cuối, trang hiện tại ±1, chỗ bỏ qua là "gap". */
export function pageWindow(page: number, pageCount: number): PageItem[] {
  const wanted = new Set([1, pageCount, page - 1, page, page + 1]);
  const pages = [...wanted].filter((n) => n >= 1 && n <= pageCount).sort((a, b) => a - b);
  const items: PageItem[] = [];
  pages.forEach((n, index) => {
    const previous = pages[index - 1];
    if (previous !== undefined && n - previous > 1) items.push("gap");
    items.push(n);
  });
  return items;
}
