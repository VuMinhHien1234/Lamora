import { describe, expect, it } from "vitest";
import { normalizePhone } from "./phone";

describe("normalizePhone", () => {
  it("giữ nguyên số hợp lệ", () => {
    expect(normalizePhone("0912345678")).toBe("0912345678");
  });

  it("bỏ khoảng trắng, dấu chấm, gạch", () => {
    expect(normalizePhone("0912 345 678")).toBe("0912345678");
    expect(normalizePhone("0912.345.678")).toBe("0912345678");
    expect(normalizePhone("0912-345-678")).toBe("0912345678");
  });

  it("đổi +84 và 84 về 0", () => {
    expect(normalizePhone("+84912345678")).toBe("0912345678");
    expect(normalizePhone("84912345678")).toBe("0912345678");
  });

  it("từ chối số sai", () => {
    expect(normalizePhone("123")).toBeNull();
    expect(normalizePhone("0212345678")).toBeNull();
    expect(normalizePhone("09123456789")).toBeNull();
    expect(normalizePhone("abc")).toBeNull();
    expect(normalizePhone("")).toBeNull();
  });
});
