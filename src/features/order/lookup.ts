import { normalizePhone } from "@/lib/phone";
import { toConfirmation } from "./confirmation-service";
import { normalizeOrderQuery } from "./order-search";
import type { LookupRow, OrderLookup } from "./types";

/** Chuẩn hóa riêng mã đơn: `lmr261005k7qf` → `LMR-261005-K7QF`; sai định dạng → null. */
export function normalizeLookupCode(code: string): string | null {
  return normalizeOrderQuery(code).exactCode;
}

/** Chuẩn hóa mã đơn (chấp nhận thiếu dấu gạch, chữ thường) và số điện thoại; sai định dạng → null. */
export function normalizeLookupInput(
  code: string,
  phone: string,
): { code: string; phone: string } | null {
  const normalizedCode = normalizeLookupCode(code);
  const normalizedPhone = normalizePhone(phone);
  return normalizedCode && normalizedPhone
    ? { code: normalizedCode, phone: normalizedPhone }
    : null;
}

/** Khớp với số người đặt hoặc số người nhận (đơn quà tặng). */
export function phoneMatchesOrder(row: LookupRow, phone: string): boolean {
  return [row.customerPhone, row.recipientPhone].some((stored) => normalizePhone(stored) === phone);
}

export function toLookup(row: LookupRow): OrderLookup {
  // Tách các trường riêng của tra cứu ra trước, để `order` không mang theo số điện thoại.
  const { customerPhone, recipientPhone, carrier, trackingCode, history, ...confirmation } = row;
  void customerPhone;
  void recipientPhone;
  return {
    order: toConfirmation(confirmation),
    carrier,
    trackingCode,
    history: history.map((entry) => ({
      status: entry.toStatus,
      at: entry.createdAt.toISOString(),
    })),
  };
}
