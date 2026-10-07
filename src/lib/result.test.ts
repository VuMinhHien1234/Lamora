import { describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { AppError } from "@/lib/errors";
import { fail, ok, toErrorResult, zodFieldErrors } from "@/lib/result";

describe("ok / fail", () => {
  it("tạo kết quả thành công và thất bại", () => {
    expect(ok(5)).toEqual({ ok: true, data: 5 });
    expect(fail("NOT_FOUND", "Không tìm thấy")).toEqual({
      ok: false,
      error: { code: "NOT_FOUND", message: "Không tìm thấy" },
    });
  });
});

describe("toErrorResult", () => {
  it("giữ nguyên AppError", () => {
    const result = toErrorResult(new AppError("CART_INVALID", "Hết hàng"));
    expect(result).toEqual({ ok: false, error: { code: "CART_INVALID", message: "Hết hàng" } });
  });

  it("chuyển lỗi Zod thành lỗi từng trường", () => {
    const parsed = z.object({ name: z.string().min(2) }).safeParse({ name: "a" });
    if (parsed.success) throw new Error("test cần dữ liệu sai");
    const result = toErrorResult(parsed.error);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("VALIDATION_ERROR");
      expect(result.error.fieldErrors?.name).toHaveLength(1);
    }
  });

  it("lỗi lạ: trả thông báo chung, không lộ chi tiết", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const result = toErrorResult(new Error("password=secret"));
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("INTERNAL_ERROR");
      expect(result.error.message).not.toContain("secret");
    }
    spy.mockRestore();
  });
});

describe("zodFieldErrors", () => {
  it("lỗi cấp object nằm ở khóa _form", () => {
    const schema = z.object({ a: z.string() }).refine(() => false, "sai");
    const parsed = schema.safeParse({ a: "x" });
    if (parsed.success) throw new Error("test cần dữ liệu sai");
    expect(zodFieldErrors(parsed.error)._form).toEqual(["sai"]);
  });
});
