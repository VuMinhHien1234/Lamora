import { FREE_SHIPPING_THRESHOLD } from "@/config/shipping";
import { formatVnd } from "@/lib/money";

/** Dải thông báo trên cùng (36px, nền blush-100). Ngưỡng miễn phí ship lấy từ config. */
export function AnnouncementBar() {
  return (
    <div className="type-small flex h-9 items-center justify-center bg-blush-100 px-4 text-center text-ink-900">
      Miễn phí giao hàng cho đơn từ {formatVnd(FREE_SHIPPING_THRESHOLD)}
    </div>
  );
}
