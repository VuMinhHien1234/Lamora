import Link from "next/link";
import type { LowStockItem } from "../types";

function stockText(quantity: number): string {
  return quantity <= 0 ? "Hết hàng" : `Còn ${quantity}`;
}

/** Biến thể sắp hết; bấm vào mở trang sửa sản phẩm (M6). */
export function LowStockList({ items }: { items: LowStockItem[] }) {
  return (
    <section className="border border-sand-200 p-5">
      <h2 className="type-h3 mb-4">Sắp hết hàng</h2>
      {items.length === 0 ? (
        <p className="type-body text-stone-500">Tất cả sản phẩm đang đủ hàng.</p>
      ) : (
        <ul className="flex flex-col divide-y divide-sand-200">
          {items.map((item) => (
            <li key={item.variantId}>
              <Link
                href={`/admin/san-pham/${item.productId}`}
                className="flex min-h-11 items-center justify-between gap-4 py-3 hover:text-rose-700"
              >
                <span className="type-body">
                  {item.productName}
                  {item.variantLabel && (
                    <span className="type-small block text-stone-500">{item.variantLabel}</span>
                  )}
                </span>
                <span
                  className={`type-small shrink-0 tabular-nums ${item.stockQuantity <= 0 ? "text-error-700" : "text-warning-700"}`}
                >
                  {stockText(item.stockQuantity)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
