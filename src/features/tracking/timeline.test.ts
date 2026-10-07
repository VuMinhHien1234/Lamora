import { describe, expect, it } from "vitest";
import { buildTimeline } from "./timeline";

const history = [
  { status: "PENDING", at: "2026-10-05T03:00:00Z" },
  { status: "CONFIRMED", at: "2026-10-05T04:00:00Z" },
];

describe("buildTimeline", () => {
  it("đánh dấu các bước đã qua và thời điểm", () => {
    const { steps, closed } = buildTimeline("CONFIRMED", history);
    expect(steps.map((s) => s.reached)).toEqual([true, true, false, false]);
    expect(steps[1]?.at).toBe("2026-10-05T04:00:00Z");
    expect(closed).toBeNull();
  });

  it("đơn đã hủy: tách riêng, chỉ giữ các bước đã thực sự đi qua", () => {
    const { steps, closed } = buildTimeline("CANCELLED", [
      ...history,
      { status: "CANCELLED", at: "2026-10-05T05:00:00Z" },
    ]);
    expect(closed?.status).toBe("CANCELLED");
    expect(steps.map((s) => s.reached)).toEqual([true, true, false, false]);
  });

  it("đơn đã giao: tất cả các bước đều đạt", () => {
    const { steps } = buildTimeline("DELIVERED", history);
    expect(steps.every((s) => s.reached)).toBe(true);
  });
});
