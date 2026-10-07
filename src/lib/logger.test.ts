import { afterEach, describe, expect, it, vi } from "vitest";
import { logger, maskPhone } from "@/lib/logger";

describe("maskPhone", () => {
  it("che phần giữa số điện thoại", () => {
    expect(maskPhone("0912345678")).toBe("0912***678");
    expect(maskPhone("0912 345 678")).toBe("0912***678");
    expect(maskPhone("123")).toBe("***");
  });
});

describe("logger", () => {
  afterEach(() => vi.restoreAllMocks());

  it("ghi JSON một dòng kèm ngữ cảnh", () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => undefined);
    logger.info("Tạo đơn", { orderCode: "LMR-261005-AB12" });
    const line = JSON.parse(String(spy.mock.calls[0]?.[0])) as Record<string, unknown>;
    expect(line).toMatchObject({ level: "info", message: "Tạo đơn", orderCode: "LMR-261005-AB12" });
  });

  it("ghi lỗi kèm tên và thông báo lỗi", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    logger.error("Hỏng", new Error("boom"));
    const line = JSON.parse(String(spy.mock.calls[0]?.[0])) as { error: { message: string } };
    expect(line.error.message).toBe("boom");
  });
});
