"use client";

import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import type { RowErrors, VariantRowState } from "./variant-form";

type VariantRowProps = {
  row: VariantRowState;
  index: number;
  errors: RowErrors;
  canRemove: boolean;
  onChange: (patch: Partial<VariantRowState>) => void;
  onRemove: () => void;
};

const HEX = /^#[0-9A-Fa-f]{6}$/;

function ColorFields({
  row,
  errors,
  onChange,
}: Pick<VariantRowProps, "row" | "errors" | "onChange">) {
  return (
    <div className="flex items-end gap-2">
      <div className="min-w-0 flex-1">
        <Input
          label="Màu"
          value={row.colorName}
          error={errors.colorName}
          onChange={(e) => onChange({ colorName: e.target.value })}
        />
      </div>
      <input
        type="color"
        aria-label={`Chọn mã màu cho ${row.colorName || "biến thể"}`}
        value={HEX.test(row.colorHex) ? row.colorHex : "#FCFAF6"}
        onChange={(e) => onChange({ colorHex: e.target.value.toUpperCase() })}
        className="mb-0 size-12 shrink-0 cursor-pointer border border-sand-200 bg-ivory-50 p-1"
      />
    </div>
  );
}

function PriceFields({
  row,
  errors,
  onChange,
}: Pick<VariantRowProps, "row" | "errors" | "onChange">) {
  return (
    <>
      <Input
        label="Giá bán (₫)"
        required
        inputMode="numeric"
        value={row.price}
        error={errors.price}
        onChange={(e) => onChange({ price: e.target.value })}
      />
      <Input
        label="Giá gốc (₫)"
        inputMode="numeric"
        value={row.compareAtPrice}
        hint="Hiện gạch ngang"
        error={errors.compareAtPrice}
        onChange={(e) => onChange({ compareAtPrice: e.target.value })}
      />
      <Input
        label="Tồn kho"
        required
        inputMode="numeric"
        value={row.stockQuantity}
        error={errors.stockQuantity}
        onChange={(e) => onChange({ stockQuantity: e.target.value })}
      />
    </>
  );
}

/** Một biến thể: các ô nhập xếp lưới, mỗi ô có nhãn riêng nên dùng được trên điện thoại. */
export function VariantRow({ row, index, errors, canRemove, onChange, onRemove }: VariantRowProps) {
  return (
    <fieldset
      className={cn(
        "min-w-0 border border-sand-200 bg-ivory-50 p-4",
        !row.isActive && "bg-ivory-100",
      )}
    >
      <legend className="type-eyebrow px-2 text-stone-500">Biến thể {index + 1}</legend>
      <div className="grid grid-cols-[minmax(0,1fr)] gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ColorFields row={row} errors={errors} onChange={onChange} />
        <Input
          label="Kích thước"
          value={row.size}
          error={errors.size}
          onChange={(e) => onChange({ size: e.target.value })}
        />
        <Input
          label="SKU"
          value={row.sku}
          placeholder="Tự sinh"
          error={errors.sku}
          onChange={(e) => onChange({ sku: e.target.value })}
        />
        <PriceFields row={row} errors={errors} onChange={onChange} />
      </div>
      <div className="mt-3 flex items-center justify-between">
        <Switch
          checked={row.isActive}
          onChange={(isActive) => onChange({ isActive })}
          label="Đang bán"
        />
        <button
          type="button"
          onClick={onRemove}
          disabled={!canRemove}
          className="type-small inline-flex min-h-11 items-center gap-2 text-stone-500 transition-colors duration-300 hover:text-error-700 disabled:opacity-30"
        >
          <Trash2 aria-hidden strokeWidth={1.25} className="size-4" /> Xóa dòng
        </button>
      </div>
    </fieldset>
  );
}
