"use server";

import { updateTag } from "next/cache";
import { requireAdmin } from "@/features/auth";
import { ok, toErrorResult, type ActionResult } from "@/lib/result";
import {
  createProductSchema,
  setProductStatusSchema,
  updateProductSchema,
  upsertVariantsSchema,
} from "./schema";
import * as service from "./service";
import type { ProductStatus } from "./types";

function refresh(productId: string): void {
  updateTag("products");
  updateTag(`product:${productId}`);
}

export async function createProduct(input: unknown): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAdmin();
    const created = await service.createProduct(createProductSchema.parse(input));
    refresh(created.id);
    return ok({ id: created.id });
  } catch (error) {
    return toErrorResult(error);
  }
}

export async function updateProduct(input: unknown): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAdmin();
    const { id, ...fields } = updateProductSchema.parse(input);
    await service.updateProduct(id, fields);
    refresh(id);
    return ok({ id });
  } catch (error) {
    return toErrorResult(error);
  }
}

export async function upsertVariants(input: unknown): Promise<ActionResult<null>> {
  try {
    await requireAdmin();
    const { productId, variants } = upsertVariantsSchema.parse(input);
    await service.upsertVariants(productId, variants);
    refresh(productId);
    return ok(null);
  } catch (error) {
    return toErrorResult(error);
  }
}

export async function setProductStatus(
  input: unknown,
): Promise<ActionResult<{ status: ProductStatus }>> {
  try {
    await requireAdmin();
    const { id, status } = setProductStatusSchema.parse(input);
    const updated = await service.setProductStatus(id, status as ProductStatus);
    refresh(id);
    return ok({ status: updated.status });
  } catch (error) {
    return toErrorResult(error);
  }
}
