"use client";

import type { ReactNode } from "react";
import type { ShopProduct } from "../shop-types";
import { ProductGallery } from "./product-gallery";
import { ProductPurchase } from "./product-purchase";
import { StickyBuyBar } from "./sticky-buy-bar";
import { useProductSelection } from "./use-product-selection";

type DetailProps = {
  product: ShopProduct;
  /** Phần tĩnh (accordion mô tả…) dựng ở server, đặt dưới khối mua hàng. */
  details: ReactNode;
};

/** Bố cục S6: ảnh 7 cột, thông tin 5 cột và dính khi cuộn (máy tính); xếp dọc trên điện thoại. */
export function ProductDetail({ product, details }: DetailProps) {
  const selection = useProductSelection(product);
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-8 pb-20 lg:grid-cols-12 lg:gap-12 lg:pb-0">
      <div className="lg:col-span-7">
        <ProductGallery
          images={product.images}
          productName={product.name}
          focusImageId={selection.focusImageId}
        />
      </div>
      <div className="lg:col-span-5">
        <div className="grid gap-8 lg:sticky lg:top-24">
          <ProductPurchase product={product} selection={selection} />
          {details}
        </div>
      </div>
      <StickyBuyBar selection={selection} />
    </div>
  );
}
