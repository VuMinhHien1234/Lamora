"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { SingleImageField } from "@/features/media";
import type { CollectionDetail } from "../types";
import { useCollectionForm, type FormValues } from "./use-collection-form";

type SwitchesProps = { values: FormValues; onChange: (change: Partial<FormValues>) => void };

function Switches({ values, onChange }: SwitchesProps) {
  return (
    <>
      <Switch
        checked={values.showOnHome}
        onChange={(showOnHome) => onChange({ showOnHome })}
        label="Hiện trên trang chủ"
      />
      <Switch
        checked={values.isActive}
        onChange={(isActive) => onChange({ isActive })}
        label="Hiển thị trên website"
      />
    </>
  );
}

/** Khối thông tin của M9: tên, đường dẫn, mô tả, ảnh, công tắc hiển thị. */
export function CollectionForm({ collection }: { collection: CollectionDetail | null }) {
  const { values, errors, saving, save, patch } = useCollectionForm(collection);
  const first = (key: string): string | undefined => errors[key]?.[0];
  const unchanged = values.imagePublicId === (collection?.imagePublicId ?? null);
  return (
    <form onSubmit={(event) => void save(event)} noValidate className="grid gap-5">
      <Input
        label="Tên bộ sưu tập"
        required
        value={values.name}
        error={first("name")}
        onChange={(e) => patch({ name: e.target.value })}
      />
      <Input
        label="Đường dẫn"
        value={values.slug}
        placeholder="tu-dong-tao-tu-ten"
        hint="Để trống để tự tạo từ tên."
        error={first("slug")}
        onChange={(e) => patch({ slug: e.target.value })}
      />
      <Textarea
        label="Mô tả"
        rows={3}
        value={values.description}
        error={first("description")}
        onChange={(e) => patch({ description: e.target.value })}
      />
      <SingleImageField
        folder="collections"
        label="Ảnh bộ sưu tập"
        publicId={values.imagePublicId}
        previewUrl={unchanged ? (collection?.imagePreviewUrl ?? null) : null}
        onChange={(imagePublicId) => patch({ imagePublicId })}
      />
      <Switches values={values} onChange={patch} />
      {first("_form") && (
        <p role="alert" className="type-small text-error-700">
          {first("_form")}
        </p>
      )}
      <div>
        <Button type="submit" variant="primary" loading={saving}>
          {collection ? "Lưu" : "Tạo bộ sưu tập"}
        </Button>
      </div>
    </form>
  );
}
