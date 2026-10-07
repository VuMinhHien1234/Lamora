"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { emptyRow, type SplitErrors, type VariantRowState } from "./variant-form";
import { VariantGenerator } from "./variant-generator";
import { VariantRow } from "./variant-row";

type VariantsEditorProps = {
  rows: VariantRowState[];
  errors: SplitErrors["variants"];
  makeKey: () => string;
  onChange: (rows: VariantRowState[]) => void;
};

/** Khối 2: danh sách biến thể sửa trực tiếp, thêm dòng, sinh nhanh tổ hợp. */
export function VariantsEditor({ rows, errors, makeKey, onChange }: VariantsEditorProps) {
  const update = (key: string, patch: Partial<VariantRowState>): void =>
    onChange(rows.map((row) => (row.key === key ? { ...row, ...patch } : row)));
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-4">
      {rows.map((row, index) => (
        <VariantRow
          key={row.key}
          row={row}
          index={index}
          errors={errors[index] ?? {}}
          canRemove={rows.length > 1}
          onChange={(patch) => update(row.key, patch)}
          onRemove={() => onChange(rows.filter((item) => item.key !== row.key))}
        />
      ))}
      <div>
        <Button
          variant="secondary"
          size="compact"
          onClick={() => onChange([...rows, emptyRow(makeKey())])}
        >
          <Plus aria-hidden strokeWidth={1.25} className="size-4" /> Thêm biến thể
        </Button>
      </div>
      <VariantGenerator
        existing={rows}
        makeKey={makeKey}
        onAdd={(added) => onChange([...rows, ...added])}
      />
      <p className="type-small text-stone-500">
        Biến thể bị xóa khỏi danh sách sẽ được xóa hẳn nếu chưa có đơn hàng; nếu đã có đơn thì chỉ
        bị tắt để giữ lịch sử đơn.
      </p>
    </div>
  );
}
