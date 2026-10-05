/** Một dòng trong giỏ: chỉ lưu mã biến thể và số lượng. Giá luôn do server tự lấy (docs/01 mục 9.3). */
export type CartLine = {
  variantId: string;
  quantity: number;
};
