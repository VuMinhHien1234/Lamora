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
