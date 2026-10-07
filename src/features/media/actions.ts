"use server";

import { requireAdmin } from "@/features/auth";
import { ok, toErrorResult, type ActionResult } from "@/lib/result";
import { uploadSignatureSchema, type UploadSignature } from "./schema";
import { createUploadSignature } from "./service";

/** 🔐 Chữ ký upload Cloudinary cho một loại ảnh (docs/04 mục 5b). */
export async function getImageUploadSignature(
  input: unknown,
): Promise<ActionResult<UploadSignature>> {
  try {
    await requireAdmin();
    const { folder } = uploadSignatureSchema.parse(input);
    return ok(createUploadSignature(folder));
  } catch (error) {
    return toErrorResult(error);
  }
}
