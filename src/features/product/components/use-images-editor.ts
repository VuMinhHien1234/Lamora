"use client";

import { useRef, useState } from "react";
import type { UploadedImage } from "@/features/media";
import { saveProductImages, updateProductImages } from "../actions";
import type { ProductImageRecord } from "../types";

export type ImageDraft = Pick<ProductImageRecord, "id" | "alt" | "variantId">;
/** Ảnh vừa tải lên Cloudinary, chưa gắn vào sản phẩm (chỉ lưu khi bấm Lưu ở đầu trang). */
export type PendingImage = UploadedImage & { key: string; alt: string };

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

type CommitInput = {
  productId: string;
  drafts: ImageDraft[];
  removed: string[];
  pending: PendingImage[];
  existingChanged: boolean;
  onPendingSaved: () => void;
};

/** Thêm ảnh mới trước, xóa ảnh cũ sau để sản phẩm đang bán không bị "hết ảnh" giữa chừng. Trả về lỗi nếu có. */
async function commitImages(input: CommitInput): Promise<string | undefined> {
  const { productId, drafts, removed, pending } = input;
  if (pending.length > 0) {
    const result = await saveProductImages({
      productId,
      images: pending.map(({ publicId, width, height, alt }) => ({ publicId, width, height, alt })),
    });
    if (!result.ok) return result.error.message;
    input.onPendingSaved();
  }
  if (!input.existingChanged) return undefined;
  const result = await updateProductImages({
    productId,
    images: drafts.map((draft, index) => ({ ...draft, sortOrder: index })),
    deleteIds: removed,
  });
  return result.ok ? undefined : result.error.message;
}

const patchBy = <T extends { id: string }>(list: T[], id: string, change: Partial<T>): T[] =>
  list.map((item) => (item.id === id ? { ...item, ...change } : item));

function useExistingImages(images: ProductImageRecord[]) {
  const [drafts, setDrafts] = useState<ImageDraft[]>(() => images.map(toDraft));
  const [removed, setRemoved] = useState<string[]>([]);
  const changed =
    removed.length > 0 || JSON.stringify(drafts) !== JSON.stringify(images.map(toDraft));
  return {
    drafts,
    removed,
    changed,
    shown: drafts.filter((draft) => !removed.includes(draft.id)),
    patch: (id: string, change: Partial<ImageDraft>): void =>
      setDrafts((list) => patchBy(list, id, change)),
    move: (id: string, step: number): void =>
      setDrafts((list) => {
        const from = list.findIndex((item) => item.id === id);
        return moveItem(list, from, from + step);
      }),
    remove: (id: string): void => setRemoved((r) => [...r, id]),
  };
}

function usePendingImages() {
  const counter = useRef(0);
  const [pending, setPending] = useState<PendingImage[]>([]);
  return {
    pending,
    clear: (): void => setPending([]),
    add: (uploaded: UploadedImage[]): void =>
      setPending((list) => [
        ...list,
        ...uploaded.map((image) => ({
          ...image,
          key: `pending-${(counter.current += 1)}`,
          alt: "",
        })),
      ]),
    patchAlt: (key: string, alt: string): void =>
      setPending((list) => list.map((item) => (item.key === key ? { ...item, alt } : item))),
    move: (key: string, step: number): void =>
      setPending((list) => {
        const from = list.findIndex((item) => item.key === key);
        return moveItem(list, from, from + step);
      }),
    remove: (key: string): void => setPending((list) => list.filter((i) => i.key !== key)),
  };
}

/** Trạng thái ảnh của form sản phẩm: ảnh hiện có (sửa/xóa/đổi thứ tự) và ảnh mới chờ lưu. */
export function useImagesEditor(images: ProductImageRecord[]) {
  const existing = useExistingImages(images);
  const fresh = usePendingImages();
  return {
    shown: existing.shown,
    pending: fresh.pending,
    dirty: existing.changed || fresh.pending.length > 0,
    commit: (productId: string): Promise<string | undefined> =>
      commitImages({
        productId,
        drafts: existing.drafts,
        removed: existing.removed,
        pending: fresh.pending,
        existingChanged: existing.changed,
        onPendingSaved: fresh.clear,
      }),
    addUploaded: fresh.add,
    patch: existing.patch,
    move: existing.move,
    remove: existing.remove,
    patchPending: fresh.patchAlt,
    movePending: fresh.move,
    removePending: fresh.remove,
  };
}

export type ImagesEditorState = ReturnType<typeof useImagesEditor>;
