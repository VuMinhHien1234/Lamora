"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import type { UploadedImage, UploadFolder } from "../types";
import { ImageUploader } from "./image-uploader";

type SingleImageFieldProps = {
  folder: UploadFolder;
  label: string;
  publicId: string | null;
  /** Ảnh xem trước của ảnh đã lưu; ảnh vừa tải lên chưa có nên chỉ hiện khung trống. */
  previewUrl: string | null;
  onChange: (publicId: string | null) => void;
};

/** Ô chọn một ảnh (danh mục, bộ sưu tập…). Ảnh chỉ thật sự đổi khi người dùng bấm Lưu form. */
export function SingleImageField(props: SingleImageFieldProps) {
  const { folder, label, publicId, previewUrl, onChange } = props;
  return (
    <div className="grid gap-3">
      <span className="type-small">{label}</span>
      {publicId && (
        <div className="flex items-end gap-4">
          <div className="relative aspect-[4/5] w-24 bg-sand-200">
            {previewUrl && (
              <Image src={previewUrl} alt={label} fill unoptimized className="object-cover" />
            )}
          </div>
          <Button variant="secondary" size="compact" onClick={() => onChange(null)}>
            Bỏ ảnh
          </Button>
        </div>
      )}
      <ImageUploader
        folder={folder}
        label={publicId ? "Chọn ảnh khác" : "Kéo ảnh vào đây hoặc bấm để chọn"}
        onUploaded={(images: UploadedImage[]) => onChange(images[0]?.publicId ?? publicId)}
      />
    </div>
  );
}
