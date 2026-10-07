"use client";

import { ImageUploader } from "@/features/media";
import type { ProductImageRecord, VariantRecord } from "../types";
import { ImageCard } from "./image-card";
import type { ImagesEditorState } from "./use-images-editor";

type ImagesEditorProps = {
  editor: ImagesEditorState;
  /** Ảnh đã lưu của sản phẩm (rỗng khi thêm mới). */
  images: ProductImageRecord[];
  variants: VariantRecord[];
};

/** Khối 3 của M6: tải ảnh, sắp xếp, mô tả. Mọi thay đổi chỉ được lưu khi bấm Lưu ở đầu trang. */
export function ImagesEditor({ editor, images, variants }: ImagesEditorProps) {
  const byId = new Map(images.map((image) => [image.id, image]));
  const total = editor.shown.length + editor.pending.length;
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-4">
      <ImageUploader folder="products" multiple onUploaded={editor.addUploaded} />
      {total === 0 ? (
        <p className="type-small text-stone-500">Chưa có ảnh nào. Cần ít nhất 1 ảnh để đăng bán.</p>
      ) : (
        <ul className="grid gap-3">
          {editor.shown.map((draft, index) => (
            <ImageCard
              key={draft.id}
              alt={draft.alt}
              variantId={draft.variantId}
              previewUrl={byId.get(draft.id)?.previewUrl ?? null}
              index={index}
              total={editor.shown.length}
              variants={variants}
              onVariantChange={(variantId) => editor.patch(draft.id, { variantId })}
              onAltChange={(alt) => editor.patch(draft.id, { alt })}
              onMove={(step) => editor.move(draft.id, step)}
              onRemove={() => editor.remove(draft.id)}
            />
          ))}
          {editor.pending.map((image, index) => (
            <ImageCard
              key={image.key}
              alt={image.alt}
              variantId={null}
              previewUrl={image.previewUrl ?? null}
              index={editor.shown.length + index}
              total={editor.pending.length}
              variants={variants}
              onAltChange={(alt) => editor.patchPending(image.key, alt)}
              onMove={(step) => editor.movePending(image.key, step)}
              onRemove={() => editor.removePending(image.key)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
