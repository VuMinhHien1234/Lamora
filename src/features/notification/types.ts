export type NewOrderNotice = {
  id: string;
  code: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  recipientName: string;
  recipientPhone: string;
  addressLine: string;
  wardName: string;
  provinceName: string;
  preferredDeliveryDate: Date | null;
  isGift: boolean;
  customerNote: string | null;
  paymentMethod: "COD" | "BANK_TRANSFER";
  subtotal: number;
  shippingFee: number;
  giftWrapFee: number;
  total: number;
  items: {
    productName: string;
    variantLabel: string | null;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
    cardMessage: string | null;
    giftWrap: boolean;
  }[];
};
