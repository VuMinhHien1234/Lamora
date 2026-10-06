"use client";

import { ColorSwatch } from "@/components/ui/color-swatch";
import { SizeOption } from "@/components/ui/size-option";
import type { ProductSelection } from "./use-product-selection";

const LABEL = "type-eyebrow mb-1 block";

/** Chọn màu (ô màu) và kích thước. Chỉ hiện phần mà sản phẩm có. */
export function VariantPickers({ selection }: { selection: ProductSelection }) {
  const { colors, sizes } = selection;
  return (
    <>
      {colors.length > 0 && (
        <div>
          <span className={LABEL}>Màu — {selection.selection.colorName}</span>
          <div className="-ml-2.5 flex flex-wrap">
            {colors.map((color) => (
              <ColorSwatch
                key={color.name}
                name={color.name}
                hex={color.hex}
                soldOut={color.soldOut}
                selected={color.name === selection.selection.colorName}
                onClick={() => selection.chooseColor(color.name)}
              />
            ))}
          </div>
        </div>
      )}
      {sizes.length > 0 && (
        <div>
          <span className={LABEL}>Kích thước</span>
          <div className="flex flex-wrap gap-2">
            {sizes.map((option) => (
              <SizeOption
                key={option.size}
                selected={option.size === selection.selection.size}
                disabled={option.soldOut}
                onClick={() => selection.chooseSize(option.size)}
              >
                {option.size}
              </SizeOption>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
