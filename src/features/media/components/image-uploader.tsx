"use client";

import { ImagePlus } from "lucide-react";
import { useRef, useState, type DragEvent } from "react";
import { cn } from "@/lib/utils";
import type { UploadFolder, UploadedImage } from "../types";
import { useImageUploader, type UploadItem } from "./use-image-uploader";

type ImageUploaderProps = {
  folder: UploadFolder;
  /** Cho chọn nhiều ảnh một lúc (ảnh sản phẩm) hay chỉ một (ảnh danh mục). */
  multiple?: boolean;
  disabled?: boolean;
  label?: string;
  onUploaded: (images: UploadedImage[]) => Promise<void> | void;
};

function ProgressList({ items }: { items: UploadItem[] }) {
  if (items.length === 0) return null;
  return (
    <ul className="mt-3 grid gap-2" aria-live="polite">
      {items.map((item) => (
        <li key={item.id} className="type-small">
          <div className="flex justify-between gap-3">
            <span className="truncate">{item.name}</span>
            <span className={item.error ? "text-error-700" : "text-stone-500"}>
              {item.error ?? (item.done ? "Xong" : `${item.percent}%`)}
            </span>
          </div>
          {!item.error && (
            <div
              role="progressbar"
              aria-valuenow={item.percent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Tiến trình tải ${item.name}`}
              className="mt-1 h-1 bg-sand-200"
            >
              <div
                className="h-full bg-ink-900 transition-[width] duration-300"
                style={{ width: `${item.percent}%` }}
              />
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

function useDropZone(locked: boolean, onFiles: (files: File[]) => void) {
  const [dragging, setDragging] = useState(false);
  const handlers = {
    onDragOver: (event: DragEvent): void => {
      event.preventDefault();
      setDragging(true);
    },
    onDragLeave: (): void => setDragging(false),
    onDrop: (event: DragEvent): void => {
      event.preventDefault();
      setDragging(false);
      if (!locked) onFiles([...event.dataTransfer.files]);
    },
  };
  return { dragging, handlers };
}

/** Ô tải ảnh: kéo thả hoặc bấm chọn, tự nén ảnh > 5 MB, tải thẳng lên Cloudinary. */
export function ImageUploader({
  folder,
  multiple,
  disabled,
  label = "Kéo ảnh vào đây hoặc bấm để chọn",
  onUploaded,
}: ImageUploaderProps) {
  const input = useRef<HTMLInputElement>(null);
  const { items, busy, upload } = useImageUploader({ folder, onUploaded });
  const locked = disabled || busy;
  const { dragging, handlers } = useDropZone(
    locked,
    (files) => void upload(multiple ? files : files.slice(0, 1)),
  );

  return (
    <div>
      <button
        type="button"
        disabled={locked}
        onClick={() => input.current?.click()}
        {...handlers}
        className={cn(
          "type-small flex min-h-28 w-full flex-col items-center justify-center gap-2 border border-dashed border-sand-300 px-4 text-stone-500 transition-colors duration-300 hover:border-ink-900 hover:text-ink-900 disabled:opacity-50",
          dragging && "border-ink-900 bg-ivory-100 text-ink-900",
        )}
      >
        <ImagePlus aria-hidden strokeWidth={1.25} className="size-6" />
        {busy ? "Đang tải ảnh…" : label}
        <span className="text-[0.75rem]">JPG, PNG, WebP. Ảnh trên 5 MB sẽ tự được nén.</span>
      </button>
      <input
        ref={input}
        type="file"
        hidden
        multiple={multiple}
        accept="image/jpeg,image/png,image/webp"
        data-testid="image-input"
        onChange={(event) => {
          void upload([...(event.target.files ?? [])]);
          event.target.value = "";
        }}
      />
      <ProgressList items={items} />
    </div>
  );
}
