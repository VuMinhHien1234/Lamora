"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generateCombos, type VariantRowState } from "./variant-form";

type GeneratorProps = {
  existing: VariantRowState[];
  makeKey: () => string;
  onAdd: (rows: VariantRowState[]) => void;
};

const START = { colors: "", sizes: "", price: "", stock: "0" };

/** Công cụ nhanh: nhập danh sách màu và cỡ, sinh mọi tổ hợp chưa có (docs/06 mục 8). */
export function VariantGenerator({ existing, makeKey, onAdd }: GeneratorProps) {
  const [form, setForm] = useState(START);
  const [note, setNote] = useState<string>();
  const set = (patch: Partial<typeof START>): void => setForm((state) => ({ ...state, ...patch }));

  function generate(): void {
    const rows = generateCombos(form, existing, makeKey);
    setNote(rows.length > 0 ? `Đã thêm ${rows.length} biến thể.` : "Không có tổ hợp mới để thêm.");
    if (rows.length > 0) onAdd(rows);
  }

  return (
    <div className="border border-dashed border-sand-300 p-4">
      <p className="type-eyebrow mb-1">Sinh nhanh nhiều biến thể</p>
      <p className="type-small mb-4 text-stone-500">
        Ngăn cách bằng dấu phẩy. Ví dụ màu “Hồng, Trắng”, cỡ “Nhỏ (30cm), Vừa (45cm)”.
      </p>
      <div className="grid grid-cols-[minmax(0,1fr)] gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Input
          label="Các màu"
          value={form.colors}
          onChange={(e) => set({ colors: e.target.value })}
        />
        <Input label="Các cỡ" value={form.sizes} onChange={(e) => set({ sizes: e.target.value })} />
        <Input
          label="Giá chung (₫)"
          inputMode="numeric"
          value={form.price}
          onChange={(e) => set({ price: e.target.value })}
        />
        <Input
          label="Tồn kho chung"
          inputMode="numeric"
          value={form.stock}
          onChange={(e) => set({ stock: e.target.value })}
        />
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <Button variant="secondary" size="compact" onClick={generate}>
          Sinh biến thể
        </Button>
        {note && (
          <p role="status" className="type-small text-stone-500">
            {note}
          </p>
        )}
      </div>
    </div>
  );
}
