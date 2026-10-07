import { describe, expect, it, vi } from "vitest";
import {
  ESTIMATED_DELIVERY_DAYS,
  FREE_SHIPPING_THRESHOLD,
  NORTH_PROVINCE_CODES,
  SHIPPING_FEES,
} from "@/config/shipping";
import { logger } from "@/lib/logger";
import { findProvince, listProvinces, listWards } from "./address-data";
import { quoteShippingSchema } from "./schema";
import {
  calculateShippingFee,
  getAddressOptions,
  getZoneByProvince,
  quoteShipping,
  resolveAddress,
} from "./service";

describe("dữ liệu địa chỉ", () => {
  it("có đủ 34 tỉnh/thành và 3.321 phường/xã", async () => {
    const provinces = listProvinces();
    expect(provinces).toHaveLength(34);
    const counts = await Promise.all(provinces.map(async (p) => (await listWards(p.code)).length));
    expect(counts.reduce((a, b) => a + b, 0)).toBe(3321);
    expect(counts.every((n) => n > 0)).toBe(true);
  });

  it("mã tỉnh không trùng, tên không dấu đúng", () => {
    const provinces = listProvinces();
    expect(new Set(provinces.map((p) => p.code)).size).toBe(34);
    expect(findProvince("01")).toMatchObject({
      name: "Thành phố Hà Nội",
      nameAscii: "thanh pho ha noi",
    });
    expect(findProvince("79")?.name).toBe("Thành phố Hồ Chí Minh");
  });

  it("danh sách vùng NORTH khớp đúng 14 tỉnh trong docs/07 mục 3.2", () => {
    const names = NORTH_PROVINCE_CODES.map((code) =>
      findProvince(code)?.name.replace(/^(Tỉnh|Thành phố) /, ""),
    );
    expect(names.sort()).toEqual(
      [
        "Hải Phòng",
        "Quảng Ninh",
        "Bắc Ninh",
        "Hưng Yên",
        "Ninh Bình",
        "Phú Thọ",
        "Thái Nguyên",
        "Tuyên Quang",
        "Lào Cai",
        "Cao Bằng",
        "Lạng Sơn",
        "Lai Châu",
        "Điện Biên",
        "Sơn La",
      ].sort(),
    );
  });
});

describe("getZoneByProvince", () => {
  it("Hà Nội, miền Bắc, và còn lại", () => {
    expect(getZoneByProvince("01")).toBe("HANOI_INNER");
    expect(getZoneByProvince("31")).toBe("NORTH");
    expect(getZoneByProvince("38")).toBe("CENTRAL_SOUTH"); // Thanh Hóa
    expect(getZoneByProvince("79")).toBe("CENTRAL_SOUTH");
  });

  it("mã lạ → CENTRAL_SOUTH và ghi cảnh báo", () => {
    const warn = vi.spyOn(logger, "warn").mockImplementation(() => undefined);
    expect(getZoneByProvince("99")).toBe("CENTRAL_SOUTH");
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });
});

describe("calculateShippingFee", () => {
  it.each(["HANOI_INNER", "NORTH", "CENTRAL_SOUTH"] as const)("vùng %s theo bảng phí", (zone) => {
    expect(calculateShippingFee(zone, 100_000)).toBe(SHIPPING_FEES[zone]);
  });

  it("ngay dưới mốc vẫn tính phí, bằng và trên mốc thì miễn phí", () => {
    expect(calculateShippingFee("NORTH", FREE_SHIPPING_THRESHOLD - 1)).toBe(35_000);
    expect(calculateShippingFee("NORTH", FREE_SHIPPING_THRESHOLD)).toBe(0);
    expect(calculateShippingFee("CENTRAL_SOUTH", FREE_SHIPPING_THRESHOLD + 1)).toBe(0);
  });
});

describe("quoteShipping", () => {
  it("trả vùng, phí, số tiền còn thiếu để được miễn phí và thời gian giao", () => {
    expect(quoteShipping("79", 500_000)).toEqual({
      zone: "CENTRAL_SOUTH",
      shippingFee: 40_000,
      freeShippingThreshold: 800_000,
      amountToFreeShipping: 300_000,
      estimatedDelivery: ESTIMATED_DELIVERY_DAYS.CENTRAL_SOUTH,
    });
    expect(quoteShipping("01", 900_000)).toMatchObject({ shippingFee: 0, amountToFreeShipping: 0 });
  });

  it("schema từ chối tiền âm, số lẻ và mã tỉnh sai định dạng", () => {
    expect(quoteShippingSchema.safeParse({ provinceCode: "01", subtotal: -1 }).success).toBe(false);
    expect(quoteShippingSchema.safeParse({ provinceCode: "01", subtotal: 1.5 }).success).toBe(
      false,
    );
    expect(quoteShippingSchema.safeParse({ provinceCode: "1", subtotal: 0 }).success).toBe(false);
  });
});

describe("getAddressOptions và resolveAddress", () => {
  it("không có mã tỉnh → danh sách tỉnh; có → phường/xã; mã lạ → rỗng", async () => {
    expect(await getAddressOptions()).toHaveLength(34);
    expect((await getAddressOptions("01")).length).toBe(126);
    expect(await getAddressOptions("99")).toEqual([]);
  });

  it("chụp tên tỉnh và phường/xã; phường không thuộc tỉnh thì null", async () => {
    const hanoiWard = (await getAddressOptions("01"))[0];
    expect(hanoiWard).toBeDefined();
    expect(await resolveAddress("01", hanoiWard?.code ?? "")).toEqual({
      provinceName: "Thành phố Hà Nội",
      wardName: hanoiWard?.name,
    });
    expect(await resolveAddress("79", hanoiWard?.code ?? "")).toBeNull();
    expect(await resolveAddress("99", "00004")).toBeNull();
  });
});
