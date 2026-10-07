"use client";

import { Drawer } from "@/components/ui/drawer";
import { useCart } from "../cart-store";
import { closeMiniCart, useMiniCartOpen } from "../use-mini-cart";
import { CartPanel } from "./cart-panel";

/** Giỏ nhỏ trượt từ bên phải (docs/03 mục 9.5). Gắn một lần trong khung web khách. */
export function MiniCartDrawer() {
  const open = useMiniCartOpen();
  const { count } = useCart();
  return (
    <Drawer
      open={open}
      onClose={closeMiniCart}
      title={count > 0 ? `Giỏ hàng (${count})` : "Giỏ hàng"}
    >
      <CartPanel active={open} variant="drawer" onNavigate={closeMiniCart} />
    </Drawer>
  );
}
