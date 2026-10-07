import { ProductCardView, type ProductCard } from "@/features/product";

const MAX_ITEMS = 8;

/** Dải sản phẩm cuộn ngang (trang chủ). */
export function ProductStrip({ products }: { products: ProductCard[] }) {
  return (
    <ul className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:px-0">
      {products.slice(0, MAX_ITEMS).map((product) => (
        <li
          key={product.id}
          className="w-[44%] shrink-0 snap-start sm:w-[30%] lg:w-auto lg:[&:nth-child(n+5)]:hidden"
        >
          <ProductCardView product={product} />
        </li>
      ))}
    </ul>
  );
}
