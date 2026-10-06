"use server";

import { updateTag } from "next/cache";
import { requireAdmin } from "@/features/auth";
import { ok, toErrorResult, type ActionResult } from "@/lib/result";
import {
  collectionInputSchema,
  deleteCollectionSchema,
  reorderCollectionsSchema,
  setCollectionProductsSchema,
  updateCollectionSchema,
} from "./schema";
import * as service from "./service";

const TAG = "collections";

export async function createCollection(input: unknown): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAdmin();
    const created = await service.createCollection(collectionInputSchema.parse(input));
    updateTag(TAG);
    return ok({ id: created.id });
  } catch (error) {
    return toErrorResult(error);
  }
}

export async function updateCollection(input: unknown): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAdmin();
    const { id, ...rest } = updateCollectionSchema.parse(input);
    const updated = await service.updateCollection(id, rest);
    updateTag(TAG);
    return ok({ id: updated.id });
  } catch (error) {
    return toErrorResult(error);
  }
}

export async function deleteCollection(input: unknown): Promise<ActionResult<null>> {
  try {
    await requireAdmin();
    await service.deleteCollection(deleteCollectionSchema.parse(input).id);
    updateTag(TAG);
    return ok(null);
  } catch (error) {
    return toErrorResult(error);
  }
}

export async function setCollectionProducts(input: unknown): Promise<ActionResult<null>> {
  try {
    await requireAdmin();
    const { collectionId, productIds } = setCollectionProductsSchema.parse(input);
    await service.setCollectionProducts(collectionId, productIds);
    updateTag(TAG);
    updateTag("products");
    return ok(null);
  } catch (error) {
    return toErrorResult(error);
  }
}

export async function reorderCollections(input: unknown): Promise<ActionResult<null>> {
  try {
    await requireAdmin();
    await service.reorderCollections(reorderCollectionsSchema.parse(input));
    updateTag(TAG);
    return ok(null);
  } catch (error) {
    return toErrorResult(error);
  }
}
