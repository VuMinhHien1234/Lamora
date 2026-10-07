import { transferContent } from "@/features/order";
import type { BankConfig, BankTransferInfo } from "./types";

const QR_TEMPLATE = "compact2";

type QrInput = { amount: number; transferContent: string };

/** Link ảnh VietQR Quick Link, đã điền sẵn số tiền và nội dung chuyển khoản (docs/07 mục 2.2). */
export function buildVietQrUrl(bank: BankConfig, input: QrInput): string {
  const params = new URLSearchParams({
    amount: String(input.amount),
    addInfo: input.transferContent,
    accountName: bank.accountName,
  });
  return `https://img.vietqr.io/image/${bank.bin}-${bank.accountNo}-${QR_TEMPLATE}.png?${params}`;
}

type OrderForBank = { code: string; total: number; paymentMethod: string; paymentStatus: string };

/** Chỉ có thông tin chuyển khoản khi đơn là BANK_TRANSFER và chưa thanh toán; thiếu cấu hình ngân hàng → null. */
export function buildBankTransferInfo(
  order: OrderForBank,
  bank: BankConfig | null,
): BankTransferInfo | null {
  if (!bank || order.paymentMethod !== "BANK_TRANSFER" || order.paymentStatus !== "UNPAID") {
    return null;
  }
  const content = transferContent(order.code);
  return {
    bankBin: bank.bin,
    accountNo: bank.accountNo,
    accountName: bank.accountName,
    amount: order.total,
    transferContent: content,
    qrImageUrl: buildVietQrUrl(bank, { amount: order.total, transferContent: content }),
  };
}
