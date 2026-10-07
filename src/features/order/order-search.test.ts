import { describe, expect, it } from "vitest";
import { dateRange, isDeliverySoon, normalizeOrderQuery } from "./order-search";

describe("normalizeOrderQuery", () => {
  it("mã không dấu gạch → mã đầy đủ", () => {
    expect(normalizeOrderQuery("LMR261005K7QF").exactCode).toBe("LMR-261005-K7QF");
    expect(normalizeOrderQuery(" lmr261005k7qf ").exactCode).toBe("LMR-261005-K7QF");
  });
  it("mã có dấu gạch vẫn nhận ra", () => {
    expect(normalizeOrderQuery("LMR-261005-K7QF").exactCode).toBe("LMR-261005-K7QF");
  });
  it("từ khóa khác không phải mã", () => {
    expect(normalizeOrderQuery("Nguyễn").exactCode).toBeNull();
    expect(normalizeOrderQuery("0912").exactCode).toBeNull();
  });
});

describe("dateRange", () => {
  it("tính theo giờ Việt Nam, đến hết ngày cuối", () => {
    const range = dateRange("2026-10-05", "2026-10-06");
    expect(range?.gte?.toISOString()).toBe("2026-10-04T17:00:00.000Z");
    expect(range?.lt?.toISOString()).toBe("2026-10-06T17:00:00.000Z");
  });
  it("không có ngày → undefined", () => expect(dateRange()).toBeUndefined());
});

describe("isDeliverySoon", () => {
  const now = new Date("2026-10-05T05:00:00Z");
  it("trong 2 ngày tới", () => {
    expect(isDeliverySoon("2026-10-05", now)).toBe(true);
    expect(isDeliverySoon("2026-10-07", now)).toBe(true);
  });
  it("xa hơn, đã qua, hoặc không có", () => {
    expect(isDeliverySoon("2026-10-08", now)).toBe(false);
    expect(isDeliverySoon("2026-10-04", now)).toBe(false);
    expect(isDeliverySoon(null, now)).toBe(false);
  });
});
