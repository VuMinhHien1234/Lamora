import { createHash } from "node:crypto";
import { AppError } from "@/lib/errors";
import { getEnv } from "@/lib/env";
import { logger } from "@/lib/logger";
import { ALLOWED_FORMATS, type UploadFolder, type UploadSignature } from "./schema";

const ROOT_FOLDER = "lamora";
const NOT_CONFIGURED =
  "Chưa cấu hình lưu ảnh (Cloudinary). Vui lòng liên hệ người hỗ trợ kỹ thuật.";

type Credentials = { cloudName: string; apiKey: string; apiSecret: string };

function readCredentials(): Credentials {
  const env = getEnv();
  if (!env.CLOUDINARY_CLOUD_NAME || !env.CLOUDINARY_API_KEY || !env.CLOUDINARY_API_SECRET) {
    throw new AppError("INTERNAL_ERROR", NOT_CONFIGURED);
  }
  return {
    cloudName: env.CLOUDINARY_CLOUD_NAME,
    apiKey: env.CLOUDINARY_API_KEY,
    apiSecret: env.CLOUDINARY_API_SECRET,
  };
}

/** Chữ ký Cloudinary: SHA-1 của "khóa=giá trị" xếp theo tên khóa, nối bằng &, cộng API secret. */
export function signParams(params: Record<string, string | number>, apiSecret: string): string {
  const toSign = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  return createHash("sha1")
    .update(toSign + apiSecret)
    .digest("hex");
}

/** Thư mục cố định của từng loại ảnh: lamora/products, lamora/categories… */
export function folderPath(folder: UploadFolder): string {
  return `${ROOT_FOLDER}/${folder}`;
}

/** publicId hợp lệ phải nằm trong thư mục của cửa hàng, để không xóa nhầm ảnh nơi khác. */
export function isShopPublicId(publicId: string, folder?: UploadFolder): boolean {
  const prefix = folder ? `${folderPath(folder)}/` : `${ROOT_FOLDER}/`;
  return publicId.startsWith(prefix) && !publicId.includes("..") && publicId.length > prefix.length;
}

/** Chữ ký để trình duyệt tự tải ảnh thẳng lên Cloudinary, không đi qua server. */
export function createUploadSignature(
  folder: UploadFolder,
  now: Date = new Date(),
): UploadSignature {
  const { cloudName, apiKey, apiSecret } = readCredentials();
  const timestamp = Math.floor(now.getTime() / 1000);
  const folderName = folderPath(folder);
  const signature = signParams(
    { allowed_formats: ALLOWED_FORMATS, folder: folderName, timestamp },
    apiSecret,
  );
  return {
    cloudName,
    apiKey,
    timestamp,
    folder: folderName,
    allowedFormats: ALLOWED_FORMATS,
    signature,
    uploadUrl: `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
  };
}

/**
 * Xóa ảnh trên Cloudinary. Làm hết sức: lỗi mạng hay chưa cấu hình chỉ ghi log,
 * không làm hỏng thao tác chính (xóa sản phẩm/ảnh trong database).
 */
export async function deleteImage(publicId: string): Promise<boolean> {
  if (!isShopPublicId(publicId)) {
    logger.warn("Bỏ qua xóa ảnh ngoài thư mục cửa hàng", { publicId });
    return false;
  }
  try {
    const { cloudName, apiKey, apiSecret } = readCredentials();
    const timestamp = Math.floor(Date.now() / 1000);
    const body = new URLSearchParams({
      public_id: publicId,
      timestamp: String(timestamp),
      api_key: apiKey,
      signature: signParams({ public_id: publicId, timestamp }, apiSecret),
    });
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
      method: "POST",
      body,
    });
    if (!response.ok) throw new Error(`Cloudinary trả về ${response.status}`);
    return true;
  } catch (error) {
    logger.error("Xóa ảnh trên Cloudinary thất bại", error, { publicId });
    return false;
  }
}
