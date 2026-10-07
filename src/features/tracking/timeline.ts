export type TimelineStep = { status: string; label: string; at: string | null; reached: boolean };

const STEPS = [
  { status: "PENDING", label: "Chờ xác nhận" },
  { status: "CONFIRMED", label: "Đã xác nhận" },
  { status: "SHIPPING", label: "Đang giao" },
  { status: "DELIVERED", label: "Đã giao" },
] as const;

type HistoryEntry = { status: string; at: string };

/**
 * Các bước Chờ xác nhận → Đã giao kèm thời điểm đạt được. Đơn đã hủy/hoàn hàng không đi theo
 * dòng thời gian này (trả `closed` để giao diện hiện riêng).
 */
export function buildTimeline(
  status: string,
  history: HistoryEntry[],
): { steps: TimelineStep[]; closed: HistoryEntry | null } {
  const closed =
    status === "CANCELLED" || status === "RETURNED"
      ? ([...history].reverse().find((entry) => entry.status === status) ?? { status, at: "" })
      : null;
  const currentIndex = STEPS.findIndex((step) => step.status === status);
  const steps = STEPS.map((step, index) => ({
    ...step,
    at: history.find((entry) => entry.status === step.status)?.at ?? null,
    reached: closed ? history.some((entry) => entry.status === step.status) : index <= currentIndex,
  }));
  return { steps, closed };
}
