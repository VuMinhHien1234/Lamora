import { describe, expect, it } from "vitest";
import { pageWindow } from "./pagination";

describe("pageWindow", () => {
  it("ít trang thì hiện hết", () => {
    expect(pageWindow(1, 3)).toEqual([1, 2, 3]);
  });

  it("nhiều trang: chèn chỗ bỏ qua", () => {
    expect(pageWindow(5, 10)).toEqual([1, "gap", 4, 5, 6, "gap", 10]);
  });

  it("đầu và cuối danh sách", () => {
    expect(pageWindow(1, 10)).toEqual([1, 2, "gap", 10]);
    expect(pageWindow(10, 10)).toEqual([1, "gap", 9, 10]);
  });

  it("không chèn gap khi chỉ cách 1 trang", () => {
    expect(pageWindow(3, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it("một trang", () => {
    expect(pageWindow(1, 1)).toEqual([1]);
  });
});
