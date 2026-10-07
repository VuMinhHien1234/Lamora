import type { ProductCard as ProductCardData } from "../shop-types";
import { ProductCard } from "./product-card";

const PRIORITY_COUNT = 4;

/** Lưới thẻ sản phẩm: 2 cột điện thoại, 3 cột tablet, 4 cột máy tính. */
export function ProductGrid({
  products,
  withSidebar = false,
}: {
  products: ProductCardData[];
  /** Có cột bộ lọc bên cạnh thì máy tính chỉ còn 3 cột cho thoáng. */
  withSidebar?: boolean;
}) {
  return (
    <ul
      className={`grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:gap-x-6 lg:gap-y-12 ${withSidebar ? "xl:grid-cols-3" : "lg:grid-cols-4"}`}
    >
      {products.map((product, index) => (
        <li key={product.id}>
          <ProductCard product={product} priority={index < PRIORITY_COUNT} />
        </li>
      ))}
    </ul>
  );
}
