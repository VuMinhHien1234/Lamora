// API công khai của feature collection. M8 (CollectionManager) và M9 (CollectionEditor).
export {
  createCollection,
  deleteCollection,
  reorderCollections,
  setCollectionProducts,
  updateCollection,
} from "./actions";
export { CollectionEditor } from "./components/collection-editor";
export { CollectionManager } from "./components/collection-manager";
export { adminGetCollection, adminListCollections, getCollectionBySlug } from "./queries";
export type {
  CollectionDetail,
  CollectionProductItem,
  CollectionRecord,
  CollectionWithCount,
} from "./types";
