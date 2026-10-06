import { beforeEach, describe, expect, it, vi } from "vitest";
import * as media from "@/features/media";
import * as imageRepo from "./image-repository";
import { saveProductImages, updateProductImages } from "./image-service";
import * as repo from "./repository";
import type { ProductRecord, ProductImageRecord } from "./types";

vi.mock("./repository", () => ({ findRecord: vi.fn() }));
vi.mock("./image-repository", () => ({
  findImages: vi.fn(),
  findVariantIds: vi.fn(),
  insertImages: vi.fn(),
  applyImageChanges: vi.fn(),
}));
vi.mock("@/features/media", () => ({
  isShopPublicId: (id: string) => id.startsWith("lamora/products/"),
  deleteImage: vi.fn(),
}));

const product = (status: string): ProductRecord =>
  ({ id: "p1", name: "Hoa hồng", status }) as unknown as ProductRecord;
const img = (id: string, sortOrder: number): ProductImageRecord => ({
  id,
  publicId: `lamora/products/${id}`,
  alt: "a",
  width: 10,
  height: 10,
  sortOrder,
  variantId: null,
});

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(repo.findRecord).mockResolvedValue(product("DRAFT"));
  vi.mocked(imageRepo.findVariantIds).mockResolvedValue(["v1"]);
});

describe("saveProductImages", () => {
  const base = { publicId: "lamora/products/x", alt: "", width: 800, height: 1000 };

  it("thêm ảnh nối tiếp thứ tự và lấy tên sản phẩm khi alt trống", async () => {
    vi.mocked(imageRepo.findImages).mockResolvedValue([img("a", 0), img("b", 4)]);
    await saveProductImages({ productId: "p1", images: [base, { ...base, alt: "Cận cảnh" }] });
    expect(imageRepo.insertImages).toHaveBeenCalledWith("p1", [
      expect.objectContaining({ alt: "Hoa hồng", sortOrder: 5, variantId: null }),
      expect.objectContaining({ alt: "Cận cảnh", sortOrder: 6 }),
    ]);
  });

  it("từ chối publicId ngoài thư mục sản phẩm", async () => {
    vi.mocked(imageRepo.findImages).mockResolvedValue([]);
    await expect(
      saveProductImages({ productId: "p1", images: [{ ...base, publicId: "other/x" }] }),
    ).rejects.toMatchObject({ code: "VALIDATION_ERROR" });
  });

  it("từ chối biến thể không thuộc sản phẩm", async () => {
    vi.mocked(imageRepo.findImages).mockResolvedValue([]);
    await expect(
      saveProductImages({ productId: "p1", images: [{ ...base, variantId: "zzz" }] }),
    ).rejects.toMatchObject({ code: "VALIDATION_ERROR" });
  });

  it("từ chối khi vượt số ảnh tối đa", async () => {
    vi.mocked(imageRepo.findImages).mockResolvedValue(
      Array.from({ length: 20 }, (_, i) => img(`i${i}`, i)),
    );
    await expect(saveProductImages({ productId: "p1", images: [base] })).rejects.toMatchObject({
      code: "VALIDATION_ERROR",
    });
  });

  it("báo NOT_FOUND khi không có sản phẩm", async () => {
    vi.mocked(repo.findRecord).mockResolvedValue(null);
    await expect(saveProductImages({ productId: "p1", images: [base] })).rejects.toMatchObject({
      code: "NOT_FOUND",
    });
  });
});

describe("updateProductImages", () => {
  const existing = [img("a", 0), img("b", 1)];

  it("cập nhật, xóa và dọn ảnh trên Cloudinary", async () => {
    vi.mocked(imageRepo.findImages).mockResolvedValue(existing);
    await updateProductImages({
      productId: "p1",
      images: [
        { id: "a", alt: "", sortOrder: 0, variantId: "v1" },
        { id: "b", alt: "x", sortOrder: 1, variantId: null },
      ],
      deleteIds: ["b"],
    });
    expect(imageRepo.applyImageChanges).toHaveBeenCalledWith(
      "p1",
      [{ id: "a", alt: "Hoa hồng", sortOrder: 0, variantId: "v1" }],
      ["b"],
    );
    expect(media.deleteImage).toHaveBeenCalledWith("lamora/products/b");
  });

  it("không cho xóa hết ảnh của sản phẩm đang bán", async () => {
    vi.mocked(repo.findRecord).mockResolvedValue(product("ACTIVE"));
    vi.mocked(imageRepo.findImages).mockResolvedValue(existing);
    await expect(
      updateProductImages({ productId: "p1", images: [], deleteIds: ["a", "b"] }),
    ).rejects.toMatchObject({ code: "PRODUCT_NOT_READY" });
    expect(imageRepo.applyImageChanges).not.toHaveBeenCalled();
  });

  it("báo NOT_FOUND khi ảnh không thuộc sản phẩm", async () => {
    vi.mocked(imageRepo.findImages).mockResolvedValue(existing);
    await expect(
      updateProductImages({ productId: "p1", images: [], deleteIds: ["zzz"] }),
    ).rejects.toMatchObject({ code: "NOT_FOUND" });
  });
});
