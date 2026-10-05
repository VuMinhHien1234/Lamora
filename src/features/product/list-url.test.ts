import { describe, expect, it } from "vitest";
import { buildListUrl } from "./list-url";

describe("buildListUrl", () => {
  it("không có bộ lọc thì là địa chỉ gốc", () => {
    expect(buildListUrl({})).toBe("/admin/san-pham");
  });

  it("giữ bộ lọc và bỏ trang 1", () => {
    expect(buildListUrl({ q: "hoa hồng", status: "ACTIVE", lowStock: true, page: 1 })).toBe(
      "/admin/san-pham?q=hoa+h%E1%BB%93ng&status=ACTIVE&lowStock=1",
    );
  });

  it("ghi đè một phần: đổi trạng thái thì về trang 1", () => {
    expect(buildListUrl({ status: "DRAFT", page: 3 }, { status: "ACTIVE", page: 1 })).toBe(
      "/admin/san-pham?status=ACTIVE",
    );
  });

  it("ghi đè trang", () => {
    expect(buildListUrl({ categoryId: "c1" }, { page: 4 })).toBe(
      "/admin/san-pham?categoryId=c1&page=4",
    );
  });
});
