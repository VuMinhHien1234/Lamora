import type { VariantRecord } from "../types";

/** Một dòng biến thể trên form. Số được giữ dạng chữ để người dùng gõ tự do. */
export type VariantRowState = {
  key: string;
  id?: string;
  colorName: string;
  colorHex: string;
  size: string;
  sku: string;
  price: string;
  compareAtPrice: string;
  stockQuantity: string;
  isActive: boolean;
};

export type RowErrors = Record<string, string>;
export type SplitErrors = {
  general: Record<string, string>;
  variants: Record<number, RowErrors>;
};

export function emptyRow(key: string): VariantRowState {
  return {
    key,
    colorName: "",
    colorHex: "",
    size: "",
    sku: "",
    price: "",
    compareAtPrice: "",
    stockQuantity: "0",
    isActive: true,
  };
}

export function rowsFromRecords(variants: VariantRecord[]): VariantRowState[] {
  return variants.map((variant) => ({
    key: variant.id,
    id: variant.id,
    colorName: variant.colorName,
    colorHex: variant.colorHex ?? "",
    size: variant.size,
    sku: variant.sku,
    price: String(variant.price),
    compareAtPrice: variant.compareAtPrice === null ? "" : String(variant.compareAtPrice),
    stockQuantity: String(variant.stockQuantity),
    isActive: variant.isActive,
  }));
}

/** "650.000", " 650000 " → 650000; rỗng hoặc không phải số → undefined. */
export function parseWholeNumber(text: string): number | undefined {
  const digits = text.replace(/[.,\s]/g, "");
  return /^\d+$/.test(digits) ? Number(digits) : undefined;
}

/** Dòng biến thể → dữ liệu gửi lên server (server kiểm tra lại bằng Zod). */
export function toVariantPayload(rows: VariantRowState[]): Array<Record<string, unknown>> {
  return rows.map((row, index) => ({
    id: row.id ?? "",
    colorName: row.colorName,
    colorHex: row.colorHex,
    size: row.size,
    sku: row.sku,
    price: parseWholeNumber(row.price),
    compareAtPrice: parseWholeNumber(row.compareAtPrice),
    stockQuantity: parseWholeNumber(row.stockQuantity),
    isActive: row.isActive,
    sortOrder: index,
  }));
}

/** "Hồng, Trắng\nĐỏ" → ["Hồng", "Trắng", "Đỏ"], bỏ trùng không phân biệt hoa thường. */
export function splitList(text: string): string[] {
  const seen = new Set<string>();
  const items: string[] = [];
  for (const part of text.split(/[,\n;]/)) {
    const item = part.trim();
    if (item !== "" && !seen.has(item.toLowerCase())) {
      seen.add(item.toLowerCase());
      items.push(item);
    }
  }
  return items;
}

type GenerateInput = { colors: string; sizes: string; price: string; stock: string };

/** Sinh mọi tổ hợp màu × cỡ chưa có trong danh sách. Để trống một bên thì chỉ sinh theo bên còn lại. */
export function generateCombos(
  input: GenerateInput,
  existing: VariantRowState[],
  makeKey: () => string,
): VariantRowState[] {
  const colors = splitList(input.colors);
  const sizes = splitList(input.sizes);
  const taken = new Set(
    existing.map((row) => `${row.colorName.toLowerCase()}|${row.size.toLowerCase()}`),
  );
  const created: VariantRowState[] = [];
  for (const colorName of colors.length > 0 ? colors : [""]) {
    for (const size of sizes.length > 0 ? sizes : [""]) {
      if (colorName === "" && size === "") continue;
      const id = `${colorName.toLowerCase()}|${size.toLowerCase()}`;
      if (taken.has(id)) continue;
      taken.add(id);
      created.push({
        ...emptyRow(makeKey()),
        colorName,
        size,
        price: input.price,
        stockQuantity: input.stock,
      });
    }
  }
  return created;
}

/** Tách lỗi server: "name" → chung, "variants.2.price" → dòng 2 ô price. Lấy thông báo đầu tiên của mỗi ô. */
export function splitFieldErrors(fieldErrors: Record<string, string[]> | undefined): SplitErrors {
  const result: SplitErrors = { general: {}, variants: {} };
  for (const [path, messages] of Object.entries(fieldErrors ?? {})) {
    const message = messages[0];
    if (!message) continue;
    const match = /^variants\.(\d+)\.(\w+)$/.exec(path);
    if (match?.[1] && match[2]) {
      const index = Number(match[1]);
      result.variants[index] = { ...result.variants[index], [match[2]]: message };
    } else {
      result.general[path] = message;
    }
  }
  return result;
}
