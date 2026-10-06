// API công khai của feature product (phần quản trị). Giao diện thêm ở bước G3 (M5, M6).
export {
  createProduct,
  saveProductImages,
  setProductStatus,
  updateProduct,
  updateProductImages,
  upsertVariants,
} from "./actions";
export { ProductEditor } from "./components/product-editor";
export { ProductListView } from "./components/product-list-view";
export { adminGetProduct, adminListProductOptions, adminListProducts } from "./queries";
export type { ListFilters } from "./list-url";
export type {
  ProductDetail,
  ProductListItem,
  ProductListResult,
  ProductOption,
  ProductStatus,
} from "./types";
