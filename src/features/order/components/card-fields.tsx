"use client";

import { LineCardEditor, type CartValidation } from "@/features/cart";

/** Thiệp lời nhắn và gói quà theo từng sản phẩm: mỗi sản phẩm một ô riêng, luôn hiện. */
export function CardFields({ validation }: { validation: CartValidation | null }) {
  const lines = validation?.lines.filter((line) => line.available) ?? [];
  if (lines.length === 0) {
    return <p className="type-small text-stone-500">Đang tải đơn hàng…</p>;
  }
  return (
    <ul className="flex flex-col gap-5">
      {lines.map((line) => (
        <li key={line.variantId} className="flex flex-col">
          <p className="type-body">
            {line.productName}
            {line.variantLabel && (
              <span className="type-small text-stone-500"> · {line.variantLabel}</span>
            )}
          </p>
          <LineCardEditor variantId={line.variantId} name={line.productName} />
        </li>
      ))}
    </ul>
  );
}
