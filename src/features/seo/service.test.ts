import { describe, expect, it, vi } from "vitest";

vi.mock("./repository", () => ({ loadSitemapSource: vi.fn() }));

import { buildSitemapEntries } from "./service";

const at = new Date("2026-10-05T00:00:00Z");

describe("buildSitemapEntries", () => {
  const entries = buildSitemapEntries({
    products: [{ slug: "mau-don", updatedAt: at }],
    categories: [{ slug: "binh-hoa", updatedAt: at }],
    collections: [{ slug: "sinh-nhat", updatedAt: at }],
  });
  const paths = entries.map((e) => e.path);

  it("có trang chủ, danh mục, bộ sưu tập, sản phẩm và trang tĩnh", () => {
    expect(paths).toEqual(
      expect.arrayContaining([
        "/",
        "/san-pham",
        "/danh-muc/binh-hoa",
        "/bo-suu-tap/sinh-nhat",
        "/san-pham/mau-don",
        "/gioi-thieu",
        "/chinh-sach-doi-tra",
      ]),
    );
  });

  it("sản phẩm kèm ngày cập nhật", () => {
    expect(entries.find((e) => e.path === "/san-pham/mau-don")?.lastModified).toBe(at);
  });

  it("không có trang nhạy cảm", () => {
    expect(paths.some((p) => /admin|gio-hang|thanh-toan|tra-cuu|dat-hang/.test(p))).toBe(false);
  });
});
