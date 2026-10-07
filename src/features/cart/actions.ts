"use server";

import { cloudinaryUrl } from "@/lib/cloudinary";
import { ok, toErrorResult, type ActionResult } from "@/lib/result";
import { validateCartSchema } from "./schema";
import type { CartValidation } from "./types";
import { validateCartItems } from "./validate-service";

const THUMB_WIDTH = 160;

/** 🌐 Đối chiếu giỏ hàng (lưu ở trình duyệt) với giá và tồn kho thật. Không tin bất cứ số tiền nào từ trình duyệt. */
export async function validateCart(input: unknown): Promise<ActionResult<CartValidation>> {
  try {
    const { items } = validateCartSchema.parse(input);
    const result = await validateCartItems(items);
    return ok({
      ...result,
      lines: result.lines.map(({ imagePublicId, ...line }) => ({
        ...line,
        imageUrl: imagePublicId ? cloudinaryUrl(imagePublicId, { width: THUMB_WIDTH }) : null,
      })),
    });
  } catch (error) {
    return toErrorResult(error);
  }
}
