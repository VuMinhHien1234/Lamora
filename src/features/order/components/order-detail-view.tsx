import { AdminPageHeader } from "@/components/layout/admin-page-header";
import { ButtonLink } from "@/components/ui/button";
import type { AddressOption } from "@/features/shipping";
import type { AdminOrderDetail } from "../admin-types";
import { AdminNoteEditor } from "./admin-note-editor";
import {
  Card,
  CustomerCard,
  NotesCards,
  OrderHeader,
  OrderItems,
  ShippingCard,
  StatusHistory,
} from "./order-detail-cards";
import { PaymentAction } from "./payment-action";
import { StatusActions } from "./status-actions";

type Props = { order: AdminOrderDetail; provinces: AddressOption[] };

/** Cột phải: thao tác. Điện thoại: thanh dính dưới đáy; máy tính: khung dính bên phải. */
function ActionsPanel({ order }: { order: AdminOrderDetail }) {
  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-20 flex flex-col gap-3 border-t border-sand-200 bg-ivory-50 p-3 lg:static lg:border lg:p-5">
        <h2 className="type-eyebrow hidden lg:block">Thao tác</h2>
        <StatusActions order={order} />
        <PaymentAction order={order} />
      </div>
      <Card title="Ghi chú nội bộ">
        <AdminNoteEditor orderId={order.id} initial={order.adminNote ?? ""} />
      </Card>
    </>
  );
}

/** Màn hình M4: chi tiết đơn hàng (docs/06 mục 6). */
export function OrderDetailView({ order, provinces }: Props) {
  return (
    <>
      <AdminPageHeader
        title="Chi tiết đơn hàng"
        actions={
          <ButtonLink href="/admin/don-hang" variant="ghost" size="compact">
            ‹ Danh sách đơn
          </ButtonLink>
        }
      />
      <div className="grid gap-6 pb-28 lg:grid-cols-[1fr_22rem] lg:pb-0">
        <div className="flex flex-col gap-6">
          <OrderHeader order={order} />
          <OrderItems order={order} />
          <div className="grid gap-6 md:grid-cols-2">
            <CustomerCard order={order} />
            <ShippingCard order={order} provinces={provinces} />
          </div>
          <NotesCards order={order} />
          <StatusHistory order={order} />
        </div>
        <aside className="flex flex-col gap-6 lg:sticky lg:top-6 lg:h-fit">
          <ActionsPanel order={order} />
        </aside>
      </div>
    </>
  );
}
