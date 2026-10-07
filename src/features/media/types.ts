export const UPLOAD_FOLDERS = ["products", "categories", "collections", "banners"] as const;
export type UploadFolder = (typeof UPLOAD_FOLDERS)[number];

/** Mọi thứ trình duyệt cần để tải ảnh thẳng lên Cloudinary (không đi qua server của shop). */
export type UploadSignature = {
  uploadUrl: string;
  apiKey: string;
  timestamp: number;
  signature: string;
  folder: string;
  allowedFormats: string;
};

/** Kết quả sau khi Cloudinary nhận ảnh. */
export type UploadedImage = {
  publicId: string;
  width: number;
  height: number;
  /** Ảnh nhỏ để xem trước ngay sau khi tải (chưa lưu vào sản phẩm). */
  previewUrl?: string;
};

export type CloudinaryCredentials = {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
};
