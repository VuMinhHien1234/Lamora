"use client";

import { useState } from "react";
import { MAX_LINE_QUANTITY } from "@/features/cart";
import type { ShopProduct } from "../shop-types";
import {
  colorOptions,
  findVariant,
  imageIdForSelection,
  initialSelection,
  maxQuantity,
  selectColor,
  sizeOptions,
  type Selection,
} from "../variant-selection";

/** Màu, cỡ, số lượng đang chọn ở trang chi tiết, và những thứ suy ra từ đó. */
export function useProductSelection(product: ShopProduct) {
  const { variants, images } = product;
  const [selection, setSelection] = useState<Selection>(() => initialSelection(variants));
  const [quantity, setQuantity] = useState(1);
  const variant = findVariant(variants, selection);
  const max = maxQuantity(variant, MAX_LINE_QUANTITY);

  const pick = (next: Selection): void => {
    setSelection(next);
    setQuantity(1);
  };

  return {
    selection,
    variant,
    colors: colorOptions(variants),
    sizes: sizeOptions(variants, selection.colorName),
    quantity: Math.min(quantity, Math.max(max, 1)),
    max,
    focusImageId: imageIdForSelection(images, variants, selection),
    setQuantity,
    chooseColor: (name: string): void => pick(selectColor(variants, selection, name)),
    chooseSize: (size: string): void => pick({ ...selection, size }),
  };
}

export type ProductSelection = ReturnType<typeof useProductSelection>;
