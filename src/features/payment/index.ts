// API công khai của feature payment (VietQR / chuyển khoản).
export { bankTransferInfoForOrder, getBankTransferInfo } from "./queries";
export type { BankTransferInfo } from "./types";
export { BankTransferBox } from "./components/bank-transfer-box";
