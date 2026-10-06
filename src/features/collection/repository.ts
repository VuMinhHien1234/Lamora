import { db } from "@/lib/db";
import type {
  CollectionProductItem,
  CollectionRecord,
  CollectionWithCount,
  CollectionWriteData,
} from "./types";

export async function findAllWithCount(): Promise<CollectionWithCount[]> {
  const rows = await db.collection.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    include: { _count: { select: { products: true } } },
  });
  return rows.map(({ _count, ...rest }) => ({ ...rest, productCount: _count.products }));
}

export function findById(id: string): Promise<CollectionRecord | null> {
  return db.collection.findUnique({ where: { id } });
}

export function findBySlug(slug: string): Promise<CollectionRecord | null> {
  return db.collection.findUnique({ where: { slug } });
}

export async function slugExists(slug: string, excludeId?: string): Promise<boolean> {
  const found = await db.collection.findFirst({
    where: { slug, ...(excludeId ? { NOT: { id: excludeId } } : {}) },
    select: { id: true },
  });
  return found !== null;
}

export async function nextSortOrder(): Promise<number> {
  const last = await db.collection.aggregate({ _max: { sortOrder: true } });
  return (last._max.sortOrder ?? -1) + 1;
}

export function insert(data: CollectionWriteData, sortOrder: number): Promise<CollectionRecord> {
  return db.collection.create({ data: { ...data, sortOrder } });
}

export function updateById(id: string, data: CollectionWriteData): Promise<CollectionRecord> {
  return db.collection.update({ where: { id }, data });
}

export async function updateSortOrders(
  items: Array<{ id: string; sortOrder: number }>,
): Promise<void> {
  await db.$transaction(
    items.map((item) =>
      db.collection.update({ where: { id: item.id }, data: { sortOrder: item.sortOrder } }),
    ),
  );
}

export async function deleteById(id: string): Promise<void> {
  await db.collection.delete({ where: { id } });
}

export async function findProducts(collectionId: string): Promise<CollectionProductItem[]> {
  const rows = await db.productCollection.findMany({
    where: { collectionId },
    orderBy: { sortOrder: "asc" },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          status: true,
          images: { orderBy: { sortOrder: "asc" }, take: 1, select: { publicId: true } },
        },
      },
    },
  });
  return rows.map(({ product }) => ({
    id: product.id,
    name: product.name,
    status: product.status,
    imagePublicId: product.images[0]?.publicId ?? null,
  }));
}

export async function findExistingProductIds(ids: string[]): Promise<Set<string>> {
  const rows = await db.product.findMany({ where: { id: { in: ids } }, select: { id: true } });
  return new Set(rows.map((row) => row.id));
}

/** Ghi đè danh sách sản phẩm của bộ sưu tập theo thứ tự `productIds`. */
export async function replaceProducts(collectionId: string, productIds: string[]): Promise<void> {
  await db.$transaction([
    db.productCollection.deleteMany({ where: { collectionId } }),
    db.productCollection.createMany({
      data: productIds.map((productId, sortOrder) => ({ collectionId, productId, sortOrder })),
    }),
  ]);
}
