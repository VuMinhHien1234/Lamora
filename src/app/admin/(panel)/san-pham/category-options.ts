import { adminListCategories } from "@/features/category";

/** Danh sách danh mục (cả cha và con) cho ô chọn trong bộ lọc và form sản phẩm. */
export async function loadCategoryOptions(): Promise<Array<{ id: string; name: string }>> {
  const tree = await adminListCategories();
  return tree.flatMap((node) => [node, ...node.children]).map(({ id, name }) => ({ id, name }));
}
