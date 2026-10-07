import Link from "next/link";
import type { ProductListItem } from "../types";
import { ProductStatusSelect } from "./product-status-select";

const LINK = "type-small link-underline inline-flex min-h-11 items-center";

/** Sửa · Xem trên web (chỉ khi đang bán) · Đổi trạng thái. */
export function ProductRowActions({
  item,
  align = "start",
}: {
  item: ProductListItem;
  align?: "start" | "end";
}) {
  return (
    <div
      className={`flex flex-wrap items-center gap-x-4 gap-y-1 ${align === "end" ? "justify-end xl:flex-nowrap" : ""}`}
    >
      <Link href={`/admin/san-pham/${item.id}`} className={LINK}>
        Sửa
      </Link>
      {item.status === "ACTIVE" && (
        <Link href={`/san-pham/${item.slug}`} target="_blank" className={LINK}>
          Xem trên web
        </Link>
      )}
      <ProductStatusSelect productId={item.id} productName={item.name} status={item.status} />
    </div>
  );
}
