"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useToast } from "@/components/ui/toast";
import { createCollection, updateCollection } from "../actions";
import type { CollectionDetail } from "../types";

export type FormValues = {
  name: string;
  slug: string;
  description: string;
  imagePublicId: string | null;
  isActive: boolean;
  showOnHome: boolean;
};

function initial(collection: CollectionDetail | null): FormValues {
  return {
    name: collection?.name ?? "",
    slug: collection?.slug ?? "",
    description: collection?.description ?? "",
    imagePublicId: collection?.imagePublicId ?? null,
    isActive: collection?.isActive ?? true,
    showOnHome: collection?.showOnHome ?? false,
  };
}

/** Trạng thái và thao tác lưu của form thông tin bộ sưu tập (tạo xong chuyển sang trang sửa). */
export function useCollectionForm(collection: CollectionDetail | null) {
  const router = useRouter();
  const toast = useToast();
  const [values, setValues] = useState(() => initial(collection));
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [saving, setSaving] = useState(false);

  async function save(event: FormEvent): Promise<void> {
    event.preventDefault();
    setSaving(true);
    setErrors({});
    const body = { ...values, imagePublicId: values.imagePublicId ?? "" };
    const result = collection
      ? await updateCollection({ ...body, id: collection.id })
      : await createCollection(body);
    setSaving(false);
    if (!result.ok) {
      setErrors(result.error.fieldErrors ?? { _form: [result.error.message] });
      return;
    }
    toast(collection ? "Đã lưu bộ sưu tập" : "Đã tạo bộ sưu tập. Giờ bạn có thể thêm sản phẩm.");
    if (collection) router.refresh();
    else router.push(`/admin/bo-suu-tap/${result.data.id}`);
  }

  const patch = (change: Partial<FormValues>): void => setValues((v) => ({ ...v, ...change }));
  return { values, errors, saving, save, patch };
}
