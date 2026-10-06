export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
/** Cloudinary Free nhận ảnh tới 10 MB, nhưng shop giữ ≤ 5 MB cho nhẹ (docs/04 mục 5b). */
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
/** Ảnh gốc to hơn mức này thì từ chối luôn, không cố nén. */
export const MAX_SOURCE_BYTES = 40 * 1024 * 1024;
export const MAX_SIDE_PX = 2400;

type FileInfo = { type: string; size: number };

/** Kiểm tra ảnh trước khi tải. Trả về thông báo lỗi tiếng Việt, hoặc null nếu dùng được. */
export function checkImageFile(file: FileInfo): string | null {
  if (!(ALLOWED_IMAGE_TYPES as readonly string[]).includes(file.type)) {
    return "Chỉ nhận ảnh JPG, PNG hoặc WebP.";
  }
  if (file.size > MAX_SOURCE_BYTES) return "Ảnh quá lớn (trên 40 MB), hãy chọn ảnh nhỏ hơn.";
  return null;
}

export function needsCompression(file: FileInfo): boolean {
  return file.size > MAX_UPLOAD_BYTES;
}

/** Thu nhỏ để cạnh dài nhất không quá `max`, giữ tỉ lệ; ảnh nhỏ hơn thì giữ nguyên. */
export function fitWithin(
  width: number,
  height: number,
  max: number,
): { width: number; height: number } {
  const longest = Math.max(width, height);
  if (longest <= max) return { width, height };
  const scale = max / longest;
  return { width: Math.round(width * scale), height: Math.round(height * scale) };
}
