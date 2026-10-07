"use client";

import { useRouter } from "next/navigation";
import { openMiniCart, useCart } from "@/features/cart";
import type { ProductSelection } from "./use-product-selection";

const CHECKOUT_PATH = "/thanh-toan";

/** Thêm biến thể đang chọn vào giỏ (lưu ở trình duyệt), hoặc "Mua ngay" → sang trang thanh toán. */
export function useAddToCart(selection: ProductSelection) {
  const cart = useCart();
  const router = useRouter();
  const { variant, quantity } = selection;
  const canBuy = variant !== null && variant.stockQuantity > 0;

  function addToCart(): boolean {
    if (!variant || !canBuy) return false;
    cart.add(variant.id, quantity);
    return true;
  }

  return {
    canBuy,
    add: (): void => {
      if (addToCart()) openMiniCart();
    },
    buyNow: (): void => {
      if (addToCart()) router.push(CHECKOUT_PATH);
    },
  };
}
