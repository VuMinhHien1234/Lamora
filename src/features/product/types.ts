export type ProductStatus = "DRAFT" | "ACTIVE" | "ARCHIVED";

export const PRODUCT_STATUSES: readonly ProductStatus[] = ["DRAFT", "ACTIVE", "ARCHIVED"];

export type VariantRecord = {
  id: string;
  productId: string;
  sku: string;
  colorName: string;
  colorHex: string | null;
  size: string;
  price: number;
  compareAtPrice: number | null;
  stockQuantity: number;
  isActive: boolean;
  sortOrder: number;
};

export type ProductImageRecord = {
  id: string;
  publicId: string;
  alt: string;
  width: number;
  height: number;
  sortOrder: number;
  variantId: string | null;
};

export type ProductRecord = {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  shortDescription: string | null;
  description: string | null;
  material: string | null;
  careInstructions: string | null;
  status: ProductStatus;
  isFeatured: boolean;
  priceFrom: number;
  seoTitle: string | null;
  seoDescription: string | null;
  publishedAt: Date | null;
  archivedAt: Date | null;
};

/** Sản phẩm đầy đủ cho màn hình sửa (M6). */
export type ProductDetail = ProductRecord & {
  categoryName: string;
  variants: VariantRecord[];
  images: ProductImageRecord[];
};

/** Một dòng trong bảng sản phẩm (M5). */
export type ProductListItem = {
  id: string;
  name: string;
  slug: string;
  status: ProductStatus;
  isFeatured: boolean;
  categoryName: string;
  priceFrom: number;
  totalStock: number;
  variantCount: number;
  hasLowStock: boolean;
  imagePublicId: string | null;
  imageAlt: string | null;
  updatedAt: Date;
};

export type ProductListResult = {
  items: ProductListItem[];
  total: number;
  page: number;
  pageCount: number;
};

export type ProductListQuery = {
  q?: string;
  status?: ProductStatus;
  categoryId?: string;
  lowStock: boolean;
  page: number;
};

/** Dữ liệu chung của sản phẩm khi ghi xuống database (service đã sinh slug, tìm kiếm, giá). */
export type ProductWriteData = {
  name: string;
  slug: string;
  categoryId: string;
  shortDescription: string | null;
  description: string | null;
  material: string | null;
  careInstructions: string | null;
  isFeatured: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  searchText: string;
  priceFrom: number;
};

/** Biến thể sẵn sàng ghi (đã có SKU). */
export type VariantWriteData = {
  colorName: string;
  colorHex: string | null;
  size: string;
  sku: string;
  price: number;
  compareAtPrice: number | null;
  stockQuantity: number;
  isActive: boolean;
  sortOrder: number;
};

export type VariantChanges = {
  update: Array<{ id: string; data: VariantWriteData }>;
  create: VariantWriteData[];
  deactivateIds: string[];
  deleteIds: string[];
};

/** Dòng thô lấy từ database cho bảng sản phẩm; service biến nó thành ProductListItem. */
export type ProductListRow = {
  id: string;
  name: string;
  slug: string;
  status: ProductStatus;
  isFeatured: boolean;
  priceFrom: number;
  updatedAt: Date;
  categoryName: string;
  variants: Array<{ stockQuantity: number; isActive: boolean }>;
  firstImage: { publicId: string; alt: string } | null;
};

export type StatusChange = {
  status: ProductStatus;
  publishedAt?: Date;
  archivedAt?: Date | null;
};

/** Giá trị tính lại sau khi biến thể thay đổi. */
export type DerivedFields = { priceFrom: number; searchText: string };
