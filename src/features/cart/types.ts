/** Một dòng trong giỏ: chỉ lưu mã biến thể và số lượng. Giá luôn do server tự lấy (docs/01 mục 9.3). */
export type CartLine = {
  variantId: string;
  quantity: number;
};

export type CartWarningCode = "UNAVAILABLE" | "OUT_OF_STOCK" | "INSUFFICIENT_STOCK";

export type CartWarning = { variantId: string; code: CartWarningCode; message: string };

/** Một dòng giỏ hàng sau khi server đối chiếu với database. Giá luôn lấy từ DB. */
export type ValidatedLineData = {
  variantId: string;
  productName: string;
  productSlug: string;
  variantLabel: string;
  imagePublicId: string | null;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  /** false khi ngừng bán, hết hàng hoặc không đủ số lượng: dòng này không được tính vào tạm tính. */
  available: boolean;
  /** Tồn kho hiện có (0 nếu không còn bán), để giới hạn nút +/−. */
  maxQuantity: number;
};

export type ValidatedLine = Omit<ValidatedLineData, "imagePublicId"> & { imageUrl: string | null };

export type CartValidationData = {
  lines: ValidatedLineData[];
  subtotal: number;
  warnings: CartWarning[];
};

export type CartValidation = Omit<CartValidationData, "lines"> & { lines: ValidatedLine[] };

/** Dữ liệu một biến thể đọc từ database để đối chiếu giỏ hàng. */
export type VariantSnapshot = {
  id: string;
  colorName: string;
  size: string;
  price: number;
  stockQuantity: number;
  isActive: boolean;
  product: {
    name: string;
    slug: string;
    status: string;
    images: Array<{ publicId: string; variantId: string | null }>;
  };
};
