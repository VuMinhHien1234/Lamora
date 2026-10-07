import { describe, expect, it } from "vitest";
import { normalizeSearch } from "./picker-rules";

describe("normalizeSearch", () => {
  it("bỏ dấu, đ→d, hạ chữ thường", () => {
    expect(normalizeSearch("  Hoa Hồng ĐỎ ")).toBe("hoa hong do");
  });
});
