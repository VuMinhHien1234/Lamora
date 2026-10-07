"use client";

import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { GeneralValues } from "./general-form";
import type { CategoryOption } from "./product-filters";

type GeneralFieldsProps = {
  values: GeneralValues;
  errors: Record<string, string>;
  categories: CategoryOption[];
  onChange: (patch: Partial<GeneralValues>) => void;
};

function IdentityFields({ values, errors, categories, onChange }: GeneralFieldsProps) {
  return (
    <>
      <Input
        label="Tên sản phẩm"
        required
        value={values.name}
        error={errors.name}
        onChange={(e) => onChange({ name: e.target.value })}
      />
      <div className="grid grid-cols-[minmax(0,1fr)] gap-5 md:grid-cols-2">
        <Input
          label="Đường dẫn"
          value={values.slug}
          placeholder="tu-dong-tao-tu-ten"
          hint="Để trống để tự tạo từ tên. Đổi đường dẫn sẽ làm link cũ không còn dùng được."
          error={errors.slug}
          onChange={(e) => onChange({ slug: e.target.value })}
        />
        <Select
          label="Danh mục"
          required
          value={values.categoryId}
          error={errors.categoryId}
          onChange={(e) => onChange({ categoryId: e.target.value })}
        >
          <option value="" disabled>
            Chọn danh mục
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
      </div>
    </>
  );
}

function DescriptionFields({ values, errors, onChange }: GeneralFieldsProps) {
  return (
    <>
      <Textarea
        label="Mô tả ngắn"
        rows={2}
        value={values.shortDescription}
        hint="Tối đa 300 ký tự, hiện ở đầu trang chi tiết."
        error={errors.shortDescription}
        onChange={(e) => onChange({ shortDescription: e.target.value })}
      />
      <Textarea
        label="Mô tả chi tiết"
        rows={8}
        value={values.description}
        hint="Có thể dùng Markdown cơ bản (xuống dòng, **đậm**, danh sách -). Phần xem trước sẽ có sau."
        error={errors.description}
        onChange={(e) => onChange({ description: e.target.value })}
      />
      <div className="grid grid-cols-[minmax(0,1fr)] gap-5 md:grid-cols-2">
        <Input
          label="Chất liệu"
          value={values.material}
          error={errors.material}
          onChange={(e) => onChange({ material: e.target.value })}
        />
        <Textarea
          label="Hướng dẫn bảo quản"
          rows={3}
          value={values.careInstructions}
          error={errors.careInstructions}
          onChange={(e) => onChange({ careInstructions: e.target.value })}
        />
      </div>
    </>
  );
}

/** Khối 1: thông tin chung (docs/06 mục 8). */
export function GeneralFields(props: GeneralFieldsProps) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-5">
      <IdentityFields {...props} />
      <DescriptionFields {...props} />
      <Switch
        checked={props.values.isFeatured}
        onChange={(isFeatured) => props.onChange({ isFeatured })}
        label="Sản phẩm nổi bật (hiện ở trang chủ)"
      />
    </div>
  );
}
