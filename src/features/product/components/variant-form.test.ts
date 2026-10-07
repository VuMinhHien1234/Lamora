import { describe, expect, it } from "vitest";
import {
  emptyRow,
  generateCombos,
  parseWholeNumber,
  splitFieldErrors,
  splitList,
  toVariantPayload,
} from "./variant-form";

let counter = 0;
const key = (): string => `k${(counter += 1)}`;

describe("parseWholeNumber", () => {
  it("đọc số nguyên, bỏ dấu chấm, phẩy, khoảng trắng", () => {
    expect(parseWholeNumber("650.000")).toBe(650000);
    expect(parseWholeNumber(" 1,250,000 ")).toBe(1250000);
    expect(parseWholeNumber("0")).toBe(0);
  });

  it("rỗng hoặc không phải số thì undefined", () => {
    expect(parseWholeNumber("")).toBeUndefined();
    expect(parseWholeNumber("abc")).toBeUndefined();
    expect(parseWholeNumber("-5")).toBeUndefined();
    expect(parseWholeNumber("12.5k")).toBeUndefined();
  });
});

describe("splitList", () => {
  it("tách theo phẩy, chấm phẩy, xuống dòng; bỏ trùng và dòng trống", () => {
    expect(splitList("Hồng, Trắng;\nĐỏ,, hồng ")).toEqual(["Hồng", "Trắng", "Đỏ"]);
  });
});

describe("generateCombos", () => {
  const input = { colors: "Hồng, Trắng", sizes: "Nhỏ, Vừa", price: "500000", stock: "10" };

  it("sinh đủ tổ hợp màu × cỡ kèm giá và tồn kho mặc định", () => {
    const rows = generateCombos(input, [], key);
    expect(rows).toHaveLength(4);
    expect(rows[0]).toMatchObject({
      colorName: "Hồng",
      size: "Nhỏ",
      price: "500000",
      stockQuantity: "10",
    });
  });

  it("bỏ qua tổ hợp đã có (không phân biệt hoa thường)", () => {
    const existing = [{ ...emptyRow("x"), colorName: "hồng", size: "NHỎ" }];
    const rows = generateCombos(input, existing, key);
    expect(rows).toHaveLength(3);
    expect(rows.some((r) => r.colorName === "Hồng" && r.size === "Nhỏ")).toBe(false);
  });

  it("chỉ nhập màu thì sinh theo màu, cỡ để trống", () => {
    const rows = generateCombos({ ...input, sizes: "" }, [], key);
    expect(rows.map((r) => [r.colorName, r.size])).toEqual([
      ["Hồng", ""],
      ["Trắng", ""],
    ]);
  });

  it("không nhập gì thì không sinh dòng nào", () => {
    expect(generateCombos({ ...input, colors: "", sizes: "" }, [], key)).toEqual([]);
  });
});

describe("toVariantPayload", () => {
  it("đổi chữ thành số, giữ thứ tự dòng làm sortOrder", () => {
    const rows = [
      { ...emptyRow("a"), price: "650.000", stockQuantity: "3", compareAtPrice: "" },
      { ...emptyRow("b"), id: "v2", price: "", stockQuantity: "0" },
    ];
    const payload = toVariantPayload(rows);
    expect(payload[0]).toMatchObject({
      price: 650000,
      stockQuantity: 3,
      compareAtPrice: undefined,
      sortOrder: 0,
    });
    expect(payload[1]).toMatchObject({ id: "v2", price: undefined, sortOrder: 1 });
  });
});

describe("splitFieldErrors", () => {
  it("tách lỗi chung và lỗi theo dòng biến thể", () => {
    const out = splitFieldErrors({
      name: ["Vui lòng nhập tên"],
      "variants.1.price": ["Vui lòng nhập giá", "khác"],
      "variants.1.sku": ["SKU quá dài"],
      "variants.0.colorName": ["Trùng"],
    });
    expect(out.general).toEqual({ name: "Vui lòng nhập tên" });
    expect(out.variants[1]).toEqual({ price: "Vui lòng nhập giá", sku: "SKU quá dài" });
    expect(out.variants[0]).toEqual({ colorName: "Trùng" });
  });

  it("không có lỗi thì rỗng", () => {
    expect(splitFieldErrors(undefined)).toEqual({ general: {}, variants: {} });
  });
});
