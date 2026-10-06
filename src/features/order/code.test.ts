import { describe, expect, it } from "vitest";
import { generateOrderCode } from "./code";

describe("generateOrderCode", () => {
  it("đúng định dạng và ngày theo giờ Việt Nam", () => {
    const code = generateOrderCode(new Date("2026-10-05T20:00:00Z"));
    expect(code).toMatch(/^LMR-261006-[A-HJ-NP-Z2-9]{4}$/);
  });

  it("không chứa ký tự dễ nhầm O 0 I 1", () => {
    for (let i = 0; i < 300; i++) {
      expect(generateOrderCode().slice(11)).not.toMatch(/[O0I1]/);
    }
  });

  it("sinh nhiều mã khác nhau", () => {
    const codes = new Set(Array.from({ length: 50 }, () => generateOrderCode()));
    expect(codes.size).toBeGreaterThan(40);
  });
});
