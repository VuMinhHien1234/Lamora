const TIME_ZONE = "Asia/Ho_Chi_Minh";

const dateFormat = new Intl.DateTimeFormat("vi-VN", {
  timeZone: TIME_ZONE,
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

/** Thời gian lưu UTC, hiển thị theo giờ Việt Nam: "06/10/2026" (AGENTS.md mục 5.2). */
export function formatDate(date: Date): string {
  return dateFormat.format(date);
}

const VN_OFFSET_MS = 7 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

/** Ngày theo giờ Việt Nam dạng "YYYY-MM-DD", cộng thêm `addDays` ngày. */
export function vnDateString(now: Date, addDays = 0): string {
  return new Date(now.getTime() + VN_OFFSET_MS + addDays * DAY_MS).toISOString().slice(0, 10);
}
