import { deleteImage, isShopPublicId } from "@/features/media";
import { AppError } from "@/lib/errors";
import { slugify } from "@/lib/slug";
import * as repo from "./repository";
import type { CategoryInput, ReorderItem } from "./schema";
import type { CategoryNode, CategoryRecord, CategoryWithCount, CategoryWriteData } from "./types";

const DEFAULT_SLUG = "danh-muc";
const MAX_SLUG_TRIES = 50;

/** Gom danh sách phẳng thành cây 1 cấp con, giữ nguyên thứ tự đầu vào. */
export function buildTree(rows: CategoryWithCount[]): CategoryNode[] {
  const parents = rows.filter((row) => row.parentId === null);
  return parents.map((parent) => ({
    ...parent,
    children: rows.filter((row) => row.parentId === parent.id),
  }));
}

/** Tìm slug chưa ai dùng: "hoa-hong", "hoa-hong-2", "hoa-hong-3"… */
export async function pickFreeSlug(
  base: string,
  isTaken: (slug: string) => Promise<boolean>,
): Promise<string> {
  const root = base === "" ? DEFAULT_SLUG : base;
  for (let n = 1; n <= MAX_SLUG_TRIES; n += 1) {
    const candidate = n === 1 ? root : `${root}-${n}`;
    if (!(await isTaken(candidate))) return candidate;
  }
  throw new AppError("CONFLICT", "Không tìm được đường dẫn trống, vui lòng nhập đường dẫn khác.");
}

function toWriteData(input: CategoryInput, slug: string): CategoryWriteData {
  return {
    name: input.name,
    slug,
    description: input.description ?? null,
    imagePublicId: input.imagePublicId ?? null,
    parentId: input.parentId ?? null,
    isActive: input.isActive,
    seoTitle: input.seoTitle ?? null,
    seoDescription: input.seoDescription ?? null,
  };
}

/** Danh mục cha phải tồn tại và chính nó không phải danh mục con (chỉ cho 1 cấp con). */
async function assertValidParent(parentId: string | null, selfId?: string): Promise<void> {
  if (parentId === null) return;
  const fieldErrors = (message: string): { fieldErrors: Record<string, string[]> } => ({
    fieldErrors: { parentId: [message] },
  });
  if (parentId === selfId) {
    throw new AppError(
      "VALIDATION_ERROR",
      "Danh mục không thể là cha của chính nó.",
      fieldErrors("Chọn danh mục khác"),
    );
  }
  const parent = await repo.findById(parentId);
  if (!parent) {
    throw new AppError(
      "NOT_FOUND",
      "Không tìm thấy danh mục cha.",
      fieldErrors("Danh mục cha không còn tồn tại"),
    );
  }
  if (parent.parentId !== null) {
    throw new AppError(
      "VALIDATION_ERROR",
      "Chỉ hỗ trợ một cấp danh mục con.",
      fieldErrors("Chọn danh mục cấp trên cùng"),
    );
  }
  if (selfId && (await repo.countChildren(selfId)) > 0) {
    throw new AppError(
      "VALIDATION_ERROR",
      "Danh mục này đang có danh mục con nên không thể trở thành danh mục con.",
      fieldErrors("Danh mục đang có danh mục con"),
    );
  }
}

export async function listAdminCategories(): Promise<CategoryNode[]> {
  return buildTree(await repo.findAllWithCount());
}

/** Cây danh mục đang bật cho menu khách; danh mục con chỉ hiện khi cha cũng đang bật. */
export async function listActiveCategoryTree(): Promise<CategoryNode[]> {
  const tree = buildTree(await repo.findAllWithCount());
  return tree
    .filter((node) => node.isActive)
    .map((node) => ({ ...node, children: node.children.filter((child) => child.isActive) }));
}

export async function findActiveBySlug(slug: string): Promise<CategoryRecord> {
  const found = await repo.findBySlug(slug);
  if (!found || !found.isActive) throw new AppError("NOT_FOUND", "Không tìm thấy danh mục này.");
  return found;
}

function assertValidImage(publicId: string | undefined): void {
  if (publicId && !isShopPublicId(publicId, "categories")) {
    throw new AppError("VALIDATION_ERROR", "Ảnh không hợp lệ, vui lòng tải lại ảnh.", {
      fieldErrors: { _form: ["Ảnh không hợp lệ, vui lòng tải lại ảnh."] },
    });
  }
}

export async function createCategory(input: CategoryInput): Promise<CategoryRecord> {
  await assertValidParent(input.parentId ?? null);
  assertValidImage(input.imagePublicId);
  const slug = input.slug ?? (await pickFreeSlug(slugify(input.name), (s) => repo.slugExists(s)));
  if (input.slug && (await repo.slugExists(slug))) {
    throw new AppError("CONFLICT", "Đường dẫn này đã tồn tại.", {
      fieldErrors: { slug: ["Đường dẫn đã tồn tại"] },
    });
  }
  const sortOrder = await repo.nextSortOrder(input.parentId ?? null);
  return repo.insert(toWriteData(input, slug), sortOrder);
}

export async function updateCategory(id: string, input: CategoryInput): Promise<CategoryRecord> {
  const current = await repo.findById(id);
  if (!current) throw new AppError("NOT_FOUND", "Không tìm thấy danh mục.");
  await assertValidParent(input.parentId ?? null, id);
  assertValidImage(input.imagePublicId);
  const slug = input.slug ?? current.slug;
  if (slug !== current.slug && (await repo.slugExists(slug, id))) {
    throw new AppError("CONFLICT", "Đường dẫn này đã tồn tại.", {
      fieldErrors: { slug: ["Đường dẫn đã tồn tại"] },
    });
  }
  const updated = await repo.updateById(id, toWriteData(input, slug));
  if (current.imagePublicId && current.imagePublicId !== (input.imagePublicId ?? null)) {
    await deleteImage(current.imagePublicId);
  }
  return updated;
}

export async function reorderCategories(items: ReorderItem[]): Promise<void> {
  const known = new Set((await repo.findAllWithCount()).map((row) => row.id));
  if (items.some((item) => !known.has(item.id))) {
    throw new AppError("NOT_FOUND", "Có danh mục không còn tồn tại, vui lòng tải lại trang.");
  }
  await repo.updateSortOrders(items);
}

export async function deleteCategory(id: string): Promise<void> {
  const current = await repo.findById(id);
  if (!current) throw new AppError("NOT_FOUND", "Không tìm thấy danh mục.");
  const [products, children] = await Promise.all([repo.countProducts(id), repo.countChildren(id)]);
  if (products > 0) {
    throw new AppError("CATEGORY_NOT_EMPTY", `Danh mục còn ${products} sản phẩm`);
  }
  if (children > 0) {
    throw new AppError("CATEGORY_NOT_EMPTY", `Danh mục còn ${children} danh mục con`);
  }
  await repo.deleteById(id);
  if (current.imagePublicId) await deleteImage(current.imagePublicId);
}
