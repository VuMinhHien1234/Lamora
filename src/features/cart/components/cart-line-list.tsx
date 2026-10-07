"use client";

import Image from "next/image";
import Link from "next/link";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { formatVnd } from "@/lib/money";
import type { ValidatedLine } from "../types";
import { LineCardEditor } from "./line-card-editor";

export type DisplayLine = ValidatedLine & { quantity: number };

type CartLineListProps = {
  lines: DisplayLine[];
  onQuantity: (variantId: string, quantity: number) => void;
  onRemove: (variantId: string) => void;
  onNavigate?: () => void;
  /** Giỏ nhỏ: ảnh và chữ gọn hơn. */
  compact?: boolean;
};

function LineImage({ line, compact }: { line: DisplayLine; compact: boolean }) {
  return (
    <div
      className={`relative aspect-[4/5] shrink-0 bg-ivory-100 ${compact ? "w-20" : "w-24 md:w-28"}`}
    >
      {line.imageUrl && (
        <Image
          src={line.imageUrl}
          alt={line.productName}
          fill
          unoptimized
          sizes="112px"
          className="object-cover"
        />
      )}
    </div>
  );
}

function LineQuantity({
  line,
  onQuantity,
}: Pick<CartLineListProps, "onQuantity"> & { line: DisplayLine }) {
  if (!line.available) return null;
  return (
    <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
      <QuantityStepper
        value={line.quantity}
        max={Math.max(1, line.maxQuantity)}
        onChange={(q) => onQuantity(line.variantId, q)}
      />
      <span className="type-body tabular-nums">{formatVnd(line.unitPrice * line.quantity)}</span>
    </div>
  );
}

function LineItem({
  line,
  onQuantity,
  onRemove,
  onNavigate,
  compact = false,
}: Omit<CartLineListProps, "lines"> & { line: DisplayLine }) {
  return (
    <li className="flex gap-4 py-5">
      <LineImage line={line} compact={compact} />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <Link
          href={`/san-pham/${line.productSlug}`}
          onClick={onNavigate}
          className="type-body line-clamp-2"
        >
          {line.productName}
        </Link>
        {line.variantLabel && <p className="type-small text-stone-500">{line.variantLabel}</p>}
        {line.available ? (
          <p className="type-small">{formatVnd(line.unitPrice)}</p>
        ) : (
          <p className="type-small text-warning-700">Tạm thời không thể mua</p>
        )}
        <LineQuantity line={line} onQuantity={onQuantity} />
        {line.available && !compact && (
          <LineCardEditor variantId={line.variantId} name={line.productName} />
        )}
        <button
          type="button"
          onClick={() => onRemove(line.variantId)}
          className="type-small mt-1 self-start text-stone-500 underline underline-offset-4 hover:text-ink-900"
        >
          Xóa<span className="sr-only"> {line.productName} khỏi giỏ</span>
        </button>
      </div>
    </li>
  );
}

export function CartLineList({ lines, ...handlers }: CartLineListProps) {
  return (
    <ul className="divide-y divide-sand-200 border-y border-sand-200">
      {lines.map((line) => (
        <LineItem key={line.variantId} line={line} {...handlers} />
      ))}
    </ul>
  );
}
