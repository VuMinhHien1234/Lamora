"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/components/ui/toast";
import { setProductStatus } from "../actions";
import type { ProductStatus } from "../types";

const OPTIONS: Array<{ value: ProductStatus; label: string }> = [
  { value: "ACTIVE", label: "Đang bán" },
  { value: "DRAFT", label: "Nháp" },
  { value: "ARCHIVED", label: "Ngừng bán" },
];

type Props = { productId: string; productName: string; status: ProductStatus };

/** Đổi trạng thái ngay tại dòng. Chưa đủ điều kiện đăng bán thì báo thiếu gì và giữ nguyên. */
export function ProductStatusSelect({ productId, productName, status }: Props) {
  const router = useRouter();
  const toast = useToast();
  const [busy, setBusy] = useState(false);

  async function change(next: ProductStatus): Promise<void> {
    setBusy(true);
    const result = await setProductStatus({ id: productId, status: next });
    setBusy(false);
    if (!result.ok) toast(result.error.message);
    else toast("Đã đổi trạng thái");
    router.refresh();
  }

  return (
    <select
      aria-label={`Đổi trạng thái của ${productName}`}
      value={status}
      disabled={busy}
      onChange={(event) => void change(event.target.value as ProductStatus)}
      className="type-small h-11 rounded-xs border border-sand-200 bg-ivory-50 px-3 text-ink-900 transition-colors duration-300 hover:border-sand-300 focus:border-ink-900 disabled:opacity-50"
    >
      {OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
