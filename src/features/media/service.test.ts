import { createHash } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const env = vi.hoisted(() => ({
  CLOUDINARY_CLOUD_NAME: "lamora" as string | undefined,
  CLOUDINARY_API_KEY: "key123" as string | undefined,
  CLOUDINARY_API_SECRET: "secret456" as string | undefined,
}));

vi.mock("@/lib/env", () => ({ getEnv: () => env }));
vi.mock("@/lib/logger", () => ({
  logger: { warn: vi.fn(), error: vi.fn(), info: vi.fn(), debug: vi.fn() },
}));

import {
  createUploadSignature,
  deleteImage,
  folderPath,
  isShopPublicId,
  signParams,
} from "./service";

const sha1 = (text: string): string => createHash("sha1").update(text).digest("hex");

beforeEach(() => {
  env.CLOUDINARY_CLOUD_NAME = "lamora";
  env.CLOUDINARY_API_KEY = "key123";
  env.CLOUDINARY_API_SECRET = "secret456";
});

afterEach(() => vi.unstubAllGlobals());

describe("signParams", () => {
  it("xếp khóa theo thứ tự chữ cái, nối bằng & rồi cộng secret", () => {
    expect(signParams({ timestamp: 10, folder: "a", allowed_formats: "jpg" }, "S")).toBe(
      sha1("allowed_formats=jpg&folder=a&timestamp=10S"),
    );
  });
});

describe("createUploadSignature", () => {
  it("ký đúng thư mục cố định, định dạng cho phép và thời điểm", () => {
    const result = createUploadSignature("products", new Date("2026-10-06T00:00:00Z"));
    expect(result.folder).toBe("lamora/products");
    expect(result.timestamp).toBe(1791244800);
    expect(result.signature).toBe(
      sha1("allowed_formats=jpg,png,webp&folder=lamora/products&timestamp=1791244800secret456"),
    );
    expect(result.uploadUrl).toBe("https://api.cloudinary.com/v1_1/lamora/image/upload");
  });

  it("không bao giờ trả API secret ra ngoài", () => {
    expect(JSON.stringify(createUploadSignature("categories"))).not.toContain("secret456");
  });

  it("chưa cấu hình Cloudinary thì báo lỗi dễ hiểu", () => {
    env.CLOUDINARY_API_SECRET = undefined;
    expect(() => createUploadSignature("products")).toThrow(/Cloudinary/);
  });
});

describe("isShopPublicId / folderPath", () => {
  it("chỉ nhận ảnh trong thư mục lamora/", () => {
    expect(folderPath("banners")).toBe("lamora/banners");
    expect(isShopPublicId("lamora/products/abc")).toBe(true);
    expect(isShopPublicId("lamora/products/abc", "products")).toBe(true);
    expect(isShopPublicId("lamora/categories/abc", "products")).toBe(false);
    expect(isShopPublicId("other/abc")).toBe(false);
    expect(isShopPublicId("lamora/../x")).toBe(false);
    expect(isShopPublicId("lamora/")).toBe(false);
  });
});

describe("deleteImage", () => {
  it("gọi Cloudinary destroy kèm chữ ký đúng", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);
    expect(await deleteImage("lamora/products/abc")).toBe(true);
    const [url, init] = fetchMock.mock.calls[0] as [
      string,
      { method: string; body: URLSearchParams },
    ];
    expect(url).toBe("https://api.cloudinary.com/v1_1/lamora/image/destroy");
    expect(init.method).toBe("POST");
    expect(init.body.get("public_id")).toBe("lamora/products/abc");
    const timestamp = init.body.get("timestamp");
    expect(init.body.get("signature")).toBe(
      sha1(`public_id=lamora/products/abc&timestamp=${timestamp}secret456`),
    );
    expect(init.body.get("api_secret")).toBeNull();
  });

  it("không xóa ảnh ngoài thư mục cửa hàng", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    expect(await deleteImage("someone-else/photo")).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("lỗi mạng hoặc Cloudinary từ chối thì trả false, không ném lỗi", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    expect(await deleteImage("lamora/products/a")).toBe(false);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 500 }));
    expect(await deleteImage("lamora/products/a")).toBe(false);
  });

  it("chưa cấu hình thì trả false", async () => {
    env.CLOUDINARY_CLOUD_NAME = undefined;
    expect(await deleteImage("lamora/products/a")).toBe(false);
  });
});
