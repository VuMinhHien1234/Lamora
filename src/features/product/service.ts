import { ADMIN_PRODUCTS_PER_PAGE, LOW_STOCK_THRESHOLD } from "@/config/inventory";
import { AppError } from "@/lib/errors";
import { slugify, toSearchText } from "@/lib/slug";
import * as repo from "./repository";
import {
  buildSearchText,
  buildSku,
  computePriceFrom,
  diffVariants,
  hasLowStock,
  listMissingForSale,
  pickFreeSku,
} from "./rules";
import type { CreateProductInput, ListProductsInput, ProductFields, VariantInput } from "./schema";
import type {
  ProductDetail,
  ProductListItem,
  ProductListResult,
  ProductRecord,
  ProductStatus,
  ProductWriteData,
  VariantChanges,
  VariantWriteData,
} from "./types";

const DEFAULT_SLUG = "san-pham";
const MAX_SLUG_TRIES = 50;

function slugTaken(error: string): AppError {
  return new AppError("CONFLICT", error, { fieldErrors: { slug: ["Đường dẫn đã tồn tại"] } });
}

async function pickFreeSlug(base: string, excludeId?: string): Promise<string> {
  const root = base === "" ? DEFAULT_SLUG : base;
  for (let n = 1; n <= MAX_SLUG_TRIES; n += 1) {
    const candidate = n === 1 ? root : `${root}-${n}`;
    if (!(await repo.slugExists(candidate, excludeId))) return candidate;
  }
  throw slugTaken("Không tìm được đường dẫn trống, vui lòng nhập đường dẫn khác.");
}

async function requireCategoryName(categoryId: string): Promise<string> {
  const name = await repo.findCategoryName(categoryId);
  if (name === null) {
    throw new AppError("VALIDATION_ERROR", "Danh mục không còn tồn tại.", {
      fieldErrors: { categoryId: ["Vui lòng chọn danh mục khác"] },
    });
  }
  return name;
}

function toWriteData(
  fields: ProductFields,
  extra: { slug: string; searchText: string; priceFrom: number },
): ProductWriteData {
  return {
    name: fields.name,
    slug: extra.slug,
    categoryId: fields.categoryId,
    shortDescription: fields.shortDescription ?? null,
    description: fields.description ?? null,
    material: fields.material ?? null,
    careInstructions: fields.careInstructions ?? null,
    isFeatured: fields.isFeatured,
    seoTitle: fields.seoTitle ?? null,
    seoDescription: fields.seoDescription ?? null,
    searchText: extra.searchText,
    priceFrom: extra.priceFrom,
  };
}

function toVariantData(input: VariantInput, sku: string): VariantWriteData {
  return {
    colorName: input.colorName,
    colorHex: input.colorHex ?? null,
    size: input.size,
    sku,
    price: input.price,
    compareAtPrice: input.compareAtPrice ?? null,
    stockQuantity: input.stockQuantity,
    isActive: input.isActive,
    sortOrder: input.sortOrder,
  };
}

/** SKU nhập tay phải chưa thuộc biến thể khác; để trống thì tự sinh và đảm bảo không trùng. */
async function resolveSku(
  input: VariantInput,
  productName: string,
  selfId?: string,
): Promise<string> {
  if (input.sku) {
    const owner = await repo.findVariantIdBySku(input.sku);
    if (owner !== null && owner !== selfId) {
      throw new AppError("CONFLICT", `SKU ${input.sku} đã được dùng cho biến thể khác.`);
    }
    return input.sku;
  }
  const base = buildSku(productName, input);
  return pickFreeSku(base, async (sku) => {
    const owner = await repo.findVariantIdBySku(sku);
    return owner !== null && owner !== selfId;
  });
}

export async function createProduct(input: CreateProductInput): Promise<ProductRecord> {
  const { variants, ...fields } = input;
  const categoryName = await requireCategoryName(fields.categoryId);
  const slug = fields.slug ?? (await pickFreeSlug(slugify(fields.name)));
  if (fields.slug && (await repo.slugExists(slug))) throw slugTaken("Đường dẫn này đã tồn tại.");
  const skus = new Set<string>();
  const writes: VariantWriteData[] = [];
  for (const variant of variants) {
    const sku = await resolveSku(variant, fields.name);
    if (skus.has(sku))
      throw new AppError("CONFLICT", `SKU ${sku} bị lặp trong danh sách biến thể.`);
    skus.add(sku);
    writes.push(toVariantData(variant, sku));
  }
  const data = toWriteData(fields, {
    slug,
    searchText: buildSearchText(fields.name, categoryName, writes),
    priceFrom: computePriceFrom(writes),
  });
  return repo.createWithVariants(data, writes);
}

export async function updateProduct(id: string, fields: ProductFields): Promise<ProductRecord> {
  const current = await repo.findRecord(id);
  if (!current) throw new AppError("NOT_FOUND", "Không tìm thấy sản phẩm.");
  const categoryName = await requireCategoryName(fields.categoryId);
  const slug = fields.slug ?? current.slug;
  if (slug !== current.slug && (await repo.slugExists(slug, id)))
    throw slugTaken("Đường dẫn này đã tồn tại.");
  const variants = await repo.findVariants(id);
  const data = toWriteData(fields, {
    slug,
    searchText: buildSearchText(fields.name, categoryName, variants),
    priceFrom: current.priceFrom,
  });
  return repo.updateGeneral(id, data);
}

async function buildVariantChanges(
  product: ProductRecord,
  incoming: VariantInput[],
  existing: Awaited<ReturnType<typeof repo.findVariants>>,
): Promise<{ changes: VariantChanges; finalVariants: VariantWriteData[] }> {
  const diff = diffVariants(existing, incoming);
  if (diff.unknownIds.length > 0) {
    throw new AppError("NOT_FOUND", "Có biến thể không còn tồn tại, vui lòng tải lại trang.");
  }
  const withOrders = await repo.findVariantIdsWithOrders(diff.removed.map((variant) => variant.id));
  const changes: VariantChanges = {
    update: [],
    create: [],
    deactivateIds: diff.removed.filter((v) => withOrders.has(v.id)).map((v) => v.id),
    deleteIds: diff.removed.filter((v) => !withOrders.has(v.id)).map((v) => v.id),
  };
  for (const { existing: old, input } of diff.toUpdate) {
    changes.update.push({
      id: old.id,
      data: toVariantData(input, await resolveSku(input, product.name, old.id)),
    });
  }
  for (const input of diff.toCreate) {
    changes.create.push(toVariantData(input, await resolveSku(input, product.name)));
  }
  const kept = [...changes.update.map((item) => item.data), ...changes.create];
  return { changes, finalVariants: kept };
}

export async function upsertVariants(productId: string, incoming: VariantInput[]): Promise<void> {
  const product = await repo.findRecord(productId);
  if (!product) throw new AppError("NOT_FOUND", "Không tìm thấy sản phẩm.");
  const existing = await repo.findVariants(productId);
  const { changes, finalVariants } = await buildVariantChanges(product, incoming, existing);
  if (product.status === "ACTIVE" && !finalVariants.some((variant) => variant.isActive)) {
    throw new AppError(
      "PRODUCT_NOT_READY",
      "Sản phẩm đang bán cần ít nhất 1 biến thể đang bán. Hãy chuyển sang Nháp trước nếu muốn tắt hết.",
    );
  }
  const categoryName = (await repo.findCategoryName(product.categoryId)) ?? "";
  await repo.applyVariantChanges(productId, changes, {
    priceFrom: computePriceFrom(finalVariants),
    searchText: buildSearchText(product.name, categoryName, finalVariants),
  });
}

export async function setProductStatus(id: string, status: ProductStatus): Promise<ProductRecord> {
  const product = await repo.findRecord(id);
  if (!product) throw new AppError("NOT_FOUND", "Không tìm thấy sản phẩm.");
  if (status === "ACTIVE") await assertReadyForSale(id);
  const now = new Date();
  return repo.updateStatus(id, {
    status,
    ...(status === "ACTIVE" && product.publishedAt === null ? { publishedAt: now } : {}),
    ...(status === "ARCHIVED" ? { archivedAt: now } : { archivedAt: null }),
  });
}

async function assertReadyForSale(productId: string): Promise<void> {
  const [imageCount, variants] = await Promise.all([
    repo.countImages(productId),
    repo.findVariants(productId),
  ]);
  const missing = listMissingForSale({ imageCount, variants });
  if (missing.length > 0) {
    throw new AppError("PRODUCT_NOT_READY", `Chưa thể đăng bán, còn thiếu: ${missing.join("; ")}.`);
  }
}

function toListItem(
  row: Awaited<ReturnType<typeof repo.listPage>>["rows"][number],
): ProductListItem {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    status: row.status,
    isFeatured: row.isFeatured,
    categoryName: row.categoryName,
    priceFrom: row.priceFrom,
    totalStock: row.variants.filter((v) => v.isActive).reduce((sum, v) => sum + v.stockQuantity, 0),
    variantCount: row.variants.length,
    hasLowStock: hasLowStock(row.variants, LOW_STOCK_THRESHOLD),
    imagePublicId: row.firstImage?.publicId ?? null,
    imageAlt: row.firstImage?.alt ?? null,
    updatedAt: row.updatedAt,
  };
}

export async function listAdminProducts(input: ListProductsInput): Promise<ProductListResult> {
  const query = { ...input, status: input.status as ProductStatus | undefined };
  const { rows, total } = await repo.listPage(query, input.q ? toSearchText(input.q) : "");
  return {
    items: rows.map(toListItem),
    total,
    page: input.page,
    pageCount: Math.max(1, Math.ceil(total / ADMIN_PRODUCTS_PER_PAGE)),
  };
}

export async function getAdminProduct(id: string): Promise<ProductDetail> {
  const found = await repo.findDetail(id);
  if (!found) throw new AppError("NOT_FOUND", "Không tìm thấy sản phẩm.");
  return found;
}
