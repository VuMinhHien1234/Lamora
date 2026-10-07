import { describe, expect, it } from "vitest";
import { buildOrderListUrl } from "./list-url";

describe("buildOrderListUrl", () => {
  it("không bộ lọc → đường dẫn gốc", () => expect(buildOrderListUrl({})).toBe("/admin/don-hang"));
  it("giữ bộ lọc, bỏ giá trị trống và trang 1", () => {
    expect(buildOrderListUrl({ status: "PENDING", q: "", page: 1 })).toBe(
      "/admin/don-hang?status=PENDING",
    );
  });
  it("ghi đè và ghi trang", () => {
    expect(buildOrderListUrl({ status: "PENDING", q: "an" }, { status: undefined, page: 3 })).toBe(
      "/admin/don-hang?q=an&page=3",
    );
  });
});
