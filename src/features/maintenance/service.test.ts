import { describe, expect, it, vi } from "vitest";

vi.mock("./repository", () => ({
  deleteRateLimitHitsBefore: vi.fn().mockResolvedValue(7),
  clearOrderIpHashBefore: vi.fn().mockResolvedValue(2),
}));

import * as repo from "./repository";
import { runCleanup } from "./service";

describe("runCleanup", () => {
  it("xóa bộ đếm cũ hơn 1 ngày và ipHash cũ hơn 90 ngày", async () => {
    const now = new Date("2026-10-06T00:00:00Z");
    const result = await runCleanup(now);
    expect(result).toEqual({ rateLimitHitsDeleted: 7, ipHashesCleared: 2 });
    expect(repo.deleteRateLimitHitsBefore).toHaveBeenCalledWith(new Date("2026-10-05T00:00:00Z"));
    expect(repo.clearOrderIpHashBefore).toHaveBeenCalledWith(new Date("2026-07-08T00:00:00Z"));
  });
});
