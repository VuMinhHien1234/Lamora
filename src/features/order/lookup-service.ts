import { normalizeLookupCode, normalizeLookupInput, phoneMatchesOrder, toLookup } from "./lookup";
import * as repo from "./repository";
import type { OrderLookup } from "./types";

/**
 * Tra cứu đơn bằng mã đơn + số điện thoại; phải khớp cả hai. Sai định dạng, không có đơn hoặc sai SĐT
 * đều trả null để người gọi báo chung một câu, không cho đoán mã đơn (docs/04 mục 8.1 #3).
 * Nơi gọi chịu trách nhiệm giới hạn tần suất.
 */
export async function lookupOrder(code: string, phone: string): Promise<OrderLookup | null> {
  const input = normalizeLookupInput(code, phone);
  if (!input) return null;
  const row = await repo.findLookupByCode(input.code);
  return row && phoneMatchesOrder(row, input.phone) ? toLookup(row) : null;
}

/**
 * Kết quả tra cứu của đơn đã được xác thực ở bước trước (cookie ký). Không hỏi lại SĐT, nên chỉ gọi
 * khi `verifiedCode` lấy từ cookie đã kiểm tra chữ ký và trùng với `code` đang xem.
 */
export async function lookupVerified(
  code: string,
  verifiedCode: string | null,
): Promise<OrderLookup | null> {
  const normalized = normalizeLookupCode(code);
  if (!normalized || verifiedCode !== normalized) return null;
  const row = await repo.findLookupByCode(normalized);
  return row ? toLookup(row) : null;
}
