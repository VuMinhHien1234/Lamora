import { beforeEach, describe, expect, it, vi } from "vitest";
import * as repo from "./shop-repository";
import { shopListSchema } from "./shop-schema";
import { getShopProduct, listShopProducts, suggest } from "./shop-service";

vi.mock("./shop-repository", () => ({
  countProducts: vi.fn(),
  findCards: vi.fn(),
  findColors: vi.fn(),
  findFeatured: vi.fn(),
  findRelated: vi.fn(),
  findBySlug: vi.fn(),
}));

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(repo.findCards).mockResolvedValue([]);
  vi.mocked(repo.findColors).mockResolvedValue([]);
});

describe("listShopProducts", () => {
  it("trang vượt quá thì kéo về trang cuối và tính đúng vị trí bắt đầu", async () => {
    vi.mocked(repo.countProducts).mockResolvedValue(50);
    const result = await listShopProducts(shopListSchema.parse({ page: 99 }));
    expect(result).toMatchObject({ page: 3, pageCount: 3, total: 50 });
    expect(repo.findCards).toHaveBeenCalledWith(expect.anything(), "newest", {
      skip: 48,
      take: 24,
    });
  });

  it("từ khóa được bỏ dấu trước khi tìm", async () => {
    vi.mocked(repo.countProducts).mockResolvedValue(0);
    await listShopProducts(shopListSchema.parse({ q: "Hồng Đỏ" }));
    expect(repo.countProducts).toHaveBeenCalledWith(
      expect.objectContaining({ searchText: "hong do" }),
    );
  });

  it("không có sản phẩm vẫn trả 1 trang", async () => {
    vi.mocked(repo.countProducts).mockResolvedValue(0);
    expect(await listShopProducts(shopListSchema.parse({}))).toMatchObject({
      page: 1,
      pageCount: 1,
    });
  });
});

describe("getShopProduct và suggest", () => {
  it("không có hoặc không đang bán thì NOT_FOUND", async () => {
    vi.mocked(repo.findBySlug).mockResolvedValue(null);
    await expect(getShopProduct("x")).rejects.toMatchObject({ code: "NOT_FOUND" });
  });

  it("gợi ý cần ít nhất 2 ký tự", async () => {
    expect(await suggest("h")).toEqual([]);
    expect(repo.findCards).not.toHaveBeenCalled();
  });
});
