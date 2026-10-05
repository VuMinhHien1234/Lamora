"use client";

import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/features/cart";

/** Biểu tượng giỏ hàng kèm số lượng. Ngăn trượt giỏ nhỏ sẽ gắn vào đây ở bước F4. */
export function CartButton() {
  const { count } = useCart();
  return (
    <Link
      href="/gio-hang"
      aria-label={count > 0 ? `Giỏ hàng, ${count} sản phẩm` : "Giỏ hàng"}
      className="relative grid size-11 place-items-center"
    >
      <ShoppingBag aria-hidden strokeWidth={1.25} className="size-5 md:size-[22px]" />
      {count > 0 && (
        <span className="absolute top-1.5 right-0.5 grid min-w-4 place-items-center bg-ink-900 px-1 text-[0.625rem] leading-4 font-medium text-ivory-50">
          {count}
        </span>
      )}
    </Link>
  );
}
