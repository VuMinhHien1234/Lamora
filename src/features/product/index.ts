// API công khai của feature product (phần quản trị). Giao diện thêm ở bước G3 (M5, M6).
export { createProduct, setProductStatus, updateProduct, upsertVariants } from "./actions";
export { ProductEditor } from "./components/product-editor";
export { ProductListView } from "./components/product-list-view";
export { adminGetProduct, adminListProducts } from "./queries";
export type { ListFilters } from "./list-url";
export type { ProductDetail, ProductListItem, ProductListResult, ProductStatus } from "./types";
