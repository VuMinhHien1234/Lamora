import type { UploadSignature, UploadedImage } from "../types";
import { MAX_SIDE_PX, MAX_UPLOAD_BYTES, fitWithin, needsCompression } from "./upload-rules";

const QUALITY_STEPS = [0.85, 0.7, 0.55];

function loadBitmap(file: File): Promise<ImageBitmap> {
  return createImageBitmap(file);
}

function toBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, "image/webp", quality));
}

/** Ảnh trên 5 MB: thu nhỏ về tối đa 2400px và nén WebP cho tới khi dưới 5 MB. */
export async function compressIfNeeded(file: File): Promise<File> {
  if (!needsCompression(file)) return file;
  const bitmap = await loadBitmap(file);
  const { width, height } = fitWithin(bitmap.width, bitmap.height, MAX_SIDE_PX);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, width, height);
  for (const quality of QUALITY_STEPS) {
    const blob = await toBlob(canvas, quality);
    if (blob && blob.size <= MAX_UPLOAD_BYTES) {
      return new File([blob], file.name.replace(/\.\w+$/, ".webp"), { type: "image/webp" });
    }
  }
  throw new Error("Không nén được ảnh xuống dưới 5 MB, hãy chọn ảnh khác.");
}

function readResult(text: string): UploadedImage {
  const data = JSON.parse(text) as {
    public_id?: unknown;
    width?: unknown;
    height?: unknown;
    secure_url?: unknown;
  };
  if (
    typeof data.public_id !== "string" ||
    typeof data.width !== "number" ||
    typeof data.height !== "number"
  ) {
    throw new Error("Cloudinary trả về dữ liệu không như mong đợi.");
  }
  const previewUrl =
    typeof data.secure_url === "string"
      ? data.secure_url.replace("/upload/", "/upload/f_auto,q_auto,w_240/")
      : undefined;
  return { publicId: data.public_id, width: data.width, height: data.height, previewUrl };
}

/** Tải ảnh thẳng lên Cloudinary (có thanh tiến trình). Dùng XMLHttpRequest vì fetch chưa báo tiến trình tải lên. */
export function uploadToCloudinary(
  file: File,
  signature: UploadSignature,
  onProgress: (percent: number) => void,
): Promise<UploadedImage> {
  return new Promise((resolve, reject) => {
    const form = new FormData();
    form.append("file", file);
    form.append("api_key", signature.apiKey);
    form.append("timestamp", String(signature.timestamp));
    form.append("signature", signature.signature);
    form.append("folder", signature.folder);
    form.append("allowed_formats", signature.allowedFormats);
    const request = new XMLHttpRequest();
    request.open("POST", signature.uploadUrl);
    request.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress(Math.round((event.loaded / event.total) * 100));
    };
    request.onerror = () => reject(new Error("Mất kết nối khi tải ảnh, vui lòng thử lại."));
    request.onload = () => {
      if (request.status < 200 || request.status >= 300) {
        reject(new Error("Cloudinary từ chối ảnh này, hãy thử ảnh khác."));
        return;
      }
      try {
        resolve(readResult(request.responseText));
      } catch (error) {
        reject(error instanceof Error ? error : new Error("Không đọc được kết quả tải ảnh."));
      }
    };
    request.send(form);
  });
}
