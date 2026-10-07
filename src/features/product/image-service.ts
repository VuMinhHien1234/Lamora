import { deleteImage, isShopPublicId } from "@/features/media";
import { AppError } from "@/lib/errors";
import * as imageRepo from "./image-repository";
import { MAX_PRODUCT_IMAGES } from "./image-schema";
import type { SaveProductImagesInput, UpdateProductImagesInput } from "./image-schema";
import * as repo from "./repository";

type ImageInput = SaveProductImagesInput["images"][number];

function invalid(message: string): AppError {
  return new AppError("VALIDATION_ERROR", message);
}

function checkNewImages(images: ImageInput[], variantIds: string[]): void {
  for (const image of images) {
    if (!isShopPublicId(image.publicId, "products")) {
      throw invalid("Ảnh không hợp lệ, vui lòng tải lại ảnh.");
    }
    if (image.variantId !== undefined && !variantIds.includes(image.variantId)) {
      throw invalid("Biến thể gắn với ảnh không còn tồn tại.");
    }
  }
}

export async function saveProductImages(input: SaveProductImagesInput): Promise<void> {
  const product = await repo.findRecord(input.productId);
  if (!product) throw new AppError("NOT_FOUND", "Không tìm thấy sản phẩm.");
  const existing = await imageRepo.findImages(input.productId);
  if (existing.length + input.images.length > MAX_PRODUCT_IMAGES) {
    throw invalid(`Tối đa ${MAX_PRODUCT_IMAGES} ảnh mỗi sản phẩm.`);
  }
  checkNewImages(input.images, await imageRepo.findVariantIds(input.productId));
  const start = existing.reduce((max, image) => Math.max(max, image.sortOrder + 1), 0);
  await imageRepo.insertImages(
    input.productId,
    input.images.map((image, index) => ({
      publicId: image.publicId,
      alt: image.alt === "" ? product.name : image.alt,
      width: image.width,
      height: image.height,
      variantId: image.variantId ?? null,
      sortOrder: start + index,
    })),
  );
}

export async function updateProductImages(input: UpdateProductImagesInput): Promise<void> {
  const product = await repo.findRecord(input.productId);
  if (!product) throw new AppError("NOT_FOUND", "Không tìm thấy sản phẩm.");
  const existing = await imageRepo.findImages(input.productId);
  const known = new Map(existing.map((image) => [image.id, image]));
  const deleteIds = [...new Set(input.deleteIds)];
  const touched = [...input.images.map((image) => image.id), ...deleteIds];
  if (touched.some((id) => !known.has(id))) {
    throw new AppError("NOT_FOUND", "Có ảnh không còn tồn tại, vui lòng tải lại trang.");
  }
  if (product.status === "ACTIVE" && deleteIds.length >= existing.length) {
    throw new AppError("PRODUCT_NOT_READY", "Sản phẩm đang bán cần ít nhất 1 ảnh.");
  }
  const variantIds = await imageRepo.findVariantIds(input.productId);
  const updates = input.images.filter((image) => !deleteIds.includes(image.id));
  if (updates.some((image) => image.variantId !== null && !variantIds.includes(image.variantId))) {
    throw invalid("Biến thể gắn với ảnh không còn tồn tại.");
  }
  await imageRepo.applyImageChanges(
    input.productId,
    updates.map((image) => ({
      ...image,
      alt: image.alt === "" ? product.name : image.alt,
    })),
    deleteIds,
  );
  await Promise.all(deleteIds.map((id) => deleteImage(known.get(id)?.publicId ?? "")));
}
