import { describe, expect, it } from "vitest";
import { AppError, isAppError } from "@/lib/errors";

describe("AppError", () => {
  it("giữ mã lỗi, thông báo và lỗi từng trường", () => {
    const error = new AppError("CONFLICT", "Slug đã tồn tại", { fieldErrors: { slug: ["trùng"] } });
    expect(error.code).toBe("CONFLICT");
    expect(error.message).toBe("Slug đã tồn tại");
    expect(error.fieldErrors).toEqual({ slug: ["trùng"] });
    expect(error).toBeInstanceOf(Error);
  });

  it("isAppError phân biệt lỗi nghiệp vụ với lỗi thường", () => {
    expect(isAppError(new AppError("NOT_FOUND", "x"))).toBe(true);
    expect(isAppError(new Error("x"))).toBe(false);
    expect(isAppError("x")).toBe(false);
  });
});
