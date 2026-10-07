import { describe, expect, it } from "vitest";
import { signToken, verifyToken } from "./signed-token";

const NOW = new Date("2026-10-06T00:00:00Z");

describe("signed token", () => {
  it("ký rồi kiểm tra lại được", () => {
    const token = signToken("LMR-261006-ABCD", "s3cret", { ttlSeconds: 3600, now: NOW });
    expect(verifyToken(token, "s3cret", NOW)).toBe("LMR-261006-ABCD");
  });

  it("hết hạn thì không hợp lệ", () => {
    const token = signToken("x", "s3cret", { ttlSeconds: 3600, now: NOW });
    expect(verifyToken(token, "s3cret", new Date(NOW.getTime() + 3601_000))).toBeNull();
    expect(verifyToken(token, "s3cret", new Date(NOW.getTime() + 3599_000))).toBe("x");
  });

  it("sai khóa hoặc bị sửa nội dung thì không hợp lệ", () => {
    const token = signToken("A", "s3cret", { ttlSeconds: 3600, now: NOW });
    expect(verifyToken(token, "khac", NOW)).toBeNull();
    const [, exp, sig] = token.split(".");
    const forged = `${Buffer.from("B").toString("base64url")}.${exp}.${sig}`;
    expect(verifyToken(forged, "s3cret", NOW)).toBeNull();
  });

  it("từ chối chuỗi hỏng hoặc rỗng", () => {
    expect(verifyToken(undefined, "s", NOW)).toBeNull();
    expect(verifyToken("abc", "s", NOW)).toBeNull();
    expect(verifyToken("a.b.c", "s", NOW)).toBeNull();
  });
});
