import { afterEach, describe, expect, it, vi } from "vitest";

const BASE_ENV = {
  DATABASE_URL: "postgresql://u:p@localhost:5432/db",
  DIRECT_URL: "postgresql://u:p@localhost:5432/db",
  AUTH_SECRET: "x".repeat(32),
  IP_HASH_SALT: "x".repeat(32),
  CRON_SECRET: "x".repeat(32),
  NEXT_PUBLIC_SITE_URL: "https://lamoraflower.vn",
};

async function load(env: Record<string, string>) {
  vi.resetModules();
  vi.unstubAllEnvs();
  for (const [key, value] of Object.entries({ ...BASE_ENV, ...env })) vi.stubEnv(key, value);
  return (await import("./cloudinary")).cloudinaryUrl;
}

afterEach(() => vi.unstubAllEnvs());

describe("cloudinaryUrl", () => {
  it("dựng địa chỉ ảnh tỉ lệ 4:5 với f_auto,q_auto", async () => {
    const cloudinaryUrl = await load({ CLOUDINARY_CLOUD_NAME: "lamora" });
    expect(cloudinaryUrl("lamora/products/a", { width: 96 })).toBe(
      "https://res.cloudinary.com/lamora/image/upload/f_auto,q_auto,c_fill,ar_4:5,w_96/lamora/products/a",
    );
  });

  it("chưa cấu hình Cloudinary thì trả về null", async () => {
    const cloudinaryUrl = await load({});
    expect(cloudinaryUrl("a", { width: 96 })).toBeNull();
  });
});
