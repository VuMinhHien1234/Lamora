import { removeVietnameseTones, toSearchText } from "@/lib/slug";
import type { VariantInput } from "./schema";
import type { VariantRecord } from "./types";

const SKU_PREFIX = "LMR";
const SKU_PART_MAX = 6;
const SKU_INITIALS_MAX = 4;
const MAX_SKU_TRIES = 50;

/** Giá thấp nhất trong các biến thể đang bán; không có biến thể nào đang bán thì là 0. */
export function computePriceFrom(variants: Array<{ price: number; isActive: boolean }>): number {
  const prices = variants.filter((variant) => variant.isActive).map((variant) => variant.price);
  return prices.length === 0 ? 0 : Math.min(...prices);
}

/** Chuỗi tìm kiếm: tên + danh mục + các màu, không dấu, chữ thường (docs/02 mục 3.4). */
export function buildSearchText(
  name: string,
  categoryName: string,
  variants: Array<{ colorName: string }>,
): string {
  const colors = [...new Set(variants.map((variant) => variant.colorName))];
  return toSearchText(name, categoryName, ...colors);
}

function skuPart(text: string): string {
  return removeVietnameseTones(text)
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, SKU_PART_MAX);
}

function initials(name: string): string {
  const letters = removeVietnameseTones(name)
    .toUpperCase()
    .split(/\s+/)
    .map((word) => word.replace(/[^A-Z0-9]/g, "").charAt(0))
    .join("");
  return letters.slice(0, SKU_INITIALS_MAX) || "SP";
}

/** SKU gợi ý: LMR-<chữ cái đầu tên>-<màu>-<cỡ>. Ví dụ "Bình hoa Hồng", "Hồng phấn", "Vừa (45cm)" → LMR-BHH-HONGPH-VUA45C. */
export function buildSku(
  productName: string,
  variant: { colorName: string; size: string },
): string {
  const parts = [
    SKU_PREFIX,
    initials(productName),
    skuPart(variant.colorName),
    skuPart(variant.size),
  ];
  return parts.filter((part) => part !== "").join("-");
}

/** Tìm SKU chưa ai dùng: thêm -2, -3… vào cuối khi trùng. */
export async function pickFreeSku(
  base: string,
  isTaken: (sku: string) => Promise<boolean>,
): Promise<string> {
  for (let n = 1; n <= MAX_SKU_TRIES; n += 1) {
    const candidate = n === 1 ? base : `${base}-${n}`;
    if (!(await isTaken(candidate))) return candidate;
  }
  return `${base}-${Date.now().toString(36).toUpperCase()}`;
}

type SaleCheck = {
  imageCount: number;
  variants: Array<{ price: number; isActive: boolean }>;
};

/** Những gì còn thiếu để sản phẩm được chuyển sang "Đang bán" (docs/04 mục 5.2). Rỗng nghĩa là đủ. */
export function listMissingForSale({ imageCount, variants }: SaleCheck): string[] {
  const missing: string[] = [];
  if (imageCount < 1) missing.push("ít nhất 1 ảnh sản phẩm");
  const active = variants.filter((variant) => variant.isActive);
  if (active.length < 1) missing.push("ít nhất 1 biến thể đang bán");
  else if (active.some((variant) => variant.price <= 0))
    missing.push("giá bán lớn hơn 0 cho mọi biến thể đang bán");
  return missing;
}

export function hasLowStock(
  variants: Array<{ stockQuantity: number; isActive: boolean }>,
  threshold: number,
): boolean {
  return variants.some((variant) => variant.isActive && variant.stockQuantity <= threshold);
}

export type VariantDiff = {
  toUpdate: Array<{ existing: VariantRecord; input: VariantInput }>;
  toCreate: VariantInput[];
  removed: VariantRecord[];
  unknownIds: string[];
};

/** So danh sách biến thể gửi lên với danh sách đang có: sửa, tạo mới, hay bị bỏ đi. */
export function diffVariants(existing: VariantRecord[], incoming: VariantInput[]): VariantDiff {
  const byId = new Map(existing.map((variant) => [variant.id, variant]));
  const keptIds = new Set<string>();
  const diff: VariantDiff = { toUpdate: [], toCreate: [], removed: [], unknownIds: [] };
  for (const input of incoming) {
    if (!input.id) {
      diff.toCreate.push(input);
      continue;
    }
    const found = byId.get(input.id);
    if (!found) diff.unknownIds.push(input.id);
    else {
      keptIds.add(found.id);
      diff.toUpdate.push({ existing: found, input });
    }
  }
  diff.removed = existing.filter((variant) => !keptIds.has(variant.id));
  return diff;
}
