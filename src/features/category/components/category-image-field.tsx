"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ImageUploader, type UploadedImage } from "@/features/media";

type CategoryImageFieldProps = {
  publicId: string | null;
  /** Ảnh xem trước của ảnh đã lưu; ảnh vừa tải lên chưa có nên chỉ hiện chữ "Đã chọn ảnh mới". */
  previewUrl: string | null;
  onChange: (publicId: string | null) => void;
};

/** Ảnh đại diện danh mục (4:5). Ảnh chỉ thật sự đổi khi bấm Lưu. */
export function CategoryImageField({ publicId, previewUrl, onChange }: CategoryImageFieldProps) {
  const url = previewUrl;
  return (
    <div className="grid gap-3">
      <span className="type-small">Ảnh danh mục</span>
      {publicId && (
        <div className="flex items-end gap-4">
          <div className="relative aspect-[4/5] w-24 bg-sand-200">
            {url && (
              <Image src={url} alt="Ảnh danh mục" fill unoptimized className="object-cover" />
            )}
          </div>
          <Button variant="secondary" size="compact" onClick={() => onChange(null)}>
            Bỏ ảnh
          </Button>
        </div>
      )}
      <ImageUploader
        folder="categories"
        label={publicId ? "Chọn ảnh khác" : "Kéo ảnh vào đây hoặc bấm để chọn"}
        onUploaded={(images: UploadedImage[]) => onChange(images[0]?.publicId ?? publicId)}
      />
    </div>
  );
}
