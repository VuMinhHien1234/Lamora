import { describe, expect, it, vi } from "vitest";

vi.mock("@/features/order", () => ({ transferContent: (c: string) => c.replaceAll("-", "") }));
const { buildBankTransferInfo, buildVietQrUrl } = await import("./service");

const bank = { bin: "970422", accountNo: "0123456789", accountName: "NGUYEN VAN A" };
const order = {
  code: "LMR-261005-K7QF",
  total: 940_000,
  paymentMethod: "BANK_TRANSFER",
  paymentStatus: "UNPAID",
};

describe("buildVietQrUrl", () => {
  it("ghép bin, số tài khoản, số tiền, nội dung và tên chủ tài khoản", () => {
    const url = new URL(
      buildVietQrUrl(bank, { amount: 940_000, transferContent: "LMR261005K7QF" }),
    );
    expect(url.pathname).toBe("/image/970422-0123456789-compact2.png");
    expect(url.searchParams.get("amount")).toBe("940000");
    expect(url.searchParams.get("addInfo")).toBe("LMR261005K7QF");
    expect(url.searchParams.get("accountName")).toBe("NGUYEN VAN A");
  });

  it("mã hóa tên có ký tự đặc biệt", () => {
    const url = buildVietQrUrl(
      { ...bank, accountName: "A & B" },
      { amount: 1, transferContent: "X" },
    );
    expect(url).toContain("accountName=A+%26+B");
  });
});

describe("buildBankTransferInfo", () => {
  it("đơn chuyển khoản chưa thanh toán → có thông tin, nội dung bỏ dấu gạch", () => {
    const info = buildBankTransferInfo(order, bank);
    expect(info).toMatchObject({
      amount: 940_000,
      transferContent: "LMR261005K7QF",
      accountNo: "0123456789",
    });
    expect(info?.qrImageUrl).toContain("amount=940000");
  });

  it("không có thông tin khi COD, đã thanh toán hoặc chưa cấu hình ngân hàng", () => {
    expect(buildBankTransferInfo({ ...order, paymentMethod: "COD" }, bank)).toBeNull();
    expect(buildBankTransferInfo({ ...order, paymentStatus: "PAID" }, bank)).toBeNull();
    expect(buildBankTransferInfo(order, null)).toBeNull();
  });
});
