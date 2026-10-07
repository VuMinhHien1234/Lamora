import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppError } from "@/lib/errors";
import * as repo from "./repository";
import {
  createProduct,
  listAdminProducts,
  setProductStatus,
  updateProduct,
  upsertVariants,
} from "./service";
import type { CreateProductInput, ProductFields, VariantInput } from "./schema";
import type { ProductRecord, VariantRecord } from "./types";

vi.mock("./repository", () => ({
  listPage: vi.fn(),
  findDetail: vi.fn(),
  findRecord: vi.fn(),
  findVariants: vi.fn(),
  findCategoryName: vi.fn(),
  countImages: vi.fn(),
  slugExists: vi.fn(),
  findVariantIdBySku: vi.fn(),
  findVariantIdsWithOrders: vi.fn(),
  createWithVariants: vi.fn(),
  updateGeneral: vi.fn(),
  updateStatus: vi.fn(),
  applyVariantChanges: vi.fn(),
}));

function variant(partial: Partial<VariantInput> = {}): VariantInput {
  return {
    colorName: "",
    size: "",
    price: 100_000,
    stockQuantity: 5,
    isActive: true,
    sortOrder: 0,
    ...partial,
  } as VariantInput;
}

function fields(partial: Partial<ProductFields> = {}): ProductFields {
  return {
    name: "Bình hoa Mẫu đơn",
    categoryId: "c1",
    isFeatured: false,
    ...partial,
  } as ProductFields;
}

function product(partial: Partial<ProductRecord> = {}): ProductRecord {
  return {
    id: "p1",
    name: "Bình hoa",
    slug: "binh-hoa",
    categoryId: "c1",
    shortDescription: null,
    description: null,
    material: null,
    careInstructions: null,
    status: "DRAFT",
    isFeatured: false,
    priceFrom: 100_000,
    seoTitle: null,
    seoDescription: null,
    publishedAt: null,
    archivedAt: null,
    ...partial,
  };
}

function stored(id: string, partial: Partial<VariantRecord> = {}): VariantRecord {
  return {
    id,
    productId: "p1",
    sku: id,
    colorName: "",
    colorHex: null,
    size: "",
    price: 100_000,
    compareAtPrice: null,
    stockQuantity: 1,
    isActive: true,
    sortOrder: 0,
    ...partial,
  };
}

async function codeOf(promise: Promise<unknown>): Promise<string | undefined> {
  try {
    await promise;
  } catch (error) {
    return error instanceof AppError ? error.code : "OTHER";
  }
  return undefined;
}

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(repo.findCategoryName).mockResolvedValue("Bình hoa cắm sẵn");
  vi.mocked(repo.slugExists).mockResolvedValue(false);
  vi.mocked(repo.findVariantIdBySku).mockResolvedValue(null);
  vi.mocked(repo.findVariantIdsWithOrders).mockResolvedValue(new Set());
  vi.mocked(repo.createWithVariants).mockResolvedValue(product());
});

describe("createProduct", () => {
  it("tạo sản phẩm với slug, SKU, giá thấp nhất và chuỗi tìm kiếm tự sinh", async () => {
    const input: CreateProductInput = {
      ...fields(),
      variants: [
        variant({ colorName: "Hồng phấn", price: 650_000 }),
        variant({ colorName: "Trắng", price: 600_000 }),
      ],
    };
    await createProduct(input);
    const [data, writes] = vi.mocked(repo.createWithVariants).mock.calls[0] ?? [];
    expect(data?.slug).toBe("binh-hoa-mau-don");
    expect(data?.priceFrom).toBe(600_000);
    expect(data?.searchText).toBe("binh hoa mau don binh hoa cam san hong phan trang");
    expect(writes?.map((w) => w.sku)).toEqual(["LMR-BHMD-HONGPH", "LMR-BHMD-TRANG"]);
  });

  it("giá thấp nhất bỏ qua biến thể đang tắt", async () => {
    await createProduct({
      ...fields(),
      variants: [
        variant({ price: 500_000 }),
        variant({ colorName: "A", price: 100_000, isActive: false }),
      ],
    });
    expect(vi.mocked(repo.createWithVariants).mock.calls[0]?.[0].priceFrom).toBe(500_000);
  });

  it("slug trùng thì thêm -2", async () => {
    vi.mocked(repo.slugExists).mockImplementation(async (s) => s === "binh-hoa-mau-don");
    await createProduct({ ...fields(), variants: [variant()] });
    expect(vi.mocked(repo.createWithVariants).mock.calls[0]?.[0].slug).toBe("binh-hoa-mau-don-2");
  });

  it("SKU tự sinh trùng thì thêm -2", async () => {
    vi.mocked(repo.findVariantIdBySku).mockImplementation(async (s) =>
      s === "LMR-BHMD" ? "other" : null,
    );
    await createProduct({ ...fields(), variants: [variant()] });
    expect(vi.mocked(repo.createWithVariants).mock.calls[0]?.[1][0]?.sku).toBe("LMR-BHMD-2");
  });

  it("SKU nhập tay đã thuộc biến thể khác thì báo CONFLICT", async () => {
    vi.mocked(repo.findVariantIdBySku).mockResolvedValue("other");
    expect(await codeOf(createProduct({ ...fields(), variants: [variant({ sku: "ABC" })] }))).toBe(
      "CONFLICT",
    );
  });

  it("danh mục không tồn tại thì báo lỗi dữ liệu", async () => {
    vi.mocked(repo.findCategoryName).mockResolvedValue(null);
    expect(await codeOf(createProduct({ ...fields(), variants: [variant()] }))).toBe(
      "VALIDATION_ERROR",
    );
  });
});

describe("updateProduct", () => {
  it("không tìm thấy thì NOT_FOUND", async () => {
    vi.mocked(repo.findRecord).mockResolvedValue(null);
    expect(await codeOf(updateProduct("p1", fields()))).toBe("NOT_FOUND");
  });

  it("để trống slug thì giữ slug cũ và tính lại chuỗi tìm kiếm", async () => {
    vi.mocked(repo.findRecord).mockResolvedValue(product());
    vi.mocked(repo.findVariants).mockResolvedValue([stored("v1", { colorName: "Đỏ" })]);
    vi.mocked(repo.updateGeneral).mockResolvedValue(product());
    await updateProduct("p1", fields({ name: "Tên mới" }));
    const data = vi.mocked(repo.updateGeneral).mock.calls[0]?.[1];
    expect(data?.slug).toBe("binh-hoa");
    expect(data?.searchText).toBe("ten moi binh hoa cam san do");
  });

  it("đổi sang slug đã có thì CONFLICT", async () => {
    vi.mocked(repo.findRecord).mockResolvedValue(product());
    vi.mocked(repo.slugExists).mockResolvedValue(true);
    expect(await codeOf(updateProduct("p1", fields({ slug: "moi" })))).toBe("CONFLICT");
  });
});

describe("upsertVariants", () => {
  beforeEach(() => {
    vi.mocked(repo.findRecord).mockResolvedValue(product());
    vi.mocked(repo.findVariants).mockResolvedValue([stored("a"), stored("b", { colorName: "Đỏ" })]);
  });

  it("biến thể bị bỏ: đã có đơn thì tắt, chưa có đơn thì xóa", async () => {
    vi.mocked(repo.findVariantIdsWithOrders).mockResolvedValue(new Set(["b"]));
    await upsertVariants("p1", [variant({ id: "a" }), variant({ colorName: "Xanh" })]);
    const [, changes, derived] = vi.mocked(repo.applyVariantChanges).mock.calls[0] ?? [];
    expect(changes?.deactivateIds).toEqual(["b"]);
    expect(changes?.deleteIds).toEqual([]);
    expect(changes?.update.map((u) => u.id)).toEqual(["a"]);
    expect(changes?.create).toHaveLength(1);
    expect(derived?.priceFrom).toBe(100_000);
  });

  it("biến thể không có đơn thì bị xóa", async () => {
    await upsertVariants("p1", [variant({ id: "a" })]);
    expect(vi.mocked(repo.applyVariantChanges).mock.calls[0]?.[1].deleteIds).toEqual(["b"]);
  });

  it("id lạ thì NOT_FOUND, không ghi gì", async () => {
    expect(await codeOf(upsertVariants("p1", [variant({ id: "zzz" })]))).toBe("NOT_FOUND");
    expect(repo.applyVariantChanges).not.toHaveBeenCalled();
  });

  it("sản phẩm đang bán không được tắt hết biến thể", async () => {
    vi.mocked(repo.findRecord).mockResolvedValue(product({ status: "ACTIVE" }));
    const code = await codeOf(upsertVariants("p1", [variant({ id: "a", isActive: false })]));
    expect(code).toBe("PRODUCT_NOT_READY");
    expect(repo.applyVariantChanges).not.toHaveBeenCalled();
  });

  it("giữ SKU hiện tại của chính biến thể đó, không coi là trùng", async () => {
    vi.mocked(repo.findVariantIdBySku).mockResolvedValue("a");
    await upsertVariants("p1", [variant({ id: "a", sku: "A1" })]);
    expect(repo.applyVariantChanges).toHaveBeenCalled();
  });
});

describe("setProductStatus", () => {
  beforeEach(() => {
    vi.mocked(repo.findRecord).mockResolvedValue(product());
    vi.mocked(repo.updateStatus).mockResolvedValue(product({ status: "ACTIVE" }));
    vi.mocked(repo.findVariants).mockResolvedValue([stored("a")]);
    vi.mocked(repo.countImages).mockResolvedValue(2);
  });

  it("thiếu ảnh thì không cho đăng bán và nói rõ còn thiếu gì", async () => {
    vi.mocked(repo.countImages).mockResolvedValue(0);
    await expect(setProductStatus("p1", "ACTIVE")).rejects.toMatchObject({
      code: "PRODUCT_NOT_READY",
      message: expect.stringContaining("ảnh"),
    });
    expect(repo.updateStatus).not.toHaveBeenCalled();
  });

  it("đủ điều kiện: lần đầu đăng bán ghi publishedAt", async () => {
    await setProductStatus("p1", "ACTIVE");
    const change = vi.mocked(repo.updateStatus).mock.calls[0]?.[1];
    expect(change?.status).toBe("ACTIVE");
    expect(change?.publishedAt).toBeInstanceOf(Date);
    expect(change?.archivedAt).toBeNull();
  });

  it("đăng bán lại không ghi đè publishedAt cũ", async () => {
    vi.mocked(repo.findRecord).mockResolvedValue(product({ publishedAt: new Date("2026-01-01") }));
    await setProductStatus("p1", "ACTIVE");
    expect(vi.mocked(repo.updateStatus).mock.calls[0]?.[1].publishedAt).toBeUndefined();
  });

  it("lưu trữ ghi archivedAt và không cần kiểm tra điều kiện bán", async () => {
    vi.mocked(repo.countImages).mockResolvedValue(0);
    await setProductStatus("p1", "ARCHIVED");
    expect(vi.mocked(repo.updateStatus).mock.calls[0]?.[1].archivedAt).toBeInstanceOf(Date);
  });

  it("không tìm thấy thì NOT_FOUND", async () => {
    vi.mocked(repo.findRecord).mockResolvedValue(null);
    expect(await codeOf(setProductStatus("p1", "ACTIVE"))).toBe("NOT_FOUND");
  });
});

describe("listAdminProducts", () => {
  it("tính tổng tồn kho (chỉ biến thể đang bán), cảnh báo sắp hết và số trang", async () => {
    vi.mocked(repo.listPage).mockResolvedValue({
      total: 45,
      rows: [
        {
          id: "p1",
          name: "A",
          slug: "a",
          status: "ACTIVE",
          isFeatured: false,
          priceFrom: 1,
          updatedAt: new Date(),
          categoryName: "C",
          firstImage: null,
          variants: [
            { stockQuantity: 10, isActive: true },
            { stockQuantity: 2, isActive: true },
            { stockQuantity: 50, isActive: false },
          ],
        },
      ],
    });
    const result = await listAdminProducts({ lowStock: false, page: 2 });
    expect(result.pageCount).toBe(3);
    expect(result.items[0]).toMatchObject({ totalStock: 12, hasLowStock: true, variantCount: 3 });
  });

  it("chuẩn hóa từ khóa không dấu để tìm", async () => {
    vi.mocked(repo.listPage).mockResolvedValue({ total: 0, rows: [] });
    await listAdminProducts({ lowStock: false, page: 1, q: "Mẫu Đơn" });
    expect(vi.mocked(repo.listPage).mock.calls[0]?.[1]).toBe("mau don");
  });
});
