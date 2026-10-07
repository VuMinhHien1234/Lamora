import { beforeEach, describe, expect, it, vi } from "vitest";
import * as media from "@/features/media";
import * as repo from "./repository";
import {
  createCollection,
  deleteCollection,
  findActiveBySlug,
  reorderCollections,
  setCollectionProducts,
  updateCollection,
} from "./service";
import type { CollectionInput } from "./schema";
import type { CollectionRecord } from "./types";

vi.mock("@/features/media", () => ({
  isShopPublicId: (id: string) => id.startsWith("lamora/collections/"),
  deleteImage: vi.fn(),
}));
vi.mock("./repository", () => ({
  findAllWithCount: vi.fn(),
  findById: vi.fn(),
  findBySlug: vi.fn(),
  slugExists: vi.fn(),
  nextSortOrder: vi.fn(),
  insert: vi.fn(),
  updateById: vi.fn(),
  updateSortOrders: vi.fn(),
  deleteById: vi.fn(),
  findProducts: vi.fn(),
  findExistingProductIds: vi.fn(),
  replaceProducts: vi.fn(),
}));

const record = (partial: Partial<CollectionRecord> = {}): CollectionRecord => ({
  id: "c1",
  name: "Tết",
  slug: "tet",
  description: null,
  imagePublicId: null,
  isActive: true,
  showOnHome: false,
  sortOrder: 0,
  ...partial,
});
const input = (partial: Partial<CollectionInput> = {}): CollectionInput =>
  ({ name: "Hoa Tết", isActive: true, showOnHome: false, ...partial }) as CollectionInput;
const codeOf = (promise: Promise<unknown>): Promise<unknown> =>
  promise.then(
    () => "ok",
    (error: { code?: string }) => error.code,
  );

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(repo.slugExists).mockResolvedValue(false);
  vi.mocked(repo.nextSortOrder).mockResolvedValue(4);
  vi.mocked(repo.insert).mockImplementation(async (data, sortOrder) => ({
    id: "new",
    sortOrder,
    ...data,
  }));
  vi.mocked(repo.updateById).mockImplementation(async (id, data) => ({
    id,
    sortOrder: 0,
    ...data,
  }));
});

describe("createCollection", () => {
  it("tự tạo slug không dấu và xếp cuối danh sách", async () => {
    const created = await createCollection(input());
    expect(created).toMatchObject({ slug: "hoa-tet", sortOrder: 4 });
  });

  it("slug trùng thì thêm hậu tố", async () => {
    vi.mocked(repo.slugExists).mockImplementation(async (s) => s === "hoa-tet");
    expect((await createCollection(input())).slug).toBe("hoa-tet-2");
  });

  it("slug nhập tay bị trùng thì báo CONFLICT", async () => {
    vi.mocked(repo.slugExists).mockResolvedValue(true);
    expect(await codeOf(createCollection(input({ slug: "tet" })))).toBe("CONFLICT");
  });

  it("từ chối ảnh ngoài thư mục bộ sưu tập", async () => {
    expect(await codeOf(createCollection(input({ imagePublicId: "lamora/products/x" })))).toBe(
      "VALIDATION_ERROR",
    );
  });
});

describe("updateCollection", () => {
  it("không có thì NOT_FOUND", async () => {
    vi.mocked(repo.findById).mockResolvedValue(null);
    expect(await codeOf(updateCollection("c1", input()))).toBe("NOT_FOUND");
  });

  it("để trống slug thì giữ slug cũ", async () => {
    vi.mocked(repo.findById).mockResolvedValue(record());
    expect((await updateCollection("c1", input())).slug).toBe("tet");
  });

  it("đổi ảnh thì xóa ảnh cũ", async () => {
    vi.mocked(repo.findById).mockResolvedValue(record({ imagePublicId: "lamora/collections/a" }));
    await updateCollection("c1", input({ imagePublicId: "lamora/collections/b" }));
    expect(media.deleteImage).toHaveBeenCalledWith("lamora/collections/a");
  });

  it("giữ nguyên ảnh thì không xóa gì", async () => {
    vi.mocked(repo.findById).mockResolvedValue(record({ imagePublicId: "lamora/collections/a" }));
    await updateCollection("c1", input({ imagePublicId: "lamora/collections/a" }));
    expect(media.deleteImage).not.toHaveBeenCalled();
  });
});

describe("deleteCollection", () => {
  it("xóa bộ sưu tập và ảnh, không đụng tới sản phẩm", async () => {
    vi.mocked(repo.findById).mockResolvedValue(record({ imagePublicId: "lamora/collections/a" }));
    await deleteCollection("c1");
    expect(repo.deleteById).toHaveBeenCalledWith("c1");
    expect(media.deleteImage).toHaveBeenCalledWith("lamora/collections/a");
  });
});

describe("setCollectionProducts", () => {
  beforeEach(() => vi.mocked(repo.findById).mockResolvedValue(record()));

  it("bỏ trùng và giữ thứ tự", async () => {
    vi.mocked(repo.findExistingProductIds).mockResolvedValue(new Set(["a", "b"]));
    await setCollectionProducts("c1", ["b", "a", "b"]);
    expect(repo.replaceProducts).toHaveBeenCalledWith("c1", ["b", "a"]);
  });

  it("sản phẩm không tồn tại thì NOT_FOUND và không ghi", async () => {
    vi.mocked(repo.findExistingProductIds).mockResolvedValue(new Set(["a"]));
    expect(await codeOf(setCollectionProducts("c1", ["a", "zzz"]))).toBe("NOT_FOUND");
    expect(repo.replaceProducts).not.toHaveBeenCalled();
  });

  it("cho phép danh sách rỗng", async () => {
    vi.mocked(repo.findExistingProductIds).mockResolvedValue(new Set());
    await setCollectionProducts("c1", []);
    expect(repo.replaceProducts).toHaveBeenCalledWith("c1", []);
  });
});

describe("reorder và đọc theo slug", () => {
  it("reorder báo NOT_FOUND khi có id lạ", async () => {
    vi.mocked(repo.findAllWithCount).mockResolvedValue([{ ...record(), productCount: 0 }]);
    expect(await codeOf(reorderCollections([{ id: "x", sortOrder: 0 }]))).toBe("NOT_FOUND");
  });

  it("chỉ trả bộ sưu tập đang bật", async () => {
    vi.mocked(repo.findBySlug).mockResolvedValue(record({ isActive: false }));
    expect(await codeOf(findActiveBySlug("tet"))).toBe("NOT_FOUND");
  });
});
