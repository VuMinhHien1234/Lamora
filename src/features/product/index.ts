// API công khai của feature product (phần quản trị). Giao diện thêm ở bước G3 (M5, M6).
export {
  createProduct,
  saveProductImages,
  setProductStatus,
  updateProduct,
  updateProductImages,
  upsertVariants,
} from "./actions";
export { ProductCard as ProductCardView } from "./components/product-card";
export { ProductDetail as ProductDetailView } from "./components/product-detail";
export { ProductDetailsAccordion } from "./components/product-details-accordion";
export { ProductGrid } from "./components/product-grid";
export { ProductEditor } from "./components/product-editor";
export { ProductListView } from "./components/product-list-view";
export {
  adminGetProduct,
  adminListProductOptions,
  adminListProducts,
  getProductBySlug,
  listFeaturedProducts,
  listProducts,
  listRelatedProducts,
  searchSuggestions,
} from "./queries";
export { buildProductJsonLd, jsonLdString } from "./shop-seo";
export type { ShopListQuery } from "./shop-schema";
export type {
  AvailableColor,
  ProductCard,
  ShopImageView,
  ShopListResult,
  ShopProduct,
  ShopSort,
  ShopVariant,
  Suggestion,
} from "./shop-types";
export type { ListFilters } from "./list-url";
export type {
  ProductDetail,
  ProductListItem,
  ProductListResult,
  ProductOption,
  ProductStatus,
} from "./types";
