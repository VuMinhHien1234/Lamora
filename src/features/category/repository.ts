import { db } from "@/lib/db";
import type { CategoryRecord, CategoryWithCount, CategoryWriteData } from "./types";

const COUNT_SELECT = { _count: { select: { products: true } } } as const;

/** Tất cả danh mục, thứ tự hiển thị, kèm số sản phẩm. */
export async function findAllWithCount(): Promise<CategoryWithCount[]> {
  const rows = await db.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    include: COUNT_SELECT,
  });
  return rows.map(({ _count, ...rest }) => ({ ...rest, productCount: _count.products }));
}

export function findById(id: string): Promise<CategoryRecord | null> {
  return db.category.findUnique({ where: { id } });
}

export function findBySlug(slug: string): Promise<CategoryRecord | null> {
  return db.category.findUnique({ where: { slug } });
}

/** Slug đã có người dùng chưa (bỏ qua danh mục `excludeId` khi đang sửa chính nó). */
export async function slugExists(slug: string, excludeId?: string): Promise<boolean> {
  const found = await db.category.findFirst({
    where: { slug, ...(excludeId ? { NOT: { id: excludeId } } : {}) },
    select: { id: true },
  });
  return found !== null;
}

export async function nextSortOrder(parentId: string | null): Promise<number> {
  const last = await db.category.aggregate({ where: { parentId }, _max: { sortOrder: true } });
  return (last._max.sortOrder ?? -1) + 1;
}

export function insert(data: CategoryWriteData, sortOrder: number): Promise<CategoryRecord> {
  return db.category.create({ data: { ...data, sortOrder } });
}

export function updateById(id: string, data: CategoryWriteData): Promise<CategoryRecord> {
  return db.category.update({ where: { id }, data });
}

export async function updateSortOrders(
  items: Array<{ id: string; sortOrder: number }>,
): Promise<void> {
  await db.$transaction(
    items.map((item) =>
      db.category.update({ where: { id: item.id }, data: { sortOrder: item.sortOrder } }),
    ),
  );
}

export function countProducts(id: string): Promise<number> {
  return db.product.count({ where: { categoryId: id } });
}

export function countChildren(id: string): Promise<number> {
  return db.category.count({ where: { parentId: id } });
}

export async function deleteById(id: string): Promise<void> {
  await db.category.delete({ where: { id } });
}
