import { z } from "zod";
import type { CartLine } from "./types";

export const MAX_LINE_QUANTITY = 99;

const storedCartSchema = z.array(
  z.object({
    variantId: z.string().min(1),
    quantity: z.number().int().min(1).max(MAX_LINE_QUANTITY),
  }),
);

function clampQuantity(quantity: number): number {
  if (!Number.isFinite(quantity)) return 0;
  return Math.min(MAX_LINE_QUANTITY, Math.max(0, Math.trunc(quantity)));
}

/** Thêm `quantity` vào dòng đã có (hoặc tạo dòng mới), tối đa 99 mỗi dòng. */
export function addToCart(lines: CartLine[], variantId: string, quantity = 1): CartLine[] {
  const amount = clampQuantity(quantity);
  if (amount === 0) return lines;
  const existing = lines.find((line) => line.variantId === variantId);
  if (!existing) return [...lines, { variantId, quantity: amount }];
  return lines.map((line) =>
    line.variantId === variantId
      ? { ...line, quantity: clampQuantity(line.quantity + amount) }
      : line,
  );
}

/** Đặt số lượng; về 0 hoặc âm thì xóa dòng. */
export function setLineQuantity(
  lines: CartLine[],
  variantId: string,
  quantity: number,
): CartLine[] {
  const amount = clampQuantity(quantity);
  if (amount === 0) return removeLine(lines, variantId);
  return lines.map((line) => (line.variantId === variantId ? { ...line, quantity: amount } : line));
}

export function removeLine(lines: CartLine[], variantId: string): CartLine[] {
  return lines.filter((line) => line.variantId !== variantId);
}

export function countItems(lines: CartLine[]): number {
  return lines.reduce((total, line) => total + line.quantity, 0);
}

/** Đọc giỏ đã lưu trong trình duyệt. Dữ liệu hỏng hoặc bị sửa tay thì coi như giỏ trống. */
export function parseStoredCart(raw: string | null): CartLine[] {
  if (!raw) return [];
  try {
    const parsed = storedCartSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : [];
  } catch {
    return [];
  }
}

export function serializeCart(lines: CartLine[]): string {
  return JSON.stringify(lines);
}
