import { describe, expect, it } from "vitest";
import { formatDate, vnDateString } from "./date";

describe("formatDate", () => {
  it("hiển thị theo giờ Việt Nam, không theo UTC", () => {
    // 20:00 UTC ngày 5/10 đã là 03:00 ngày 6/10 ở Việt Nam
    expect(formatDate(new Date("2026-10-05T20:00:00Z"))).toBe("06/10/2026");
  });

  it("giữ nguyên ngày khi còn trong cùng ngày", () => {
    expect(formatDate(new Date("2026-10-05T05:00:00Z"))).toBe("05/10/2026");
  });
});

describe("vnDateString", () => {
  it("lấy ngày theo giờ Việt Nam", () => {
    expect(vnDateString(new Date("2026-10-05T20:00:00Z"))).toBe("2026-10-06");
  });

  it("cộng ngày, qua tháng", () => {
    expect(vnDateString(new Date("2026-10-05T05:00:00Z"), 30)).toBe("2026-11-04");
  });
});
