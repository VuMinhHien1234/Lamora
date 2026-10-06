"use client";

import { Gift, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Price } from "@/components/ui/price";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { LOW_STOCK_THRESHOLD } from "@/config/inventory";
import type { ShopProduct } from "../shop-types";
import { useAddToCart } from "./use-add-to-cart";
import type { ProductSelection } from "./use-product-selection";
import { VariantPickers } from "./variant-pickers";

type PurchaseProps = { product: ShopProduct; selection: ProductSelection };

function StockNote({ stock }: { stock: number }) {
  if (stock <= 0) return <p className="type-small text-error-700">Biến thể này đã hết hàng</p>;
  if (stock <= LOW_STOCK_THRESHOLD) {
    return <p className="type-small text-warning-700">Chỉ còn {stock} sản phẩm</p>;
  }
  return null;
}

function Perks() {
  return (
    <ul className="type-small grid gap-2 text-stone-500">
      <li className="flex items-center gap-3">
        <Gift aria-hidden strokeWidth={1.25} className="size-4 shrink-0" /> Thiệp lời nhắn miễn phí
      </li>
      <li className="flex items-center gap-3">
        <Truck aria-hidden strokeWidth={1.25} className="size-4 shrink-0" /> Giao toàn quốc 1–5 ngày
      </li>
    </ul>
  );
}

/** Khối mua hàng: tên, giá theo biến thể, chọn màu/cỡ/số lượng, thêm vào giỏ, mua ngay. */
export function ProductPurchase({ product, selection }: PurchaseProps) {
  const { variant } = selection;
  const cart = useAddToCart(selection);
  return (
    <div className="grid gap-6">
      <header className="grid gap-2">
        <p className="type-eyebrow text-stone-500">{product.categoryName}</p>
        <h1 className="type-h1">{product.name}</h1>
        {variant && <Price price={variant.price} compareAtPrice={variant.compareAtPrice} />}
        {product.shortDescription && (
          <p className="type-body text-stone-500">{product.shortDescription}</p>
        )}
      </header>
      <VariantPickers selection={selection} />
      <StockNote stock={variant?.stockQuantity ?? 0} />
      {cart.canBuy && (
        <QuantityStepper
          value={selection.quantity}
          max={selection.max}
          onChange={selection.setQuantity}
        />
      )}
      <div className="grid gap-3">
        <Button fullWidth disabled={!cart.canBuy} onClick={cart.add}>
          {cart.canBuy ? "Thêm vào giỏ" : "Hết hàng"}
        </Button>
        {cart.canBuy && (
          <Button variant="secondary" fullWidth onClick={cart.buyNow}>
            Mua ngay
          </Button>
        )}
      </div>
      <Perks />
    </div>
  );
}
