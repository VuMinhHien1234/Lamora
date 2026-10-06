"use client";

import { useState } from "react";
import { getImageUploadSignature } from "../actions";
import type { UploadFolder, UploadedImage } from "../types";
import { compressIfNeeded, uploadToCloudinary } from "./upload-client";
import { checkImageFile } from "./upload-rules";

export type UploadItem = {
  id: number;
  name: string;
  percent: number;
  error?: string;
  done: boolean;
};

type Options = {
  folder: UploadFolder;
  onUploaded: (images: UploadedImage[]) => Promise<void> | void;
};

/** Tải nhiều ảnh lần lượt, báo tiến trình từng ảnh, gom ảnh thành công gọi `onUploaded` một lần. */
export function useImageUploader({ folder, onUploaded }: Options) {
  const [items, setItems] = useState<UploadItem[]>([]);
  const [busy, setBusy] = useState(false);

  const patch = (id: number, change: Partial<UploadItem>): void =>
    setItems((list) => list.map((item) => (item.id === id ? { ...item, ...change } : item)));

  async function uploadOne(file: File, id: number): Promise<UploadedImage | null> {
    const problem = checkImageFile(file);
    if (problem) {
      patch(id, { error: problem, done: true });
      return null;
    }
    try {
      const prepared = await compressIfNeeded(file);
      const signed = await getImageUploadSignature({ folder });
      if (!signed.ok) throw new Error(signed.error.message);
      const image = await uploadToCloudinary(prepared, signed.data, (percent) =>
        patch(id, { percent }),
      );
      patch(id, { percent: 100, done: true });
      return image;
    } catch (error) {
      patch(id, {
        error: error instanceof Error ? error.message : "Tải ảnh thất bại.",
        done: true,
      });
      return null;
    }
  }

  async function upload(files: File[]): Promise<void> {
    if (files.length === 0) return;
    setBusy(true);
    const base = Date.now();
    setItems(
      files.map((file, index) => ({ id: base + index, name: file.name, percent: 0, done: false })),
    );
    const uploaded: UploadedImage[] = [];
    for (const [index, file] of files.entries()) {
      const image = await uploadOne(file, base + index);
      if (image) uploaded.push(image);
    }
    if (uploaded.length > 0) await onUploaded(uploaded);
    setBusy(false);
  }

  return { items, busy, upload };
}
