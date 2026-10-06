import { describe, expect, it } from "vitest";
import { checkImageFile, fitWithin, needsCompression, MAX_UPLOAD_BYTES } from "./upload-rules";

describe("checkImageFile", () => {
  it("nhận jpg, png, webp", () => {
    for (const type of ["image/jpeg", "image/png", "image/webp"]) {
      expect(checkImageFile({ type, size: 1000 })).toBeNull();
    }
  });

  it("từ chối loại khác", () => {
    expect(checkImageFile({ type: "image/gif", size: 1000 })).toContain("JPG");
    expect(checkImageFile({ type: "application/pdf", size: 1000 })).toContain("JPG");
  });

  it("từ chối ảnh gốc quá lớn", () => {
    expect(checkImageFile({ type: "image/png", size: 50 * 1024 * 1024 })).toContain("quá lớn");
  });
});

describe("needsCompression", () => {
  it("chỉ nén khi lớn hơn 5 MB", () => {
    expect(needsCompression({ type: "image/png", size: MAX_UPLOAD_BYTES })).toBe(false);
    expect(needsCompression({ type: "image/png", size: MAX_UPLOAD_BYTES + 1 })).toBe(true);
  });
});

describe("fitWithin", () => {
  it("giữ nguyên ảnh nhỏ", () => {
    expect(fitWithin(1000, 800, 2400)).toEqual({ width: 1000, height: 800 });
  });

  it("thu nhỏ theo cạnh dài, giữ tỉ lệ", () => {
    expect(fitWithin(4800, 3600, 2400)).toEqual({ width: 2400, height: 1800 });
    expect(fitWithin(3000, 6000, 2400)).toEqual({ width: 1200, height: 2400 });
  });
});
