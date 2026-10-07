import { requireAdmin } from "@/features/auth";
import { cloudinaryUrl } from "@/lib/cloudinary";
import { listProductsSchema } from "./schema";
import { listProductOptions } from "./options-service";
import * as service from "./service";
import { shopListSchema, type ShopListQuery } from "./shop-schema";
import * as shop from "./shop-service";
import type {
  ProductCard,
  ProductCardData,
  ShopListResult,
  ShopProduct,
  Suggestion,
} from "./shop-types";
import type { ProductDetail, ProductListResult, ProductOption } from "./types";

/** 🔐 Bảng sản phẩm. `input` là query string thô từ URL; lỗi định dạng thì dùng giá trị mặc định. */
export async function adminListProducts(input: unknown): Promise<ProductListResult> {
  await requireAdmin();
  const parsed = listProductsSchema.safeParse(input);
  return service.listAdminProducts(parsed.success ? parsed.data : listProductsSchema.parse({}));
}

/** 🔐 Một sản phẩm đầy đủ (kể cả nháp / lưu trữ). Không có thì ném NOT_FOUND. */
export async function adminGetProduct(id: string): Promise<ProductDetail> {
  await requireAdmin();
  const product = await service.getAdminProduct(id);
  return {
    ...product,
    images: product.images.map((image) => ({
      ...image,
      previewUrl: cloudinaryUrl(image.publicId, { width: 240 }),
    })),
  };
}

/** 🔐 Danh sách gọn mọi sản phẩm, để chọn vào bộ sưu tập. */
export async function adminListProductOptions(): Promise<ProductOption[]> {
  await requireAdmin();
  const rows = await listProductOptions();
  return rows.map(({ imagePublicId, ...rest }) => ({
    ...rest,
    previewUrl: imagePublicId ? cloudinaryUrl(imagePublicId, { width: 96 }) : null,
  }));
}

const CARD_IMAGE_WIDTH = 640;
const GALLERY_WIDTH = 1200;
const THUMB_WIDTH = 160;
const DEFAULT_FEATURED = 8;
const DEFAULT_RELATED = 4;

function toCard({ imagePublicId, ...rest }: ProductCardData): ProductCard {
  const imageUrl = imagePublicId ? cloudinaryUrl(imagePublicId, { width: CARD_IMAGE_WIDTH }) : null;
  return { ...rest, imageUrl };
}

/** 🌐 Danh sách sản phẩm đang bán, có lọc/sắp xếp/phân trang. Đầu vào sai định dạng → dùng mặc định. */
export async function listProducts(
  input: ShopListQuery = {},
): Promise<ShopListResult<ProductCard>> {
  const parsed = shopListSchema.safeParse(input);
  const result = await shop.listShopProducts(
    parsed.success ? parsed.data : shopListSchema.parse({}),
  );
  return { ...result, items: result.items.map(toCard) };
}

/** 🌐 Chi tiết một sản phẩm đang bán theo slug; không có thì ném NOT_FOUND để trang gọi `notFound()`. */
export async function getProductBySlug(slug: string): Promise<ShopProduct> {
  const product = await shop.getShopProduct(slug);
  return {
    ...product,
    images: product.images.map((image) => ({
      ...image,
      url: cloudinaryUrl(image.publicId, { width: GALLERY_WIDTH }),
      thumbUrl: cloudinaryUrl(image.publicId, { width: THUMB_WIDTH }),
    })),
  };
}

/** 🌐 Sản phẩm nổi bật. */
export async function listFeaturedProducts(limit = DEFAULT_FEATURED): Promise<ProductCard[]> {
  return (await shop.listFeatured(limit)).map(toCard);
}

/** 🌐 Sản phẩm cùng danh mục, khác sản phẩm hiện tại. */
export async function listRelatedProducts(
  productId: string,
  limit = DEFAULT_RELATED,
): Promise<ProductCard[]> {
  return (await shop.listRelated(productId, limit)).map(toCard);
}

/** 🌐 Gợi ý khi gõ tìm kiếm (≥ 2 ký tự, tối đa 6 kết quả). */
export async function searchSuggestions(q: string): Promise<Suggestion[]> {
  const cards = (await shop.suggest(q)).map(toCard);
  return cards.map((c) => ({
    name: c.name,
    slug: c.slug,
    imageUrl: c.imageUrl,
    priceFrom: c.priceFrom,
  }));
}
