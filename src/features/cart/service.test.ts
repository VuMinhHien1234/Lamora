import { describe, expect, it } from "vitest";
import {
  MAX_LINE_QUANTITY,
  addToCart,
  countItems,
  parseStoredCart,
  removeLine,
  serializeCart,
  setLineQuantity,
} from "./service";

describe("addToCart", () => {
  it("tạo dòng mới", () => {
    expect(addToCart([], "v1")).toEqual([{ variantId: "v1", quantity: 1 }]);
  });

  it("cộng dồn vào dòng đã có, không đụng dòng khác", () => {
    const lines = [
      { variantId: "v1", quantity: 2 },
      { variantId: "v2", quantity: 1 },
    ];
    expect(addToCart(lines, "v1", 3)).toEqual([
      { variantId: "v1", quantity: 5 },
      { variantId: "v2", quantity: 1 },
    ]);
  });

  it("không vượt quá 99 mỗi dòng", () => {
    const result = addToCart([{ variantId: "v1", quantity: 98 }], "v1", 5);
    expect(result[0]?.quantity).toBe(MAX_LINE_QUANTITY);
  });

  it("bỏ qua số lượng 0, âm hoặc không phải số", () => {
    expect(addToCart([], "v1", 0)).toEqual([]);
    expect(addToCart([], "v1", -2)).toEqual([]);
    expect(addToCart([], "v1", Number.NaN)).toEqual([]);
  });

  it("không sửa mảng gốc", () => {
    const lines = [{ variantId: "v1", quantity: 1 }];
    addToCart(lines, "v1", 1);
    expect(lines[0]?.quantity).toBe(1);
  });
});

describe("setLineQuantity / removeLine", () => {
  const lines = [
    { variantId: "v1", quantity: 2 },
    { variantId: "v2", quantity: 1 },
  ];

  it("đặt số lượng mới", () => {
    expect(setLineQuantity(lines, "v1", 7)[0]?.quantity).toBe(7);
  });

  it("số lượng 0 hoặc âm thì xóa dòng", () => {
    expect(setLineQuantity(lines, "v1", 0)).toEqual([{ variantId: "v2", quantity: 1 }]);
    expect(setLineQuantity(lines, "v1", -1)).toEqual([{ variantId: "v2", quantity: 1 }]);
  });

  it("chặn trên 99", () => {
    expect(setLineQuantity(lines, "v1", 500)[0]?.quantity).toBe(MAX_LINE_QUANTITY);
  });

  it("xóa dòng", () => {
    expect(removeLine(lines, "v2")).toEqual([{ variantId: "v1", quantity: 2 }]);
  });
});

describe("countItems", () => {
  it("cộng số lượng các dòng", () => {
    expect(countItems([])).toBe(0);
    expect(
      countItems([
        { variantId: "a", quantity: 2 },
        { variantId: "b", quantity: 3 },
      ]),
    ).toBe(5);
  });
});

describe("parseStoredCart", () => {
  it("đọc lại đúng dữ liệu đã lưu", () => {
    const lines = [{ variantId: "v1", quantity: 2 }];
    expect(parseStoredCart(serializeCart(lines))).toEqual(lines);
  });

  it.each([
    null,
    "",
    "không phải JSON",
    "{}",
    '[{"variantId":"a"}]',
    '[{"variantId":"a","quantity":0}]',
    '[{"variantId":"a","quantity":100}]',
    '[{"variantId":"a","quantity":1.5}]',
  ])("dữ liệu hỏng %s → giỏ trống", (raw) => {
    expect(parseStoredCart(raw)).toEqual([]);
  });
});
