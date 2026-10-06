"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { CategoryImageField } from "./category-image-field";
import { useToast } from "@/components/ui/toast";
import { createCategory, updateCategory } from "../actions";
import type { CategoryWithCount } from "../types";

type FieldErrors = Record<string, string[]>;

type DialogProps = {
  open: boolean;
  onClose: () => void;
  /** Danh mục đang sửa; không truyền nghĩa là thêm mới. */
  editing: CategoryWithCount | null;
  /** Các danh mục cấp trên cùng, để chọn làm cha. */
  parentOptions: CategoryWithCount[];
  /** Danh mục đang sửa có danh mục con thì không được chọn cha. */
  hasChildren: boolean;
};

function readForm(form: FormData, isActive: boolean): Record<string, unknown> {
  const text = (name: string): string => String(form.get(name) ?? "");
  return {
    name: text("name"),
    slug: text("slug"),
    description: text("description"),
    parentId: text("parentId"),
    seoTitle: text("seoTitle"),
    seoDescription: text("seoDescription"),
    isActive,
  };
}

function useCategoryForm(props: DialogProps) {
  const { editing, onClose } = props;
  const router = useRouter();
  const toast = useToast();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState(editing?.isActive ?? true);
  const [imagePublicId, setImagePublicId] = useState<string | null>(editing?.imagePublicId ?? null);

  async function onSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setLoading(true);
    setErrors({});
    const body = {
      ...readForm(new FormData(event.currentTarget), isActive),
      imagePublicId: imagePublicId ?? "",
    };
    const result = editing
      ? await updateCategory({ ...body, id: editing.id })
      : await createCategory(body);
    setLoading(false);
    if (!result.ok) {
      setErrors(result.error.fieldErrors ?? { _form: [result.error.message] });
      return;
    }
    toast(editing ? "Đã lưu danh mục" : "Đã thêm danh mục");
    router.refresh();
    onClose();
  }

  return { errors, loading, isActive, setIsActive, imagePublicId, setImagePublicId, onSubmit };
}

type FieldsProps = {
  editing: CategoryWithCount | null;
  parentOptions: CategoryWithCount[];
  hasChildren: boolean;
  errors: FieldErrors;
  isActive: boolean;
  onActiveChange: (value: boolean) => void;
  imagePublicId: string | null;
  onImageChange: (publicId: string | null) => void;
};

function ParentSelect(props: FieldsProps & { error?: string }) {
  const { editing, parentOptions, hasChildren, error } = props;
  return (
    <Select
      label="Danh mục cha"
      name="parentId"
      defaultValue={editing?.parentId ?? ""}
      disabled={hasChildren}
      hint={
        hasChildren ? "Danh mục này đang có danh mục con nên chỉ đứng ở cấp trên cùng." : undefined
      }
      error={error}
    >
      <option value="">Không có (danh mục chính)</option>
      {parentOptions
        .filter((option) => option.id !== editing?.id)
        .map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
    </Select>
  );
}

function SeoFields({ editing, errors }: Pick<FieldsProps, "editing" | "errors">) {
  const first = (key: string): string | undefined => errors[key]?.[0];
  return (
    <>
      <Input
        label="Tiêu đề SEO"
        name="seoTitle"
        defaultValue={editing?.seoTitle ?? ""}
        hint="Tối đa 70 ký tự. Để trống sẽ dùng tên danh mục."
        error={first("seoTitle")}
      />
      <Textarea
        label="Mô tả SEO"
        name="seoDescription"
        rows={2}
        defaultValue={editing?.seoDescription ?? ""}
        hint="Tối đa 160 ký tự, hiện trên Google."
        error={first("seoDescription")}
      />
    </>
  );
}

function ImageField({ editing, imagePublicId, onImageChange }: FieldsProps) {
  const unchanged = imagePublicId === (editing?.imagePublicId ?? null);
  return (
    <CategoryImageField
      publicId={imagePublicId}
      previewUrl={unchanged ? (editing?.imagePreviewUrl ?? null) : null}
      onChange={onImageChange}
    />
  );
}

function CategoryFormFields(props: FieldsProps) {
  const { editing, errors } = props;
  const first = (key: string): string | undefined => errors[key]?.[0];
  return (
    <>
      <Input
        label="Tên danh mục"
        name="name"
        required
        defaultValue={editing?.name}
        error={first("name")}
      />
      <Input
        label="Đường dẫn"
        name="slug"
        defaultValue={editing?.slug}
        placeholder="tu-dong-tao-tu-ten"
        hint="Để trống để tự tạo từ tên. Dùng chữ thường không dấu và dấu gạch ngang."
        error={first("slug")}
      />
      <ParentSelect {...props} error={first("parentId")} />
      <Textarea
        label="Mô tả"
        name="description"
        rows={3}
        defaultValue={editing?.description ?? ""}
        error={first("description")}
      />
      <Switch
        checked={props.isActive}
        onChange={props.onActiveChange}
        label="Hiển thị trên website"
      />
      <ImageField {...props} />
      <SeoFields editing={editing} errors={errors} />
      {first("_form") && (
        <p role="alert" className="type-small text-error-700">
          {first("_form")}
        </p>
      )}
    </>
  );
}

function CategoryForm(props: DialogProps) {
  const { editing, parentOptions, hasChildren, onClose } = props;
  const { errors, loading, isActive, setIsActive, imagePublicId, setImagePublicId, onSubmit } =
    useCategoryForm(props);
  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5 p-5">
      <CategoryFormFields
        editing={editing}
        parentOptions={parentOptions}
        hasChildren={hasChildren}
        errors={errors}
        isActive={isActive}
        onActiveChange={setIsActive}
        imagePublicId={imagePublicId}
        onImageChange={setImagePublicId}
      />
      <div className="flex gap-3">
        <Button type="submit" variant="primary" loading={loading}>
          Lưu
        </Button>
        <Button variant="subtle" onClick={onClose} disabled={loading}>
          Hủy
        </Button>
      </div>
    </form>
  );
}

/** Ngăn trượt thêm/sửa danh mục. Form được dựng lại mỗi lần mở để không dính dữ liệu cũ. */
export function CategoryFormDialog(props: DialogProps) {
  const title = props.editing ? "Sửa danh mục" : "Thêm danh mục";
  return (
    <Drawer open={props.open} onClose={props.onClose} title={title}>
      {props.open && <CategoryForm key={props.editing?.id ?? "new"} {...props} />}
    </Drawer>
  );
}
