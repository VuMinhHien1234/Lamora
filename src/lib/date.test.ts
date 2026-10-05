import { describe, expect, it } from "vitest";
import { formatDate } from "./date";

describe("formatDate", () => {
  it("hiển thị theo giờ Việt Nam, không theo UTC", () => {
    // 20:00 UTC ngày 5/10 đã là 03:00 ngày 6/10 ở Việt Nam
    expect(formatDate(new Date("2026-10-05T20:00:00Z"))).toBe("06/10/2026");
  });

  it("giữ nguyên ngày khi còn trong cùng ngày", () => {
    expect(formatDate(new Date("2026-10-05T05:00:00Z"))).toBe("05/10/2026");
  });
});
