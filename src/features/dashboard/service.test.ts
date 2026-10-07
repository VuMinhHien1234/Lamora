import { describe, expect, it, vi } from "vitest";

vi.mock("./repository", () => ({
  countPendingOrders: vi.fn().mockResolvedValue(2),
  countUnpaidTransferOrders: vi.fn().mockResolvedValue(1),
  sumRevenue: vi.fn().mockResolvedValue({ today: 500_000, week: 1_800_000 }),
  listLowStock: vi.fn().mockResolvedValue([]),
  pingDatabase: vi.fn(),
}));

import * as repo from "./repository";
import { checkHealth, getAdminSummary, summaryRanges } from "./service";

describe("summaryRanges", () => {
  it("tính đầu ngày theo giờ Việt Nam (UTC+7)", () => {
    // 20:00 UTC ngày 5/10 = 03:00 ngày 6/10 giờ Việt Nam
    const { todayStart, weekStart } = summaryRanges(new Date("2026-10-05T20:00:00Z"));
    expect(todayStart.toISOString()).toBe("2026-10-05T17:00:00.000Z");
    expect(weekStart.toISOString()).toBe("2026-09-29T17:00:00.000Z");
  });

  it("trước nửa đêm giờ Việt Nam vẫn thuộc ngày đó", () => {
    const { todayStart } = summaryRanges(new Date("2026-10-06T16:59:00Z"));
    expect(todayStart.toISOString()).toBe("2026-10-05T17:00:00.000Z");
  });
});

describe("getAdminSummary", () => {
  it("gộp số liệu từ repository", async () => {
    const summary = await getAdminSummary(new Date("2026-10-06T05:00:00Z"));
    expect(summary).toEqual({
      pendingOrders: 2,
      unpaidTransferOrders: 1,
      revenueToday: 500_000,
      revenue7Days: 1_800_000,
      lowStock: [],
    });
    expect(repo.listLowStock).toHaveBeenCalledWith(3, 5);
  });
});

describe("checkHealth", () => {
  it("ném lỗi khi database không phản hồi", async () => {
    vi.mocked(repo.pingDatabase).mockRejectedValueOnce(new Error("down"));
    await expect(checkHealth()).rejects.toThrow("down");
  });
});
