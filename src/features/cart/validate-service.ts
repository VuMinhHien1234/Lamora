import * as repo from "./repository";
import { MAX_LINE_QUANTITY } from "./service";
import type { CartLine } from "./types";
import type { CartValidationData, CartWarning, ValidatedLineData, VariantSnapshot } from "./types";

const REMOVED_NAME = "Sản phẩm không còn bán";

/** Gộp các dòng trùng biến thể (cộng số lượng, tối đa 99), giữ thứ tự xuất hiện đầu tiên. */
export function mergeLines(lines: CartLine[]): CartLine[] {
  const merged = new Map<string, number>();
  for (const line of lines) {
    merged.set(
      line.variantId,
      Math.min(MAX_LINE_QUANTITY, (merged.get(line.variantId) ?? 0) + line.quantity),
    );
  }
  return [...merged].map(([variantId, quantity]) => ({ variantId, quantity }));
}

export function variantLabel(variant: Pick<VariantSnapshot, "colorName" | "size">): string {
  return [variant.colorName, variant.size].filter((part) => part !== "").join(" / ");
}

/** Ảnh gắn với biến thể (nếu có), không thì ảnh đầu tiên của sản phẩm. */
export function pickImage(snapshot: VariantSnapshot): string | null {
  const { images } = snapshot.product;
  return (images.find((i) => i.variantId === snapshot.id) ?? images[0])?.publicId ?? null;
}

const isSellable = (s: VariantSnapshot): boolean => s.isActive && s.product.status === "ACTIVE";

function missingLine(line: CartLine): ValidatedLineData {
  return {
    variantId: line.variantId,
    productName: REMOVED_NAME,
    productSlug: "",
    variantLabel: "",
    imagePublicId: null,
    unitPrice: 0,
    quantity: line.quantity,
    lineTotal: 0,
    available: false,
    maxQuantity: 0,
  };
}

function warningFor(line: ValidatedLineData, sellable: boolean): CartWarning | null {
  if (line.available) return null;
  const name = line.productName;
  const base = { variantId: line.variantId };
  if (!sellable) return { ...base, code: "UNAVAILABLE", message: `"${name}" hiện không còn bán.` };
  if (line.maxQuantity === 0)
    return { ...base, code: "OUT_OF_STOCK", message: `"${name}" đã hết hàng.` };
  return {
    ...base,
    code: "INSUFFICIENT_STOCK",
    message: `"${name}" chỉ còn ${line.maxQuantity} sản phẩm, vui lòng giảm số lượng.`,
  };
}

function toLine(line: CartLine, snapshot: VariantSnapshot): ValidatedLineData {
  const sellable = isSellable(snapshot);
  const stock = sellable ? Math.max(0, snapshot.stockQuantity) : 0;
  const available = sellable && stock >= line.quantity;
  return {
    variantId: line.variantId,
    productName: snapshot.product.name,
    productSlug: snapshot.product.slug,
    variantLabel: variantLabel(snapshot),
    imagePublicId: pickImage(snapshot),
    unitPrice: snapshot.price,
    quantity: line.quantity,
    lineTotal: snapshot.price * line.quantity,
    available,
    maxQuantity: stock,
  };
}

/**
 * Đối chiếu giỏ hàng với database. Giá và tồn kho luôn lấy từ `snapshots`; dòng không bán được
 * không tính vào tạm tính và có cảnh báo riêng (docs/04 mục 6).
 */
export function buildValidation(
  items: CartLine[],
  snapshots: VariantSnapshot[],
): CartValidationData {
  const byId = new Map(snapshots.map((s) => [s.id, s]));
  const lines: ValidatedLineData[] = [];
  const warnings: CartWarning[] = [];
  for (const item of mergeLines(items)) {
    const snapshot = byId.get(item.variantId);
    const line = snapshot ? toLine(item, snapshot) : missingLine(item);
    const warning = warningFor(line, snapshot ? isSellable(snapshot) : false);
    lines.push(line);
    if (warning) warnings.push(warning);
  }
  const subtotal = lines.reduce((sum, line) => sum + (line.available ? line.lineTotal : 0), 0);
  return { lines, subtotal, warnings };
}

/** Đọc giá và tồn kho thật từ database rồi đối chiếu với giỏ hàng. */
export async function validateCartItems(items: CartLine[]): Promise<CartValidationData> {
  const snapshots =
    items.length > 0
      ? await repo.findVariantSnapshots(mergeLines(items).map((l) => l.variantId))
      : [];
  return buildValidation(items, snapshots);
}
