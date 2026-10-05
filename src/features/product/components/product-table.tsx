import { MoneyText } from "@/components/ui/money-text";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDate } from "@/lib/date";
import type { ProductListItem } from "../types";
import { ProductRowActions } from "./product-row-actions";
import { ProductThumb } from "./product-thumb";

function StockText({ item }: { item: ProductListItem }) {
  return (
    <span className={item.hasLowStock ? "text-warning-700" : undefined}>
      {item.totalStock}
      {item.hasLowStock && <span className="type-small block whitespace-nowrap">Sắp hết</span>}
    </span>
  );
}

function NameCell({ item }: { item: ProductListItem }) {
  return (
    <div className="flex items-center gap-4">
      <ProductThumb publicId={item.imagePublicId} alt={item.imageAlt} name={item.name} />
      <div className="min-w-0">
        <p className="type-body font-medium">{item.name}</p>
        <p className="type-small text-stone-500">
          {item.categoryName}
          {item.isFeatured && " · Nổi bật"}
        </p>
      </div>
    </div>
  );
}

const TH = "type-eyebrow px-3 py-3 text-left font-normal text-stone-500";
const TD = "px-3 py-3 align-middle";

/** Bảng cho màn hình rộng (≥ 768px). Điện thoại dùng ProductCards. */
export function ProductTable({ items }: { items: ProductListItem[] }) {
  return (
    <table className="hidden w-full border-collapse text-[0.875rem] md:table">
      <thead>
        <tr className="border-b border-sand-200">
          <th className={TH}>Sản phẩm</th>
          <th className={`${TH} text-right`}>Giá từ</th>
          <th className={`${TH} text-right`}>Tồn kho</th>
          <th className={TH}>Trạng thái</th>
          <th className={TH}>
            <span className="sr-only">Thao tác</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr
            key={item.id}
            className="border-b border-sand-200 transition-colors duration-300 hover:bg-ivory-100"
          >
            <td className={TD}>
              <NameCell item={item} />
            </td>
            <td className={`${TD} text-right`}>
              <MoneyText amount={item.priceFrom} />
            </td>
            <td className={`${TD} text-right`}>
              <StockText item={item} />
              <span className="type-small block whitespace-nowrap text-stone-500">
                {item.variantCount} biến thể
              </span>
            </td>
            <td className={TD}>
              <StatusBadge kind="product" status={item.status} />
              <span className="type-small mt-1 block whitespace-nowrap text-stone-500">
                {formatDate(item.updatedAt)}
              </span>
            </td>
            <td className={TD}>
              <ProductRowActions item={item} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** Thẻ cho điện thoại (docs/03 mục 10: bảng chuyển thành thẻ). */
export function ProductCards({ items }: { items: ProductListItem[] }) {
  return (
    <ul className="md:hidden">
      {items.map((item) => (
        <li key={item.id} className="border-b border-sand-200 py-4">
          <div className="flex items-start justify-between gap-3">
            <NameCell item={item} />
            <StatusBadge kind="product" status={item.status} />
          </div>
          <dl className="type-small mt-3 grid grid-cols-3 gap-2 text-stone-500">
            <div>
              <dt>Giá từ</dt>
              <dd className="text-ink-900">
                <MoneyText amount={item.priceFrom} />
              </dd>
            </div>
            <div>
              <dt>Tồn kho</dt>
              <dd className="text-ink-900">
                <StockText item={item} />
              </dd>
            </div>
            <div>
              <dt>Biến thể</dt>
              <dd className="text-ink-900">{item.variantCount}</dd>
            </div>
          </dl>
          <p className="type-small mt-2 text-stone-500">
            {item.categoryName} · Cập nhật {formatDate(item.updatedAt)}
          </p>
          <div className="mt-2">
            <ProductRowActions item={item} />
          </div>
        </li>
      ))}
    </ul>
  );
}
