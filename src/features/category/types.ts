/** Danh mục như lưu trong database (không kèm quan hệ). */
export type CategoryRecord = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imagePublicId: string | null;
  parentId: string | null;
  sortOrder: number;
  isActive: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
};

/** Danh mục kèm số sản phẩm đang thuộc về nó. */
export type CategoryWithCount = CategoryRecord & { productCount: number };

/** Một nút trong cây danh mục (tối đa 1 cấp con). */
export type CategoryNode = CategoryWithCount & { children: CategoryWithCount[] };

/** Dữ liệu ghi xuống database sau khi service đã xử lý slug và thứ tự. */
export type CategoryWriteData = {
  name: string;
  slug: string;
  description: string | null;
  imagePublicId: string | null;
  parentId: string | null;
  isActive: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
};
