"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { GeneralValues } from "./general-form";

type SeoFieldsProps = {
  values: GeneralValues;
  errors: Record<string, string>;
  onChange: (patch: Partial<GeneralValues>) => void;
};

function SearchPreview({ values }: { values: GeneralValues }) {
  const title = values.seoTitle.trim() || values.name.trim() || "Tên sản phẩm";
  const slug = values.slug.trim() || "ten-san-pham";
  const description =
    values.seoDescription.trim() ||
    values.shortDescription.trim() ||
    "Mô tả ngắn của sản phẩm sẽ hiện ở đây.";
  return (
    <div aria-label="Xem trước kết quả Google" className="border border-sand-200 bg-ivory-100 p-4">
      <p className="type-eyebrow mb-2 text-stone-500">Xem trước trên Google</p>
      <p className="type-body truncate font-medium text-rose-700">{title}</p>
      <p className="type-small truncate text-sage-700">lamoraflower.vn › san-pham › {slug}</p>
      <p className="type-small mt-1 line-clamp-2 text-stone-500">{description}</p>
    </div>
  );
}

/** Khối 5: SEO và khung xem trước kết quả tìm kiếm. */
export function SeoFields({ values, errors, onChange }: SeoFieldsProps) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-5">
      <Input
        label="Tiêu đề SEO"
        value={values.seoTitle}
        hint="Tối đa 70 ký tự. Để trống sẽ dùng tên sản phẩm."
        error={errors.seoTitle}
        onChange={(e) => onChange({ seoTitle: e.target.value })}
      />
      <Textarea
        label="Mô tả SEO"
        rows={2}
        value={values.seoDescription}
        hint="Tối đa 160 ký tự. Để trống sẽ dùng mô tả ngắn."
        error={errors.seoDescription}
        onChange={(e) => onChange({ seoDescription: e.target.value })}
      />
      <SearchPreview values={values} />
    </div>
  );
}
