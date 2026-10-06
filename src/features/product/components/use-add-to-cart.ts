"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/features/cart";
import { useToast } from "@/components/ui/toast";
import type { ProductSelection } from "./use-product-selection";

const CHECKOUT_PATH = "/thanh-toan";

/** Thêm biến thể đang chọn vào giỏ (lưu ở trình duyệt), hoặc "Mua ngay" → sang trang thanh toán. */
export function useAddToCart(selection: ProductSelection) {
  const cart = useCart();
  const toast = useToast();
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
      if (addToCart()) toast("Đã thêm vào giỏ hàng");
    },
    buyNow: (): void => {
      if (addToCart()) router.push(CHECKOUT_PATH);
    },
  };
}
