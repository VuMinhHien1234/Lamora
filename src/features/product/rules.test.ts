import { describe, expect, it } from "vitest";
import {
  buildSearchText,
  buildSku,
  computePriceFrom,
  diffVariants,
  hasLowStock,
  listMissingForSale,
  pickFreeSku,
} from "./rules";
import type { VariantInput } from "./schema";
import type { VariantRecord } from "./types";

function record(id: string): VariantRecord {
  return {
    id,
    productId: "p",
    sku: id,
    colorName: "",
    colorHex: null,
    size: "",
    price: 100,
    compareAtPrice: null,
    stockQuantity: 1,
    isActive: true,
    sortOrder: 0,
  };
}

function input(partial: Partial<VariantInput>): VariantInput {
  return {
    colorName: "",
    size: "",
    price: 100,
    stockQuantity: 1,
    isActive: true,
    sortOrder: 0,
    ...partial,
  } as VariantInput;
}

describe("computePriceFrom", () => {
  it("lấy giá thấp nhất trong biến thể đang bán", () => {
    const variants = [
      { price: 300_000, isActive: true },
      { price: 250_000, isActive: true },
      { price: 100_000, isActive: false },
    ];
    expect(computePriceFrom(variants)).toBe(250_000);
  });

  it("không có biến thể nào đang bán thì là 0", () => {
    expect(computePriceFrom([{ price: 5, isActive: false }])).toBe(0);
    expect(computePriceFrom([])).toBe(0);
  });
});

describe("buildSearchText", () => {
  it("gộp tên, danh mục, màu; bỏ dấu, chữ thường, không lặp màu", () => {
    const text = buildSearchText("Bình hoa Mẫu đơn", "Bình hoa cắm sẵn", [
      { colorName: "Hồng phấn" },
      { colorName: "Hồng phấn" },
      { colorName: "" },
    ]);
    expect(text).toBe("binh hoa mau don binh hoa cam san hong phan");
  });
});

describe("buildSku", () => {
  it("ghép tiền tố, chữ cái đầu của tên, màu và cỡ", () => {
    expect(buildSku("Bình hoa Hồng", { colorName: "Hồng phấn", size: "Vừa (45cm)" })).toBe(
      "LMR-BHH-HONGPH-VUA45C",
    );
  });

  it("bỏ phần màu/cỡ khi để trống", () => {
    expect(buildSku("Giỏ hoa", { colorName: "", size: "" })).toBe("LMR-GH");
  });

  it("tên không có chữ cái hợp lệ thì dùng SP", () => {
    expect(buildSku("!!!", { colorName: "", size: "" })).toBe("LMR-SP");
  });
});

describe("pickFreeSku", () => {
  it("thêm -2, -3 khi trùng", async () => {
    const taken = new Set(["A", "A-2"]);
    expect(await pickFreeSku("A", async (s) => taken.has(s))).toBe("A-3");
  });
});

describe("listMissingForSale", () => {
  const ok = [{ price: 100, isActive: true }];

  it("đủ điều kiện thì không thiếu gì", () => {
    expect(listMissingForSale({ imageCount: 1, variants: ok })).toEqual([]);
  });

  it("thiếu ảnh", () => {
    expect(listMissingForSale({ imageCount: 0, variants: ok })).toHaveLength(1);
  });

  it("không có biến thể đang bán", () => {
    expect(
      listMissingForSale({ imageCount: 2, variants: [{ price: 100, isActive: false }] }),
    ).toHaveLength(1);
  });

  it("có biến thể đang bán giá 0", () => {
    const missing = listMissingForSale({ imageCount: 2, variants: [{ price: 0, isActive: true }] });
    expect(missing).toHaveLength(1);
    expect(missing[0]).toContain("giá bán");
  });

  it("báo đủ mọi thứ thiếu", () => {
    expect(listMissingForSale({ imageCount: 0, variants: [] })).toHaveLength(2);
  });
});

describe("hasLowStock", () => {
  it("chỉ tính biến thể đang bán, ngưỡng gồm cả giá trị bằng ngưỡng", () => {
    expect(hasLowStock([{ stockQuantity: 3, isActive: true }], 3)).toBe(true);
    expect(hasLowStock([{ stockQuantity: 4, isActive: true }], 3)).toBe(false);
    expect(hasLowStock([{ stockQuantity: 0, isActive: false }], 3)).toBe(false);
  });
});

describe("diffVariants", () => {
  it("phân loại sửa / tạo / bị bỏ / không tồn tại", () => {
    const diff = diffVariants(
      [record("a"), record("b")],
      [input({ id: "a" }), input({}), input({ id: "zzz" })],
    );
    expect(diff.toUpdate.map((x) => x.existing.id)).toEqual(["a"]);
    expect(diff.toCreate).toHaveLength(1);
    expect(diff.removed.map((x) => x.id)).toEqual(["b"]);
    expect(diff.unknownIds).toEqual(["zzz"]);
  });
});
