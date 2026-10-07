import { describe, expect, it } from "vitest";
import { isValidCronAuth } from "./cron-auth";

const SECRET = "s".repeat(32);

describe("isValidCronAuth", () => {
  it("chấp nhận đúng secret", () => {
    expect(isValidCronAuth(`Bearer ${SECRET}`, SECRET)).toBe(true);
  });
  it("từ chối thiếu header, sai kiểu, sai secret, khác độ dài", () => {
    expect(isValidCronAuth(null, SECRET)).toBe(false);
    expect(isValidCronAuth(SECRET, SECRET)).toBe(false);
    expect(isValidCronAuth(`Bearer ${"x".repeat(32)}`, SECRET)).toBe(false);
    expect(isValidCronAuth("Bearer short", SECRET)).toBe(false);
    expect(isValidCronAuth("Bearer ", SECRET)).toBe(false);
  });
});
