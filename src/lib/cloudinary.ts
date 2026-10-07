import { getEnv } from "@/lib/env";

type ImageOptions = {
  width: number;
  /** Tỉ lệ khung, mặc định 4:5 như ảnh sản phẩm (docs/03 mục 5.3). */
  ratio?: string;
};

/**
 * Địa chỉ ảnh Cloudinary từ `publicId` (DB chỉ lưu publicId, docs/01 mục 11).
 * Trả về null khi chưa cấu hình Cloudinary, để giao diện hiện ô ảnh tạm.
 */
export function cloudinaryUrl(publicId: string, options: ImageOptions): string | null {
  const cloudName = getEnv().CLOUDINARY_CLOUD_NAME;
  if (!cloudName || publicId.trim() === "") return null;
  const ratio = options.ratio ?? "4:5";
  const transform = `f_auto,q_auto,c_fill,ar_${ratio},w_${Math.round(options.width)}`;
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transform}/${publicId}`;
}
