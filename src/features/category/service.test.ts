import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppError } from "@/lib/errors";
import * as repo from "./repository";
import {
  buildTree,
  createCategory,
  deleteCategory,
  findActiveBySlug,
  listActiveCategoryTree,
  pickFreeSlug,
  reorderCategories,
  updateCategory,
} from "./service";
import type { CategoryRecord, CategoryWithCount } from "./types";

vi.mock("./repository", () => ({
  findAllWithCount: vi.fn(),
  findById: vi.fn(),
  findBySlug: vi.fn(),
  slugExists: vi.fn(),
  nextSortOrder: vi.fn(),
  insert: vi.fn(),
  updateById: vi.fn(),
  updateSortOrders: vi.fn(),
  countProducts: vi.fn(),
  countChildren: vi.fn(),
  deleteById: vi.fn(),
}));

const input = { name: "Hoa hồng", isActive: true } as const;

function row(partial: Partial<CategoryWithCount> & { id: string }): CategoryWithCount {
  return {
    name: partial.id,
    slug: partial.id,
    description: null,
    imagePublicId: null,
    parentId: null,
    sortOrder: 0,
    isActive: true,
    seoTitle: null,
    seoDescription: null,
    productCount: 0,
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
  vi.mocked(repo.slugExists).mockResolvedValue(false);
  vi.mocked(repo.nextSortOrder).mockResolvedValue(3);
  vi.mocked(repo.insert).mockImplementation(async (data, sortOrder) => ({
    id: "new",
    sortOrder,
    ...data,
  }));
});

describe("buildTree", () => {
  it("gom danh mục con vào cha, giữ thứ tự", () => {
    const tree = buildTree([row({ id: "a" }), row({ id: "b" }), row({ id: "a1", parentId: "a" })]);
    expect(tree.map((n) => n.id)).toEqual(["a", "b"]);
    expect(tree[0]?.children.map((c) => c.id)).toEqual(["a1"]);
    expect(tree[1]?.children).toEqual([]);
  });
});

describe("pickFreeSlug", () => {
  it("thêm hậu tố -2, -3 khi trùng", async () => {
    const taken = new Set(["hoa-hong", "hoa-hong-2"]);
    expect(await pickFreeSlug("hoa-hong", async (s) => taken.has(s))).toBe("hoa-hong-3");
  });

  it("dùng slug mặc định khi tên không còn ký tự hợp lệ", async () => {
    expect(await pickFreeSlug("", async () => false)).toBe("danh-muc");
  });
});

describe("createCategory", () => {
  it("tự sinh slug không dấu và xếp cuối danh sách", async () => {
    const created = await createCategory({ ...input, name: "Bình hoa Mẫu đơn" });
    expect(created.slug).toBe("binh-hoa-mau-don");
    expect(created.sortOrder).toBe(3);
  });

  it("slug tự sinh bị trùng thì thêm -2", async () => {
    vi.mocked(repo.slugExists).mockImplementation(async (s) => s === "hoa-hong");
    expect((await createCategory(input)).slug).toBe("hoa-hong-2");
  });

  it("slug nhập tay bị trùng thì báo CONFLICT", async () => {
    vi.mocked(repo.slugExists).mockResolvedValue(true);
    expect(await codeOf(createCategory({ ...input, slug: "hoa-hong" }))).toBe("CONFLICT");
  });

  it("không cho chọn cha là danh mục con (chỉ 1 cấp)", async () => {
    vi.mocked(repo.findById).mockResolvedValue({ ...row({ id: "p" }), parentId: "root" });
    expect(await codeOf(createCategory({ ...input, parentId: "p" }))).toBe("VALIDATION_ERROR");
  });

  it("cha không tồn tại thì báo NOT_FOUND", async () => {
    vi.mocked(repo.findById).mockResolvedValue(null);
    expect(await codeOf(createCategory({ ...input, parentId: "x" }))).toBe("NOT_FOUND");
  });
});

describe("updateCategory", () => {
  const current: CategoryRecord = { ...row({ id: "a", slug: "cu" }) };

  it("không tìm thấy thì báo NOT_FOUND", async () => {
    vi.mocked(repo.findById).mockResolvedValue(null);
    expect(await codeOf(updateCategory("a", input))).toBe("NOT_FOUND");
  });

  it("không cho đặt cha là chính nó", async () => {
    vi.mocked(repo.findById).mockResolvedValue(current);
    expect(await codeOf(updateCategory("a", { ...input, parentId: "a" }))).toBe("VALIDATION_ERROR");
  });

  it("danh mục đang có con không được trở thành con", async () => {
    vi.mocked(repo.findById).mockImplementation(async (id) => (id === "a" ? current : row({ id })));
    vi.mocked(repo.countChildren).mockResolvedValue(2);
    expect(await codeOf(updateCategory("a", { ...input, parentId: "b" }))).toBe("VALIDATION_ERROR");
  });

  it("để trống slug thì giữ slug cũ", async () => {
    vi.mocked(repo.findById).mockResolvedValue(current);
    vi.mocked(repo.updateById).mockImplementation(async (id, data) => ({
      id,
      sortOrder: 0,
      ...data,
    }));
    expect((await updateCategory("a", input)).slug).toBe("cu");
  });

  it("đổi sang slug đã có thì báo CONFLICT", async () => {
    vi.mocked(repo.findById).mockResolvedValue(current);
    vi.mocked(repo.slugExists).mockResolvedValue(true);
    expect(await codeOf(updateCategory("a", { ...input, slug: "moi" }))).toBe("CONFLICT");
  });
});

describe("deleteCategory", () => {
  beforeEach(() => {
    vi.mocked(repo.findById).mockResolvedValue(row({ id: "a" }));
    vi.mocked(repo.countProducts).mockResolvedValue(0);
    vi.mocked(repo.countChildren).mockResolvedValue(0);
  });

  it("còn sản phẩm thì không xóa và báo số sản phẩm", async () => {
    vi.mocked(repo.countProducts).mockResolvedValue(4);
    await expect(deleteCategory("a")).rejects.toMatchObject({
      code: "CATEGORY_NOT_EMPTY",
      message: "Danh mục còn 4 sản phẩm",
    });
    expect(repo.deleteById).not.toHaveBeenCalled();
  });

  it("còn danh mục con thì không xóa", async () => {
    vi.mocked(repo.countChildren).mockResolvedValue(1);
    expect(await codeOf(deleteCategory("a"))).toBe("CATEGORY_NOT_EMPTY");
    expect(repo.deleteById).not.toHaveBeenCalled();
  });

  it("rỗng thì xóa", async () => {
    await deleteCategory("a");
    expect(repo.deleteById).toHaveBeenCalledWith("a");
  });
});

describe("reorderCategories", () => {
  it("từ chối khi có id không tồn tại", async () => {
    vi.mocked(repo.findAllWithCount).mockResolvedValue([row({ id: "a" })]);
    expect(await codeOf(reorderCategories([{ id: "zzz", sortOrder: 0 }]))).toBe("NOT_FOUND");
    expect(repo.updateSortOrders).not.toHaveBeenCalled();
  });

  it("lưu thứ tự mới", async () => {
    vi.mocked(repo.findAllWithCount).mockResolvedValue([row({ id: "a" }), row({ id: "b" })]);
    await reorderCategories([
      { id: "b", sortOrder: 0 },
      { id: "a", sortOrder: 1 },
    ]);
    expect(repo.updateSortOrders).toHaveBeenCalledTimes(1);
  });
});

describe("truy vấn cho khách", () => {
  it("ẩn danh mục tắt và con của danh mục tắt", async () => {
    vi.mocked(repo.findAllWithCount).mockResolvedValue([
      row({ id: "on" }),
      row({ id: "off", isActive: false }),
      row({ id: "on-child", parentId: "on" }),
      row({ id: "on-hidden", parentId: "on", isActive: false }),
      row({ id: "off-child", parentId: "off" }),
    ]);
    const tree = await listActiveCategoryTree();
    expect(tree.map((n) => n.id)).toEqual(["on"]);
    expect(tree[0]?.children.map((c) => c.id)).toEqual(["on-child"]);
  });

  it("danh mục đang tắt coi như không tồn tại", async () => {
    vi.mocked(repo.findBySlug).mockResolvedValue(row({ id: "a", isActive: false }));
    expect(await codeOf(findActiveBySlug("a"))).toBe("NOT_FOUND");
  });
});
