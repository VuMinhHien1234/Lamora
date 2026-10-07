import { describe, expect, it } from "vitest";
import {
  checkRateLimit,
  getClientIp,
  hashIp,
  type RateLimitRule,
  type RateLimitStore,
} from "@/lib/rate-limit";

function createMemoryStore(): RateLimitStore {
  const hits = new Map<string, Date[]>();
  return {
    async countSince(key, since) {
      const recent = (hits.get(key) ?? []).filter((at) => at >= since);
      return { count: recent.length, oldest: recent[0] ?? null };
    },
    async record(key, at) {
      hits.set(key, [...(hits.get(key) ?? []), at]);
    },
  };
}

const rule: RateLimitRule = { key: "order:abc", limit: 3, windowSeconds: 600 };
const t0 = new Date("2026-10-05T10:00:00Z");
const after = (seconds: number): Date => new Date(t0.getTime() + seconds * 1000);

describe("checkRateLimit", () => {
  it("cho phép đến hết giới hạn rồi chặn", async () => {
    const store = createMemoryStore();
    const results = [];
    for (let i = 0; i < 4; i++) results.push(await checkRateLimit(rule, store, { now: after(i) }));
    expect(results.map((r) => r.allowed)).toEqual([true, true, true, false]);
    expect(results[0]?.remaining).toBe(2);
    expect(results[2]?.remaining).toBe(0);
  });

  it("báo thời gian chờ tính từ lần ghi sớm nhất", async () => {
    const store = createMemoryStore();
    for (let i = 0; i < 3; i++) await checkRateLimit(rule, store, { now: after(i) });
    const blocked = await checkRateLimit(rule, store, { now: after(100) });
    expect(blocked).toEqual({ allowed: false, remaining: 0, retryAfterSeconds: 500 });
  });

  it("hết cửa sổ thời gian thì được phép lại", async () => {
    const store = createMemoryStore();
    for (let i = 0; i < 3; i++) await checkRateLimit(rule, store, { now: after(i) });
    const later = await checkRateLimit(rule, store, { now: after(700) });
    expect(later.allowed).toBe(true);
  });

  it("record=false chỉ kiểm tra, không đếm thêm", async () => {
    const store = createMemoryStore();
    for (let i = 0; i < 5; i++) await checkRateLimit(rule, store, { record: false, now: after(i) });
    const result = await checkRateLimit(rule, store, { now: after(10) });
    expect(result.remaining).toBe(2);
  });

  it("các khóa khác nhau đếm riêng", async () => {
    const store = createMemoryStore();
    for (let i = 0; i < 3; i++) await checkRateLimit(rule, store, { now: after(i) });
    const other = await checkRateLimit({ ...rule, key: "order:xyz" }, store, { now: after(5) });
    expect(other.allowed).toBe(true);
  });
});

describe("hashIp / getClientIp", () => {
  it("hashIp ổn định, phụ thuộc muối, không chứa IP gốc", () => {
    const a = hashIp("1.2.3.4", "salt1");
    expect(a).toBe(hashIp("1.2.3.4", "salt1"));
    expect(a).not.toBe(hashIp("1.2.3.4", "salt2"));
    expect(a).toMatch(/^[0-9a-f]{64}$/);
    expect(a).not.toContain("1.2.3.4");
  });

  it("ưu tiên header Netlify, dự phòng x-forwarded-for", () => {
    expect(
      getClientIp(
        new Headers({ "x-nf-client-connection-ip": "9.9.9.9", "x-forwarded-for": "1.1.1.1" }),
      ),
    ).toBe("9.9.9.9");
    expect(getClientIp(new Headers({ "x-forwarded-for": "1.1.1.1, 2.2.2.2" }))).toBe("1.1.1.1");
    expect(getClientIp(new Headers())).toBe("unknown");
  });
});
