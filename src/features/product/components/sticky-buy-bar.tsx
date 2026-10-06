"use client";

import { Button } from "@/components/ui/button";
import { Price } from "@/components/ui/price";
import type { ShopVariant } from "../shop-types";
import { useAddToCart } from "./use-add-to-cart";
import type { ProductSelection } from "./use-product-selection";

/** Thanh giá + nút mua dính đáy màn hình điện thoại (docs/03 mục 9.4). */
export function StickyBuyBar({ selection }: { selection: ProductSelection }) {
  const cart = useAddToCart(selection);
  const variant: ShopVariant | null = selection.variant;
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-4 border-t border-sand-200 bg-ivory-50 px-4 py-3 lg:hidden">
      {variant && <Price price={variant.price} compareAtPrice={variant.compareAtPrice} />}
      <Button disabled={!cart.canBuy} onClick={cart.add} className="flex-1">
        {cart.canBuy ? "Thêm vào giỏ" : "Hết hàng"}
      </Button>
    </div>
  );
}
