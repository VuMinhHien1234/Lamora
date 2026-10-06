"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/components/ui/toast";
import type { UploadedImage } from "@/features/media";
import { saveProductImages, updateProductImages } from "../actions";
import type { ProductImageRecord } from "../types";

export type ImageDraft = Pick<ProductImageRecord, "id" | "alt" | "variantId">;

const toDraft = (image: ProductImageRecord): ImageDraft => ({
  id: image.id,
  alt: image.alt,
  variantId: image.variantId,
});

export function moveItem<T>(list: T[], from: number, to: number): T[] {
  if (to < 0 || to >= list.length) return list;
  const next = [...list];
  const [item] = next.splice(from, 1);
  if (item !== undefined) next.splice(to, 0, item);
  return next;
}

function patchDraft(list: ImageDraft[], id: string, change: Partial<ImageDraft>): ImageDraft[] {
  return list.map((item) => (item.id === id ? { ...item, ...change } : item));
}

function moveDraft(list: ImageDraft[], id: string, step: number): ImageDraft[] {
  const from = list.findIndex((item) => item.id === id);
  return moveItem(list, from, from + step);
}

function sameDrafts(a: ImageDraft[], b: ImageDraft[]): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

/** Trạng thái khối ảnh: danh sách đang sửa, ảnh đánh dấu xóa, lưu và tải thêm ảnh. */
export function useImagesEditor(productId: string, images: ProductImageRecord[]) {
  const router = useRouter();
  const toast = useToast();
  const [drafts, setDrafts] = useState<ImageDraft[]>(() => images.map(toDraft));
  const [removed, setRemoved] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const shown = drafts.filter((draft) => !removed.includes(draft.id));
  const dirty = removed.length > 0 || !sameDrafts(drafts, images.map(toDraft));

  async function persist(): Promise<boolean> {
    const result = await updateProductImages({
      productId,
      images: drafts.map((draft, index) => ({ ...draft, sortOrder: index })),
      deleteIds: removed,
    });
    if (!result.ok) toast(result.error.message, "error");
    return result.ok;
  }

  async function save(): Promise<void> {
    setSaving(true);
    const saved = await persist();
    setSaving(false);
    if (saved) {
      toast("Đã lưu ảnh");
      router.refresh();
    }
  }

  async function addUploaded(uploaded: UploadedImage[]): Promise<void> {
    if (dirty && !(await persist())) return;
    const result = await saveProductImages({
      productId,
      images: uploaded.map((image) => ({ ...image, alt: "" })),
    });
    if (!result.ok) toast(result.error.message, "error");
    else toast(`Đã thêm ${uploaded.length} ảnh`);
    router.refresh();
  }

  const patch = (id: string, change: Partial<ImageDraft>): void =>
    setDrafts((list) => patchDraft(list, id, change));
  const move = (id: string, step: number): void => setDrafts((list) => moveDraft(list, id, step));

  return {
    shown,
    dirty,
    saving,
    save,
    addUploaded,
    patch,
    move,
    remove: (id: string) => setRemoved((r) => [...r, id]),
  };
}
