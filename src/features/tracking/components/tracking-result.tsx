import { getLookedUpOrder, OrderRecap } from "@/features/order";
import { bankTransferInfoForOrder, BankTransferBox } from "@/features/payment";
import { OrderStatusTimeline } from "./order-status-timeline";
import { ShipmentInfo } from "./shipment-info";

const PAYMENT_TEXT: Record<string, string> = {
  PAID: "Đã thanh toán",
  REFUNDED: "Đã hoàn tiền",
  UNPAID: "Chưa thanh toán",
};

/** Kết quả tra cứu (server): chỉ hiện khi cookie xác thực của đúng mã đơn này còn hạn. */
export async function TrackingResult({ code }: { code: string }) {
  const result = await getLookedUpOrder(code);
  if (!result) {
    return (
      <p role="alert" className="type-body border border-sand-200 p-5">
        Phiên tra cứu đã hết hạn hoặc không hợp lệ. Vui lòng nhập lại mã đơn và số điện thoại.
      </p>
    );
  }
  const { order } = result;
  const bank = bankTransferInfoForOrder(order);
  return (
    <div className="flex flex-col gap-6">
      <p className="type-body">
        Đơn <strong className="font-medium tracking-wide">{order.code}</strong> ·{" "}
        {PAYMENT_TEXT[order.paymentStatus] ?? order.paymentStatus}
      </p>
      <OrderStatusTimeline status={order.status} history={result.history} />
      <ShipmentInfo carrier={result.carrier} trackingCode={result.trackingCode} />
      {bank && <BankTransferBox info={bank} />}
      <OrderRecap order={order} />
    </div>
  );
}
