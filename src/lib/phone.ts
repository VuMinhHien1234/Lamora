/** Số điện thoại di động Việt Nam: 10 số, bắt đầu 03/05/07/08/09. Chấp nhận +84 / 84 / dấu cách / dấu chấm. */
const MOBILE_PATTERN = /^0[35789]\d{8}$/;

/** Chuẩn hóa về dạng `0xxxxxxxxx`. Không hợp lệ → null. */
export function normalizePhone(input: string): string | null {
  const digits = input.replace(/[\s.\-()]/g, "");
  const local = digits.replace(/^(\+84|84)(?=[35789]\d{8}$)/, "0");
  return MOBILE_PATTERN.test(local) ? local : null;
}
