export type LowStockItem = {
  variantId: string;
  productId: string;
  productName: string;
  /** Ví dụ "Hồng · Lớn"; null nếu sản phẩm chỉ có một biến thể không tên. */
  variantLabel: string | null;
  sku: string;
  stockQuantity: number;
};

export type AdminSummary = {
  pendingOrders: number;
  unpaidTransferOrders: number;
  revenueToday: number;
  revenue7Days: number;
  lowStock: LowStockItem[];
};

/** Mốc thời gian (UTC) mà repository dùng để cộng doanh thu. */
export type SummaryRanges = {
  todayStart: Date;
  weekStart: Date;
};
