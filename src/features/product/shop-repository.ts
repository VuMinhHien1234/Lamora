import { db } from "@/lib/db";
import type { ShopListInput } from "./shop-schema";
import type { CardSource } from "./shop-rules";
import type { ShopProductData, ShopSort, ShopVariant } from "./shop-types";

export type ShopFilter = Pick<
  ShopListInput,
  "categorySlug" | "collectionSlug" | "colors" | "priceMin" | "priceMax"
> & { searchText?: string };

const ACTIVE_VARIANTS = { where: { isActive: true }, orderBy: { sortOrder: "asc" as const } };
const VARIANT_SELECT = {
  id: true,
  colorName: true,
  colorHex: true,
  size: true,
  price: true,
  compareAtPrice: true,
  stockQuantity: true,
} as const;

const CARD_SELECT = {
  id: true,
  name: true,
  slug: true,
  priceFrom: true,
  images: {
    orderBy: { sortOrder: "asc" as const },
    take: 1,
    select: { publicId: true, alt: true },
  },
  variants: { ...ACTIVE_VARIANTS, select: VARIANT_SELECT },
};

const ORDER: Record<ShopSort, Array<Record<string, "asc" | "desc">>> = {
  newest: [{ publishedAt: "desc" }, { createdAt: "desc" }],
  price_asc: [{ priceFrom: "asc" }, { createdAt: "desc" }],
  price_desc: [{ priceFrom: "desc" }, { createdAt: "desc" }],
  featured: [{ isFeatured: "desc" }, { publishedAt: "desc" }],
};

function whereOf(filter: ShopFilter): Record<string, unknown> {
  const and: Record<string, unknown>[] = [{ status: "ACTIVE" }];
  if (filter.categorySlug) {
    and.push({
      category: {
        isActive: true,
        OR: [{ slug: filter.categorySlug }, { parent: { slug: filter.categorySlug } }],
      },
    });
  }
  if (filter.collectionSlug) {
    and.push({
      collections: { some: { collection: { slug: filter.collectionSlug, isActive: true } } },
    });
  }
  if (filter.searchText) and.push({ searchText: { contains: filter.searchText } });
  if (filter.colors?.length) {
    and.push({ variants: { some: { isActive: true, colorName: { in: filter.colors } } } });
  }
  if (filter.priceMin !== undefined) and.push({ priceFrom: { gte: filter.priceMin } });
  if (filter.priceMax !== undefined) and.push({ priceFrom: { lte: filter.priceMax } });
  return { AND: and };
}

const toCardSource = (row: {
  id: string;
  name: string;
  slug: string;
  priceFrom: number;
  images: Array<{ publicId: string; alt: string }>;
  variants: ShopVariant[];
}): CardSource => ({
  id: row.id,
  name: row.name,
  slug: row.slug,
  priceFrom: row.priceFrom,
  image: row.images[0] ?? null,
  variants: row.variants,
});

export async function findCards(
  filter: ShopFilter,
  sort: ShopSort,
  range: { skip: number; take: number },
): Promise<CardSource[]> {
  const rows = await db.product.findMany({
    where: whereOf(filter),
    orderBy: ORDER[sort],
    skip: range.skip,
    take: range.take,
    select: CARD_SELECT,
  });
  return rows.map(toCardSource);
}

export function countProducts(filter: ShopFilter): Promise<number> {
  return db.product.count({ where: whereOf(filter) });
}

/** Các màu còn bán trong phạm vi lọc hiện tại (không tính chính bộ lọc màu). */
export function findColors(
  filter: ShopFilter,
): Promise<Array<{ colorName: string; colorHex: string | null }>> {
  const scope = whereOf({ ...filter, colors: undefined });
  return db.productVariant.findMany({
    where: { isActive: true, colorName: { not: "" }, product: scope },
    distinct: ["colorName"],
    select: { colorName: true, colorHex: true },
  });
}

export async function findFeatured(limit: number): Promise<CardSource[]> {
  const rows = await db.product.findMany({
    where: { status: "ACTIVE", isFeatured: true },
    orderBy: ORDER.featured,
    take: limit,
    select: CARD_SELECT,
  });
  return rows.map(toCardSource);
}

export async function findRelated(productId: string, limit: number): Promise<CardSource[]> {
  const base = await db.product.findUnique({
    where: { id: productId },
    select: { categoryId: true },
  });
  if (!base) return [];
  const rows = await db.product.findMany({
    where: { status: "ACTIVE", categoryId: base.categoryId, NOT: { id: productId } },
    orderBy: ORDER.featured,
    take: limit,
    select: CARD_SELECT,
  });
  return rows.map(toCardSource);
}

export async function findBySlug(slug: string): Promise<ShopProductData | null> {
  const row = await db.product.findFirst({
    where: { slug, status: "ACTIVE" },
    include: {
      category: { select: { name: true, slug: true } },
      variants: { ...ACTIVE_VARIANTS, select: VARIANT_SELECT },
      images: {
        orderBy: { sortOrder: "asc" },
        select: { id: true, publicId: true, alt: true, width: true, height: true, variantId: true },
      },
    },
  });
  if (!row) return null;
  const { category, ...rest } = row;
  return {
    id: rest.id,
    name: rest.name,
    slug: rest.slug,
    shortDescription: rest.shortDescription,
    description: rest.description,
    material: rest.material,
    careInstructions: rest.careInstructions,
    seoTitle: rest.seoTitle,
    seoDescription: rest.seoDescription,
    categoryId: rest.categoryId,
    categoryName: category.name,
    categorySlug: category.slug,
    variants: rest.variants,
    images: rest.images,
  };
}
