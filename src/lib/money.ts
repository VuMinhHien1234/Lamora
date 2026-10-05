// Tiền luôn là số nguyên VND (docs/01 mục 7). File này chỉ lo phần hiển thị.
export function assertVndAmount(amount: number): void {
  if (!Number.isSafeInteger(amount)) {
    throw new RangeError(`Số tiền phải là số nguyên VND, nhận được: ${amount}`);
  }
}

/** 350000 → "350.000₫". Số âm hiển thị "-20.000₫". */
export function formatVnd(amount: number): string {
  assertVndAmount(amount);
  const sign = amount < 0 ? "-" : "";
  const digits = Math.abs(amount).toString();
  return `${sign}${digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}₫`;
}

/** Làm tròn giá trị thực (ví dụ kết quả phép nhân phần trăm) về số nguyên VND. */
export function roundVnd(value: number): number {
  return Math.round(value);
}
