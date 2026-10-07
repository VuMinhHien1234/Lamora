import { describe, expect, it } from "vitest";
import { assertVndAmount, formatVnd, roundVnd } from "@/lib/money";

describe("formatVnd", () => {
  it.each([
    [0, "0₫"],
    [500, "500₫"],
    [350000, "350.000₫"],
    [1234567, "1.234.567₫"],
    [-20000, "-20.000₫"],
  ])("%i → %s", (amount, expected) => {
    expect(formatVnd(amount)).toBe(expected);
  });

  it("từ chối số thực và giá trị không hợp lệ", () => {
    expect(() => formatVnd(1000.5)).toThrow(RangeError);
    expect(() => formatVnd(Number.NaN)).toThrow(RangeError);
    expect(() => assertVndAmount(Infinity)).toThrow(RangeError);
  });
});

describe("roundVnd", () => {
  it("làm tròn về số nguyên", () => {
    expect(roundVnd(1999.6)).toBe(2000);
    expect(roundVnd(1999.4)).toBe(1999);
  });
});
