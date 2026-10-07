import { cn } from "@/lib/utils";
import { buildTimeline } from "../timeline";

const FORMAT = new Intl.DateTimeFormat("vi-VN", {
  timeZone: "Asia/Ho_Chi_Minh",
  day: "2-digit",
  month: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

function timeText(iso: string | null): string | null {
  return iso ? FORMAT.format(new Date(iso)) : null;
}

type Props = { status: string; history: { status: string; at: string }[] };

/** Các bước Chờ xác nhận → Đã xác nhận → Đang giao → Đã giao; đơn hủy/hoàn hàng hiện riêng. */
export function OrderStatusTimeline({ status, history }: Props) {
  const { steps, closed } = buildTimeline(status, history);
  return (
    <section aria-label="Tiến trình đơn hàng" className="border border-sand-200 p-5">
      {closed && (
        <p className="type-body mb-4 border-l-2 border-rose-700 pl-3">
          <strong className="font-medium">
            {closed.status === "CANCELLED" ? "Đơn đã hủy" : "Đơn đã hoàn hàng"}
          </strong>
          {closed.at && (
            <span className="type-small block text-stone-500">{timeText(closed.at)}</span>
          )}
        </p>
      )}
      <ol className="flex flex-col gap-4 sm:flex-row sm:justify-between">
        {steps.map((step) => (
          <li key={step.status} className="flex items-start gap-3 sm:flex-1 sm:flex-col sm:gap-2">
            <span
              aria-hidden
              className={cn(
                "mt-1 block size-3 shrink-0 border",
                step.reached ? "border-ink-900 bg-ink-900" : "border-sand-300",
              )}
            />
            <span>
              <span className={cn("type-body block", !step.reached && "text-stone-500")}>
                {step.label}
                {step.reached && <span className="sr-only"> (đã qua)</span>}
              </span>
              {step.at && (
                <span className="type-small block text-stone-500">{timeText(step.at)}</span>
              )}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
