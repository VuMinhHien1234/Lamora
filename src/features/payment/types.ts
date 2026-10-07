export type BankConfig = { bin: string; accountNo: string; accountName: string };

export type BankTransferInfo = {
  bankBin: string;
  accountNo: string;
  accountName: string;
  amount: number;
  transferContent: string;
  qrImageUrl: string;
};
