import { ADMIN_PRODUCTS_PER_PAGE, LOW_STOCK_THRESHOLD } from "@/config/inventory";
import { db } from "@/lib/db";
import { AppError } from "@/lib/errors";
import type {
  DerivedFields,
  ProductDetail,
  ProductListQuery,
  ProductListRow,
  ProductRecord,
  ProductWriteData,
  StatusChange,
  VariantChanges,
  VariantRecord,
  VariantWriteData,
} from "./types";

const UNIQUE_VIOLATION = "P2002";

function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    (error as { code?: string }).code === UNIQUE_VIOLATION
  );
}

function conflict(): AppError {
  return new AppError("CONFLICT", "Biến thể bị trùng màu và cỡ, hoặc trùng SKU với biến thể khác.");
}

function listWhere(query: ProductListQuery, normalizedQ: string): Record<string, unknown> {
  const filters: Record<string, unknown>[] = [];
  if (query.status) filters.push({ status: query.status });
  if (query.categoryId) filters.push({ categoryId: query.categoryId });
  if (query.lowStock) {
    filters.push({
      variants: { some: { isActive: true, stockQuantity: { lte: LOW_STOCK_THRESHOLD } } },
    });
  }
  if (query.q) {
    filters.push({
      OR: [
        { name: { contains: query.q, mode: "insensitive" } },
        { searchText: { contains: normalizedQ } },
        { variants: { some: { sku: { contains: query.q, mode: "insensitive" } } } },
      ],
    });
  }
  return { AND: filters };
}

export async function listPage(
  query: ProductListQuery,
  normalizedQ: string,
): Promise<{ rows: ProductListRow[]; total: number }> {
  const where = listWhere(query, normalizedQ);
  const [total, found] = await Promise.all([
    db.product.count({ where }),
    db.product.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip: (query.page - 1) * ADMIN_PRODUCTS_PER_PAGE,
      take: ADMIN_PRODUCTS_PER_PAGE,
      include: {
        category: { select: { name: true } },
        variants: { select: { stockQuantity: true, isActive: true } },
        images: { orderBy: { sortOrder: "asc" }, take: 1, select: { publicId: true, alt: true } },
      },
    }),
  ]);
  const rows = found.map(({ category, images, ...rest }) => ({
    ...rest,
    categoryName: category.name,
    firstImage: images[0] ?? null,
  }));
  return { rows, total };
}

export async function findDetail(id: string): Promise<ProductDetail | null> {
  const found = await db.product.findUnique({
    where: { id },
    include: {
      category: { select: { name: true } },
      variants: { orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] },
      images: { orderBy: { sortOrder: "asc" } },
    },
  });
  if (!found) return null;
  const { category, ...rest } = found;
  return { ...rest, categoryName: category.name };
}

export function findRecord(id: string): Promise<ProductRecord | null> {
  return db.product.findUnique({ where: { id } });
}

export function findVariants(productId: string): Promise<VariantRecord[]> {
  return db.productVariant.findMany({ where: { productId }, orderBy: { sortOrder: "asc" } });
}

export async function findCategoryName(categoryId: string): Promise<string | null> {
  const found = await db.category.findUnique({ where: { id: categoryId }, select: { name: true } });
  return found?.name ?? null;
}

export function countImages(productId: string): Promise<number> {
  return db.productImage.count({ where: { productId } });
}

export async function slugExists(slug: string, excludeId?: string): Promise<boolean> {
  const found = await db.product.findFirst({
    where: { slug, ...(excludeId ? { NOT: { id: excludeId } } : {}) },
    select: { id: true },
  });
  return found !== null;
}

/** SKU đã thuộc về biến thể nào chưa (trả về id biến thể đó). */
export async function findVariantIdBySku(sku: string): Promise<string | null> {
  const found = await db.productVariant.findUnique({ where: { sku }, select: { id: true } });
  return found?.id ?? null;
}

/** Trong các biến thể này, cái nào đã nằm trong đơn hàng. */
export async function findVariantIdsWithOrders(variantIds: string[]): Promise<Set<string>> {
  if (variantIds.length === 0) return new Set();
  const rows = await db.orderItem.findMany({
    where: { variantId: { in: variantIds } },
    select: { variantId: true },
    distinct: ["variantId"],
  });
  return new Set(rows.flatMap((row) => (row.variantId ? [row.variantId] : [])));
}

export async function createWithVariants(
  data: ProductWriteData,
  variants: VariantWriteData[],
): Promise<ProductRecord> {
  try {
    return await db.product.create({ data: { ...data, variants: { create: variants } } });
  } catch (error) {
    if (isUniqueViolation(error)) throw conflict();
    throw error;
  }
}

export function updateGeneral(id: string, data: ProductWriteData): Promise<ProductRecord> {
  return db.product.update({ where: { id }, data });
}

export function updateStatus(id: string, change: StatusChange): Promise<ProductRecord> {
  return db.product.update({ where: { id }, data: change });
}

/** Áp mọi thay đổi biến thể và giá/tìm kiếm của sản phẩm trong MỘT transaction. */
export async function applyVariantChanges(
  productId: string,
  changes: VariantChanges,
  derived: DerivedFields,
): Promise<void> {
  try {
    await db.$transaction(async (tx) => {
      await tx.productVariant.deleteMany({ where: { id: { in: changes.deleteIds } } });
      await tx.productVariant.updateMany({
        where: { id: { in: changes.deactivateIds } },
        data: { isActive: false },
      });
      for (const item of changes.update) {
        await tx.productVariant.update({ where: { id: item.id }, data: item.data });
      }
      for (const data of changes.create) {
        await tx.productVariant.create({ data: { ...data, productId } });
      }
      await tx.product.update({ where: { id: productId }, data: derived });
    });
  } catch (error) {
    if (isUniqueViolation(error)) throw conflict();
    throw error;
  }
}
