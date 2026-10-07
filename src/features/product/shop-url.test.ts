import { describe, expect, it } from "vitest";
import { buildShopUrl, hasActiveFilter, parseShopState, priceRangeLabel } from "./shop-url";

describe("parseShopState", () => {
  it("đọc đủ các tham số", () => {
    const state = parseShopState({
      mau: ["Hồng phấn", "Trắng kem"],
      gia: "200000-500000",
      "sap-xep": "gia-tang",
      trang: "2",
    });
    expect(state).toMatchObject({
      colors: ["Hồng phấn", "Trắng kem"],
      priceMin: 200000,
      priceMax: 500000,
      sort: "price_asc",
      page: 2,
    });
  });

  it("giá trị lạ → mặc định", () => {
    const state = parseShopState({ gia: "abc", "sap-xep": "xyz", trang: "-3", mau: "" });
    expect(state).toEqual({ colors: [], sort: "newest", page: 1, q: undefined });
  });

  it("giá không giới hạn một phía và khoảng ngược bị bỏ", () => {
    expect(parseShopState({ gia: "1000000-" })).toMatchObject({ priceMin: 1000000 });
    expect(parseShopState({ gia: "0-200000" })).toMatchObject({ priceMax: 200000 });
    expect(parseShopState({ gia: "900-100" }).priceMin).toBeUndefined();
  });

  it("loại màu trùng", () => {
    expect(parseShopState({ mau: ["Đỏ", "Đỏ"] }).colors).toEqual(["Đỏ"]);
  });
});

describe("buildShopUrl", () => {
  const base = parseShopState({});
  it("trạng thái mặc định → địa chỉ gốc", () => {
    expect(buildShopUrl("/san-pham", base)).toBe("/san-pham");
  });

  it("ghi lại bộ lọc, sắp xếp, trang", () => {
    const state = parseShopState({ mau: "Đỏ", gia: "0-200000", "sap-xep": "noi-bat", trang: "3" });
    const url = buildShopUrl("/san-pham", state);
    expect(url).toContain("mau=%C4%90%E1%BB%8F");
    expect(url).toContain("gia=0-200000");
    expect(url).toContain("sap-xep=noi-bat");
    expect(url).toContain("trang=3");
  });

  it("ghi đè và giữ q", () => {
    const state = { ...base, q: "hoa hồng" };
    expect(buildShopUrl("/tim-kiem", state, { page: 1, colors: [] })).toBe(
      "/tim-kiem?q=hoa+h%E1%BB%93ng",
    );
  });
});

describe("helpers", () => {
  it("hasActiveFilter và priceRangeLabel", () => {
    expect(hasActiveFilter(parseShopState({}))).toBe(false);
    const state = parseShopState({ gia: "200000-500000" });
    expect(hasActiveFilter(state)).toBe(true);
    expect(priceRangeLabel(state)).toBe("200.000₫ – 500.000₫");
    expect(priceRangeLabel(parseShopState({ gia: "0-500000" }))).toBe("Dưới 500.000₫");
    expect(priceRangeLabel(parseShopState({ gia: "300000-" }))).toBe("Trên 300.000₫");
  });
});
