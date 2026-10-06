"use client";

import Image from "next/image";
import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { ProductImageRecord, VariantRecord } from "../types";
import type { ImageDraft } from "./use-images-editor";

export type VariantOption = Pick<VariantRecord, "id" | "colorName" | "size">;

type ImageCardProps = {
  draft: ImageDraft;
  image: ProductImageRecord;
  index: number;
  total: number;
  variants: VariantOption[];
  onChange: (patch: Partial<ImageDraft>) => void;
  onMove: (step: number) => void;
  onRemove: () => void;
};

const variantLabel = (v: VariantOption): string =>
  [v.colorName, v.size].filter(Boolean).join(" · ") || "Mặc định";

function Preview({ image, cover }: { image: ProductImageRecord; cover: boolean }) {
  const url = image.previewUrl ?? null;
  return (
    <div className="relative aspect-[4/5] w-24 shrink-0 bg-sand-200 sm:w-28">
      {url && (
        <Image src={url} alt={image.alt} fill unoptimized sizes="112px" className="object-cover" />
      )}
      {cover && (
        <span className="type-small absolute bottom-0 left-0 bg-ink-900 px-2 text-ivory-50">
          Ảnh bìa
        </span>
      )}
    </div>
  );
}

type ActionsProps = {
  index: number;
  total: number;
  onMove: (step: number) => void;
  onRemove: () => void;
};

function CardActions({ index, total, onMove, onRemove }: ActionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="secondary"
        size="compact"
        disabled={index === 0}
        aria-label="Đưa lên trước"
        onClick={() => onMove(-1)}
      >
        <ArrowUp aria-hidden strokeWidth={1.25} className="size-4" />
      </Button>
      <Button
        variant="secondary"
        size="compact"
        disabled={index === total - 1}
        aria-label="Đưa xuống sau"
        onClick={() => onMove(1)}
      >
        <ArrowDown aria-hidden strokeWidth={1.25} className="size-4" />
      </Button>
      <Button variant="secondary" size="compact" onClick={onRemove}>
        <Trash2 aria-hidden strokeWidth={1.25} className="size-4" /> Xóa
      </Button>
    </div>
  );
}

/** Một ảnh: xem trước 4:5, mô tả (alt), gắn biến thể, đổi thứ tự, xóa. */
export function ImageCard({
  draft,
  image,
  index,
  total,
  variants,
  onChange,
  onMove,
  onRemove,
}: ImageCardProps) {
  return (
    <li className="flex gap-4 border border-sand-200 p-3">
      <Preview image={image} cover={index === 0} />
      <div className="grid min-w-0 flex-1 gap-3">
        <Input
          label="Mô tả ảnh"
          value={draft.alt}
          maxLength={200}
          onChange={(event) => onChange({ alt: event.target.value })}
        />
        <Select
          label="Gắn với biến thể"
          value={draft.variantId ?? ""}
          onChange={(event) => onChange({ variantId: event.target.value || null })}
        >
          <option value="">Dùng chung cho cả sản phẩm</option>
          {variants.map((v) => (
            <option key={v.id} value={v.id}>
              {variantLabel(v)}
            </option>
          ))}
        </Select>
        <CardActions index={index} total={total} onMove={onMove} onRemove={onRemove} />
      </div>
    </li>
  );
}
