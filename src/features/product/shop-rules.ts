import type { AvailableColor, ColorSwatchData, ProductCardData, ShopVariant } from "./shop-types";

/** Dữ liệu thô của một sản phẩm cho thẻ: chỉ biến thể đang bật, ảnh đầu tiên. */
export type CardSource = {
  id: string;
  name: string;
  slug: string;
  priceFrom: number;
  image: { publicId: string; alt: string } | null;
  variants: ShopVariant[];
};

/** Mỗi tên màu một ô; ô màu bị gạch khi mọi biến thể của màu đó đã hết hàng. */
export function buildSwatches(variants: ShopVariant[]): ColorSwatchData[] {
  const byName = new Map<string, ColorSwatchData>();
  for (const variant of variants) {
    if (variant.colorName === "" || !variant.colorHex) continue;
    const soldOut = variant.stockQuantity <= 0;
    const existing = byName.get(variant.colorName);
    if (existing) existing.soldOut = existing.soldOut && soldOut;
    else byName.set(variant.colorName, { name: variant.colorName, hex: variant.colorHex, soldOut });
  }
  return [...byName.values()];
}

/** Giá gốc của biến thể rẻ nhất, chỉ khi thật sự đang giảm giá. */
export function compareAtFromCheapest(variants: ShopVariant[]): number | null {
  const cheapest = variants.reduce<ShopVariant | null>(
    (best, v) => (best === null || v.price < best.price ? v : best),
    null,
  );
  if (!cheapest || cheapest.compareAtPrice === null) return null;
  return cheapest.compareAtPrice > cheapest.price ? cheapest.compareAtPrice : null;
}

export function toCardData(source: CardSource): ProductCardData {
  return {
    id: source.id,
    name: source.name,
    slug: source.slug,
    imagePublicId: source.image?.publicId ?? null,
    imageAlt: source.image?.alt || source.name,
    priceFrom: source.priceFrom,
    compareAtPriceFrom: compareAtFromCheapest(source.variants),
    isOutOfStock: !source.variants.some((v) => v.stockQuantity > 0),
    colorSwatches: buildSwatches(source.variants),
  };
}

/** Gom các màu (không trùng tên) từ danh sách biến thể để làm bộ lọc màu. */
export function uniqueColors(
  rows: Array<{ colorName: string; colorHex: string | null }>,
): AvailableColor[] {
  const seen = new Map<string, AvailableColor>();
  for (const row of rows) {
    if (row.colorName === "" || !row.colorHex || seen.has(row.colorName)) continue;
    seen.set(row.colorName, { name: row.colorName, hex: row.colorHex });
  }
  return [...seen.values()].sort((a, b) => a.name.localeCompare(b.name, "vi"));
}

export function pageCountOf(total: number, pageSize: number): number {
  return Math.max(1, Math.ceil(total / pageSize));
}
