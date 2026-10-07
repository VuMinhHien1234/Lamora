import { describe, expect, it } from "vitest";
import { parseEnv } from "@/lib/env";

const SECRET = "x".repeat(32);
const valid = {
  DATABASE_URL: "postgresql://u:p@host/db",
  DIRECT_URL: "postgresql://u:p@host/db",
  AUTH_SECRET: SECRET,
  IP_HASH_SALT: SECRET,
  CRON_SECRET: SECRET,
  NEXT_PUBLIC_SITE_URL: "https://lamoraflower.vn",
};

describe("parseEnv", () => {
  it("nhận cấu hình tối thiểu, biến tùy chọn rỗng thành undefined", () => {
    const env = parseEnv({ ...valid, CLOUDINARY_API_KEY: "  " });
    expect(env.CLOUDINARY_API_KEY).toBeUndefined();
    expect(env.TELEGRAM_ENABLED).toBe(false);
    expect(env.NODE_ENV).toBe("development");
  });

  it("TELEGRAM_ENABLED=true bật cờ", () => {
    expect(parseEnv({ ...valid, TELEGRAM_ENABLED: "true" }).TELEGRAM_ENABLED).toBe(true);
  });

  it("NEXT_PUBLIC_GA_ID: rỗng = tắt, đúng dạng G-… thì nhận, sai dạng thì báo lỗi", () => {
    expect(parseEnv({ ...valid, NEXT_PUBLIC_GA_ID: "" }).NEXT_PUBLIC_GA_ID).toBeUndefined();
    expect(parseEnv({ ...valid, NEXT_PUBLIC_GA_ID: "G-ABC123" }).NEXT_PUBLIC_GA_ID).toBe(
      "G-ABC123",
    );
    expect(() => parseEnv({ ...valid, NEXT_PUBLIC_GA_ID: "UA-1" })).toThrow("NEXT_PUBLIC_GA_ID");
  });

  it("báo rõ biến nào sai nhưng không in giá trị", () => {
    expect.assertions(3);
    try {
      parseEnv({ ...valid, AUTH_SECRET: "ngan-qua", DATABASE_URL: undefined });
    } catch (error) {
      const message = (error as Error).message;
      expect(message).toContain("AUTH_SECRET");
      expect(message).toContain("DATABASE_URL");
      expect(message).not.toContain("ngan-qua");
    }
  });
});
