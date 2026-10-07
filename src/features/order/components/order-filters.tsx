import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { buildOrderListUrl, type OrderListFilters } from "../list-url";

function PaymentSelects({ filters }: { filters: OrderListFilters }) {
  return (
    <>
      <Select label="Thanh toán" name="paymentStatus" defaultValue={filters.paymentStatus ?? ""}>
        <option value="">Tất cả</option>
        <option value="UNPAID">Chưa thanh toán</option>
        <option value="PAID">Đã thanh toán</option>
        <option value="REFUNDED">Đã hoàn tiền</option>
      </Select>
      <Select label="Phương thức" name="paymentMethod" defaultValue={filters.paymentMethod ?? ""}>
        <option value="">Tất cả</option>
        <option value="COD">COD</option>
        <option value="BANK_TRANSFER">Chuyển khoản</option>
      </Select>
    </>
  );
}

/** Form GET thường nên dùng được cả khi chưa tải xong JavaScript. */
export function OrderFilters({ filters }: { filters: OrderListFilters }) {
  const hasFilter = Boolean(
    filters.q ||
    filters.paymentStatus ||
    filters.paymentMethod ||
    filters.dateFrom ||
    filters.dateTo,
  );
  return (
    <form
      method="get"
      action={buildOrderListUrl({})}
      className="mb-6 grid gap-4 md:grid-cols-4 md:items-end"
    >
      {filters.status && <input type="hidden" name="status" value={filters.status} />}
      <div className="md:col-span-2">
        <Input
          label="Tìm đơn"
          name="q"
          type="search"
          defaultValue={filters.q}
          placeholder="Mã đơn, SĐT hoặc tên khách"
        />
      </div>
      <PaymentSelects filters={filters} />
      <Input label="Từ ngày" name="dateFrom" type="date" defaultValue={filters.dateFrom} />
      <Input label="Đến ngày" name="dateTo" type="date" defaultValue={filters.dateTo} />
      <div className="flex items-center gap-4 md:col-span-2">
        <Button type="submit" variant="primary" size="compact">
          Lọc
        </Button>
        {hasFilter && (
          <Link
            href={buildOrderListUrl({ status: filters.status })}
            className="type-small link-underline"
          >
            Xóa lọc
          </Link>
        )}
      </div>
    </form>
  );
}
