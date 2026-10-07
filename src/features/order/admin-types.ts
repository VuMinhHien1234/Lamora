import type { OrderStatus, PaymentMethod, PaymentStatus } from "./status-flow";

export type AdminOrderRow = {
  id: string;
  code: string;
  createdAt: Date;
  customerName: string;
  customerPhone: string;
  itemCount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  /** YYYY-MM-DD */
  preferredDeliveryDate: string | null;
};

export type StatusCounts = Record<OrderStatus | "ALL", number>;

export type AdminOrderList = {
  rows: AdminOrderRow[];
  total: number;
  page: number;
  pageCount: number;
  statusCounts: StatusCounts;
};

export type AdminOrderItem = {
  productName: string;
  variantLabel: string | null;
  sku: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  imageUrl: string | null;
  cardMessage: string | null;
  giftWrap: boolean;
};

export type AdminOrderHistoryEntry = {
  id: string;
  fromStatus: OrderStatus | null;
  toStatus: OrderStatus;
  note: string | null;
  createdAt: Date;
  changedByName: string | null;
};

export type AdminOrderDetail = {
  id: string;
  code: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  createdAt: Date;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  recipientName: string;
  recipientPhone: string;
  addressText: string;
  provinceCode: string;
  wardCode: string;
  addressLine: string;
  isGift: boolean;
  giftMessage: string | null;
  giftWrap: boolean;
  preferredDeliveryDate: string | null;
  customerNote: string | null;
  subtotal: number;
  shippingFee: number;
  giftWrapFee: number;
  discountAmount: number;
  total: number;
  adminNote: string | null;
  carrier: string | null;
  trackingCode: string | null;
  cancelReason: string | null;
  paidAt: Date | null;
  items: AdminOrderItem[];
  history: AdminOrderHistoryEntry[];
  /** Bước chuyển trạng thái hợp lệ tiếp theo. */
  nextStatuses: OrderStatus[];
  /** Sửa được địa chỉ/người nhận (chỉ khi chờ xác nhận hoặc đã xác nhận). */
  canEditShipping: boolean;
  /** Có đang chờ nhận tiền (đơn chưa thanh toán và chưa hủy/hoàn). */
  canMarkPaid: boolean;
};
