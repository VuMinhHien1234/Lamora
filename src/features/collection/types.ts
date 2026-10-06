/** Bộ sưu tập như lưu trong database. */
export type CollectionRecord = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imagePublicId: string | null;
  /** Địa chỉ ảnh xem trước, server tính sẵn (component trình duyệt không đọc được cấu hình Cloudinary). */
  imagePreviewUrl?: string | null;
  isActive: boolean;
  showOnHome: boolean;
  sortOrder: number;
};

export type CollectionWithCount = CollectionRecord & { productCount: number };

/** Một sản phẩm trong bộ sưu tập, theo thứ tự đã chọn. */
export type CollectionProductItem = {
  id: string;
  name: string;
  status: string;
  imagePublicId: string | null;
  imagePreviewUrl?: string | null;
};

export type CollectionDetail = CollectionRecord & { products: CollectionProductItem[] };

export type CollectionWriteData = {
  name: string;
  slug: string;
  description: string | null;
  imagePublicId: string | null;
  isActive: boolean;
  showOnHome: boolean;
};
