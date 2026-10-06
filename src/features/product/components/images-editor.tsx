"use client";

import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/features/media";
import type { ProductDetail } from "../types";
import { ImageCard } from "./image-card";
import { useImagesEditor } from "./use-images-editor";

/** Khối 3 của M6: tải ảnh, sắp xếp, mô tả, gắn biến thể. Ảnh đầu tiên là ảnh bìa. */
export function ImagesEditor({ product }: { product: ProductDetail }) {
  const editor = useImagesEditor(product.id, product.images);
  const byId = new Map(product.images.map((image) => [image.id, image]));
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-4">
      <ImageUploader folder="products" multiple onUploaded={editor.addUploaded} />
      {editor.shown.length === 0 ? (
        <p className="type-small text-stone-500">Chưa có ảnh nào. Cần ít nhất 1 ảnh để đăng bán.</p>
      ) : (
        <ul className="grid gap-3">
          {editor.shown.map((draft, index) => {
            const image = byId.get(draft.id);
            if (!image) return null;
            return (
              <ImageCard
                key={draft.id}
                draft={draft}
                image={image}
                index={index}
                total={editor.shown.length}
                variants={product.variants}
                onChange={(patch) => editor.patch(draft.id, patch)}
                onMove={(step) => editor.move(draft.id, step)}
                onRemove={() => editor.remove(draft.id)}
              />
            );
          })}
        </ul>
      )}
      {editor.dirty && (
        <div>
          <Button
            variant="primary"
            size="compact"
            loading={editor.saving}
            onClick={() => void editor.save()}
          >
            Lưu thay đổi ảnh
          </Button>
        </div>
      )}
    </div>
  );
}
