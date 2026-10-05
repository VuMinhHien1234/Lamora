import { MoneyText } from "@/components/ui/money-text";
import { Pagination } from "@/components/ui/pagination";
import { StatusBadge } from "@/components/ui/status-badge";
import { KitRow, KitSection } from "./kit-section";

export function KitAdmin() {
  return (
    <KitSection id="admin" title="Thành phần riêng của quản trị">
      <KitRow label="Trạng thái đơn">
        <StatusBadge kind="order" status="PENDING" />
        <StatusBadge kind="order" status="CONFIRMED" />
        <StatusBadge kind="order" status="SHIPPING" />
        <StatusBadge kind="order" status="DELIVERED" />
        <StatusBadge kind="order" status="CANCELLED" />
        <StatusBadge kind="order" status="RETURNED" />
      </KitRow>
      <KitRow label="Thanh toán">
        <StatusBadge kind="payment" status="UNPAID" />
        <StatusBadge kind="payment" status="PAID" />
        <StatusBadge kind="payment" status="REFUNDED" />
      </KitRow>
      <KitRow label="Sản phẩm">
        <StatusBadge kind="product" status="DRAFT" />
        <StatusBadge kind="product" status="ACTIVE" />
        <StatusBadge kind="product" status="ARCHIVED" />
      </KitRow>
      <KitRow label="Số tiền">
        <MoneyText amount={1250000} />
      </KitRow>
      <KitRow label="Phân trang">
        <Pagination page={5} pageCount={10} hrefFor={(n) => `#trang-${n}`} />
      </KitRow>
    </KitSection>
  );
}
