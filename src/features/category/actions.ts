"use server";

import { updateTag } from "next/cache";
import { requireAdmin } from "@/features/auth";
import { ok, toErrorResult, type ActionResult } from "@/lib/result";
import {
  categoryInputSchema,
  deleteCategorySchema,
  reorderCategoriesSchema,
  updateCategorySchema,
} from "./schema";
import * as service from "./service";

const TAG = "categories";

export async function createCategory(input: unknown): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAdmin();
    const created = await service.createCategory(categoryInputSchema.parse(input));
    updateTag(TAG);
    return ok({ id: created.id });
  } catch (error) {
    return toErrorResult(error);
  }
}

export async function updateCategory(input: unknown): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAdmin();
    const { id, ...rest } = updateCategorySchema.parse(input);
    const updated = await service.updateCategory(id, rest);
    updateTag(TAG);
    return ok({ id: updated.id });
  } catch (error) {
    return toErrorResult(error);
  }
}

export async function reorderCategories(input: unknown): Promise<ActionResult<null>> {
  try {
    await requireAdmin();
    await service.reorderCategories(reorderCategoriesSchema.parse(input));
    updateTag(TAG);
    return ok(null);
  } catch (error) {
    return toErrorResult(error);
  }
}

export async function deleteCategory(input: unknown): Promise<ActionResult<null>> {
  try {
    await requireAdmin();
    await service.deleteCategory(deleteCategorySchema.parse(input).id);
    updateTag(TAG);
    return ok(null);
  } catch (error) {
    return toErrorResult(error);
  }
}
