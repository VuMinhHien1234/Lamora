import type { ShopVariant } from "./shop-types";

export type ColorOption = { name: string; hex: string; soldOut: boolean };
export type SizeOption = { size: string; soldOut: boolean };
export type Selection = { colorName: string; size: string };

const inStock = (v: ShopVariant): boolean => v.stockQuantity > 0;

export function colorOptions(variants: ShopVariant[]): ColorOption[] {
  const byName = new Map<string, ColorOption>();
  for (const v of variants) {
    if (v.colorName === "") continue;
    const existing = byName.get(v.colorName);
    if (existing) existing.soldOut = existing.soldOut && !inStock(v);
    else
      byName.set(v.colorName, { name: v.colorName, hex: v.colorHex ?? "", soldOut: !inStock(v) });
  }
  return [...byName.values()];
}

/** Các kích thước của một màu (màu "" = sản phẩm không có màu). Cỡ hết hàng vẫn hiện nhưng bị mờ. */
export function sizeOptions(variants: ShopVariant[], colorName: string): SizeOption[] {
  const sizes = new Map<string, SizeOption>();
  for (const v of variants.filter((x) => x.colorName === colorName && x.size !== "")) {
    const existing = sizes.get(v.size);
    if (existing) existing.soldOut = existing.soldOut && !inStock(v);
    else sizes.set(v.size, { size: v.size, soldOut: !inStock(v) });
  }
  return [...sizes.values()];
}

export function findVariant(variants: ShopVariant[], selection: Selection): ShopVariant | null {
  return (
    variants.find((v) => v.colorName === selection.colorName && v.size === selection.size) ?? null
  );
}

/** Lựa chọn ban đầu: biến thể đầu tiên còn hàng, không có thì biến thể đầu tiên. */
export function initialSelection(variants: ShopVariant[]): Selection {
  const first = variants.find(inStock) ?? variants[0];
  return { colorName: first?.colorName ?? "", size: first?.size ?? "" };
}

/** Đổi màu: giữ cỡ đang chọn nếu màu mới có cỡ đó, không thì lấy cỡ còn hàng đầu tiên của màu mới. */
export function selectColor(
  variants: ShopVariant[],
  current: Selection,
  colorName: string,
): Selection {
  const ofColor = variants.filter((v) => v.colorName === colorName);
  const same = ofColor.find((v) => v.size === current.size);
  const next = same ?? ofColor.find(inStock) ?? ofColor[0];
  return { colorName, size: next?.size ?? "" };
}

/** Ảnh cần hiện khi chọn biến thể: ảnh gắn với biến thể (ưu tiên) hoặc cùng màu. */
export function imageIdForSelection(
  images: Array<{ id: string; variantId: string | null }>,
  variants: ShopVariant[],
  selection: Selection,
): string | null {
  const sameColor = new Set(
    variants.filter((v) => v.colorName === selection.colorName).map((v) => v.id),
  );
  const exact = variants.find(
    (v) => v.colorName === selection.colorName && v.size === selection.size,
  );
  const byVariant = images.find((i) => exact && i.variantId === exact.id);
  return (byVariant ?? images.find((i) => i.variantId && sameColor.has(i.variantId)))?.id ?? null;
}

/** Số lượng tối đa chọn được: tồn kho, tối đa 99 (docs/05). */
export function maxQuantity(variant: ShopVariant | null, cap: number): number {
  return Math.max(0, Math.min(variant?.stockQuantity ?? 0, cap));
}
