/** Dữ liệu phía khách (docs/04 mục 5.1). Chưa gồm địa chỉ ảnh: lớp queries tính từ publicId. */

export type ShopSort = "newest" | "price_asc" | "price_desc" | "featured";

export type ColorSwatchData = { name: string; hex: string; soldOut: boolean };

export type ProductCardData = {
  id: string;
  name: string;
  slug: string;
  imagePublicId: string | null;
  imageAlt: string;
  priceFrom: number;
  compareAtPriceFrom: number | null;
  isOutOfStock: boolean;
  colorSwatches: ColorSwatchData[];
};

/** Thẻ sản phẩm đã có địa chỉ ảnh, dùng thẳng trong giao diện. */
export type ProductCard = Omit<ProductCardData, "imagePublicId"> & { imageUrl: string | null };

export type AvailableColor = { name: string; hex: string };

export type ShopListResult<T> = {
  items: T[];
  total: number;
  page: number;
  pageCount: number;
  availableColors: AvailableColor[];
};

export type ShopVariant = {
  id: string;
  colorName: string;
  colorHex: string | null;
  size: string;
  price: number;
  compareAtPrice: number | null;
  stockQuantity: number;
};

export type ShopImage = {
  id: string;
  publicId: string;
  alt: string;
  width: number;
  height: number;
  variantId: string | null;
};

export type ShopProductData = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  description: string | null;
  material: string | null;
  careInstructions: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  variants: ShopVariant[];
  images: ShopImage[];
};

export type ShopImageView = ShopImage & { url: string | null; thumbUrl: string | null };
export type ShopProduct = Omit<ShopProductData, "images"> & { images: ShopImageView[] };

export type Suggestion = {
  name: string;
  slug: string;
  imageUrl: string | null;
  priceFrom: number;
};
