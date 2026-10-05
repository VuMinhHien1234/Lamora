import { describe, expect, it } from "vitest";
import { removeVietnameseTones, slugify, toSearchText } from "@/lib/slug";

describe("slugify", () => {
  it.each([
    ["Bình hoa Mẫu đơn Lamora", "binh-hoa-mau-don-lamora"],
    ["  Quà 20/10!!  ", "qua-20-10"],
    ["ĐÀO – HỒNG PHẤN", "dao-hong-phan"],
    ["!!!", ""],
  ])("%s → %s", (input, expected) => {
    expect(slugify(input)).toBe(expected);
  });
});

describe("removeVietnameseTones", () => {
  it("bỏ dấu, đổi đ/Đ", () => {
    expect(removeVietnameseTones("Đường Hoa Sữa")).toBe("Duong Hoa Sua");
  });
});

describe("toSearchText", () => {
  it("ghép, bỏ dấu, chữ thường, bỏ phần trống", () => {
    expect(toSearchText("Bình hoa", null, "Hồng  phấn", undefined)).toBe("binh hoa hong phan");
  });
});
