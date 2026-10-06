import { AppError } from "@/lib/errors";
import { toSearchText } from "@/lib/slug";
import * as repo from "./shop-repository";
import { pageCountOf, toCardData, uniqueColors } from "./shop-rules";
import { SHOP_PAGE_SIZE, type ShopListInput } from "./shop-schema";
import type { ProductCardData, ShopListResult, ShopProductData } from "./shop-types";

const MIN_SUGGEST_CHARS = 2;
const MAX_SUGGESTIONS = 6;

function filterOf(input: ShopListInput): repo.ShopFilter {
  const searchText = input.q ? toSearchText(input.q) : "";
  return {
    categorySlug: input.categorySlug,
    collectionSlug: input.collectionSlug,
    colors: input.colors,
    priceMin: input.priceMin,
    priceMax: input.priceMax,
    searchText: searchText === "" ? undefined : searchText,
  };
}

export async function listShopProducts(
  input: ShopListInput,
): Promise<ShopListResult<ProductCardData>> {
  const filter = filterOf(input);
  const total = await repo.countProducts(filter);
  const pageCount = pageCountOf(total, SHOP_PAGE_SIZE);
  const page = Math.min(input.page, pageCount);
  const [rows, colors] = await Promise.all([
    repo.findCards(filter, input.sort, { skip: (page - 1) * SHOP_PAGE_SIZE, take: SHOP_PAGE_SIZE }),
    repo.findColors(filter),
  ]);
  return {
    items: rows.map(toCardData),
    total,
    page,
    pageCount,
    availableColors: uniqueColors(colors),
  };
}

export async function getShopProduct(slug: string): Promise<ShopProductData> {
  const found = await repo.findBySlug(slug);
  if (!found) throw new AppError("NOT_FOUND", "Không tìm thấy sản phẩm này.");
  return found;
}

export async function listFeatured(limit: number): Promise<ProductCardData[]> {
  return (await repo.findFeatured(limit)).map(toCardData);
}

export async function listRelated(productId: string, limit: number): Promise<ProductCardData[]> {
  return (await repo.findRelated(productId, limit)).map(toCardData);
}

/** Gợi ý khi gõ tìm kiếm: cần ít nhất 2 ký tự, bỏ dấu rồi so với searchText. */
export async function suggest(q: string): Promise<ProductCardData[]> {
  const text = toSearchText(q);
  if (text.length < MIN_SUGGEST_CHARS) return [];
  const rows = await repo.findCards({ searchText: text }, "featured", {
    skip: 0,
    take: MAX_SUGGESTIONS,
  });
  return rows.map(toCardData);
}
