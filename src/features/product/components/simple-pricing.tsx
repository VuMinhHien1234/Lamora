"use client";

import { Input } from "@/components/ui/input";
import type { SplitErrors, VariantRowState } from "./variant-form";

type SimplePricingProps = {
  rows: VariantRowState[];
  errors: SplitErrors["variants"];
  onChange: (rows: VariantRowState[]) => void;
};

/**
 * Giá và tồn kho cho sản phẩm không chia màu/cỡ: chỉnh dòng biến thể đầu tiên (biến thể mặc định).
 * Bản đầy đủ (nhiều màu/cỡ) là VariantsEditor, đang được tắt trong product-editor.tsx.
 */
export function SimplePricing({ rows, errors, onChange }: SimplePricingProps) {
  const first = rows[0];
  if (!first) return null;
  const rowErrors = errors[0] ?? {};
  const update = (patch: Partial<VariantRowState>): void =>
    onChange(rows.map((row, index) => (index === 0 ? { ...row, ...patch } : row)));
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-5 md:grid-cols-3">
      <Input
        label="Giá bán (₫)"
        required
        inputMode="numeric"
        value={first.price}
        error={rowErrors.price}
        onChange={(e) => update({ price: e.target.value })}
      />
      <Input
        label="Giá gốc (₫)"
        inputMode="numeric"
        value={first.compareAtPrice}
        hint="Tùy chọn, hiện gạch ngang"
        error={rowErrors.compareAtPrice}
        onChange={(e) => update({ compareAtPrice: e.target.value })}
      />
      <Input
        label="Tồn kho"
        required
        inputMode="numeric"
        value={first.stockQuantity}
        error={rowErrors.stockQuantity}
        onChange={(e) => update({ stockQuantity: e.target.value })}
      />
      {rows.length > 1 && (
        <p className="type-small text-stone-500 md:col-span-3">
          Sản phẩm này có {rows.length} biến thể; ở đây chỉ chỉnh biến thể đầu tiên.
        </p>
      )}
    </div>
  );
}
