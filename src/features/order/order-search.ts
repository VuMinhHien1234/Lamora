import { vnDateString } from "@/lib/date";

const DASHLESS_CODE = /^LMR(\d{6})([A-Z0-9]{4})$/;

/** Cho phép tìm bằng mã có hoặc không có dấu gạch (`LMR261005K7QF` ↔ `LMR-261005-K7QF`). */
export function normalizeOrderQuery(q: string): { text: string; exactCode: string | null } {
  const text = q.trim();
  const match = DASHLESS_CODE.exec(text.toUpperCase().replaceAll(/[\s-]/g, ""));
  return { text, exactCode: match ? `LMR-${match[1]}-${match[2]}` : null };
}

const VN_START = "T00:00:00+07:00";
const DAY_MS = 24 * 60 * 60 * 1000;

/** Khoảng thời gian [from, to) theo ngày giờ Việt Nam. Không có thì trả undefined. */
export function dateRange(
  dateFrom?: string,
  dateTo?: string,
): { gte?: Date; lt?: Date } | undefined {
  if (!dateFrom && !dateTo) return undefined;
  const range: { gte?: Date; lt?: Date } = {};
  if (dateFrom) range.gte = new Date(`${dateFrom}${VN_START}`);
  if (dateTo) range.lt = new Date(new Date(`${dateTo}${VN_START}`).getTime() + DAY_MS);
  return range;
}

/** Đơn có ngày muốn nhận trong 2 ngày tới (kể cả hôm nay) → đánh dấu nổi bật. */
export function isDeliverySoon(preferred: string | null, now: Date): boolean {
  if (!preferred) return false;
  return preferred >= vnDateString(now) && preferred <= vnDateString(now, 2);
}
