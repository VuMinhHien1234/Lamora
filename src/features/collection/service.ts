import { deleteImage, isShopPublicId } from "@/features/media";
import { AppError } from "@/lib/errors";
import { slugify } from "@/lib/slug";
import * as repo from "./repository";
import type { CollectionInput, ReorderItem } from "./schema";
import type {
  CollectionDetail,
  CollectionRecord,
  CollectionWithCount,
  CollectionWriteData,
} from "./types";

const DEFAULT_SLUG = "bo-suu-tap";
const MAX_SLUG_TRIES = 50;

function slugTaken(): AppError {
  return new AppError("CONFLICT", "Đường dẫn này đã tồn tại.", {
    fieldErrors: { slug: ["Đường dẫn đã tồn tại"] },
  });
}

async function pickFreeSlug(base: string): Promise<string> {
  const root = base === "" ? DEFAULT_SLUG : base;
  for (let n = 1; n <= MAX_SLUG_TRIES; n += 1) {
    const candidate = n === 1 ? root : `${root}-${n}`;
    if (!(await repo.slugExists(candidate))) return candidate;
  }
  throw new AppError("CONFLICT", "Không tìm được đường dẫn trống, vui lòng nhập đường dẫn khác.");
}

function toWriteData(input: CollectionInput, slug: string): CollectionWriteData {
  return {
    name: input.name,
    slug,
    description: input.description ?? null,
    imagePublicId: input.imagePublicId ?? null,
    isActive: input.isActive,
    showOnHome: input.showOnHome,
  };
}

function assertValidImage(publicId: string | undefined): void {
  if (publicId && !isShopPublicId(publicId, "collections")) {
    const message = "Ảnh không hợp lệ, vui lòng tải lại ảnh.";
    throw new AppError("VALIDATION_ERROR", message, { fieldErrors: { _form: [message] } });
  }
}

async function requireCollection(id: string): Promise<CollectionRecord> {
  const found = await repo.findById(id);
  if (!found) throw new AppError("NOT_FOUND", "Không tìm thấy bộ sưu tập.");
  return found;
}

export function listAdminCollections(): Promise<CollectionWithCount[]> {
  return repo.findAllWithCount();
}

export async function getAdminCollection(id: string): Promise<CollectionDetail> {
  const collection = await requireCollection(id);
  return { ...collection, products: await repo.findProducts(id) };
}

/** Bộ sưu tập hiện ở trang chủ. */
export function listHome(): Promise<CollectionRecord[]> {
  return repo.findHome();
}

/** Bộ sưu tập đang bật theo slug (trang khách). */
export async function findActiveBySlug(slug: string): Promise<CollectionRecord> {
  const found = await repo.findBySlug(slug);
  if (!found || !found.isActive) throw new AppError("NOT_FOUND", "Không tìm thấy bộ sưu tập này.");
  return found;
}

export async function createCollection(input: CollectionInput): Promise<CollectionRecord> {
  assertValidImage(input.imagePublicId);
  if (input.slug && (await repo.slugExists(input.slug))) throw slugTaken();
  const slug = input.slug ?? (await pickFreeSlug(slugify(input.name)));
  return repo.insert(toWriteData(input, slug), await repo.nextSortOrder());
}

export async function updateCollection(
  id: string,
  input: CollectionInput,
): Promise<CollectionRecord> {
  const current = await requireCollection(id);
  assertValidImage(input.imagePublicId);
  const slug = input.slug ?? current.slug;
  if (slug !== current.slug && (await repo.slugExists(slug, id))) throw slugTaken();
  const updated = await repo.updateById(id, toWriteData(input, slug));
  if (current.imagePublicId && current.imagePublicId !== (input.imagePublicId ?? null)) {
    await deleteImage(current.imagePublicId);
  }
  return updated;
}

export async function reorderCollections(items: ReorderItem[]): Promise<void> {
  const known = new Set((await repo.findAllWithCount()).map((row) => row.id));
  if (items.some((item) => !known.has(item.id))) {
    throw new AppError("NOT_FOUND", "Có bộ sưu tập không còn tồn tại, vui lòng tải lại trang.");
  }
  await repo.updateSortOrders(items);
}

/** Xóa bộ sưu tập; sản phẩm bên trong vẫn còn nguyên. */
export async function deleteCollection(id: string): Promise<void> {
  const current = await requireCollection(id);
  await repo.deleteById(id);
  if (current.imagePublicId) await deleteImage(current.imagePublicId);
}

/** Ghi đè danh sách và thứ tự sản phẩm. Trùng thì giữ lần đầu; sản phẩm không tồn tại bị từ chối. */
export async function setCollectionProducts(
  collectionId: string,
  productIds: string[],
): Promise<void> {
  await requireCollection(collectionId);
  const unique = [...new Set(productIds)];
  const existing = await repo.findExistingProductIds(unique);
  if (unique.some((id) => !existing.has(id))) {
    throw new AppError("NOT_FOUND", "Có sản phẩm không còn tồn tại, vui lòng tải lại trang.");
  }
  await repo.replaceProducts(collectionId, unique);
}
