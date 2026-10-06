import { z } from "zod";

export const UPLOAD_FOLDERS = ["products", "categories", "collections", "banners"] as const;
export type UploadFolder = (typeof UPLOAD_FOLDERS)[number];

export const uploadSignatureSchema = z.object({
  folder: z.enum(UPLOAD_FOLDERS),
});

/** Định dạng và dung lượng tối đa cho mỗi ảnh tải lên (docs/04 mục 5b). */
export const ALLOWED_FORMATS = "jpg,png,webp";
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export type UploadSignature = {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  folder: string;
  allowedFormats: string;
  signature: string;
  /** Địa chỉ để trình duyệt gửi ảnh lên. */
  uploadUrl: string;
};
