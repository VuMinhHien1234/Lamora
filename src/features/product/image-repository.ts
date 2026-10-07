import { db } from "@/lib/db";
import type { ProductImageRecord } from "./types";

export type NewImageRow = {
  publicId: string;
  alt: string;
  width: number;
  height: number;
  variantId: string | null;
  sortOrder: number;
};

export type ImageUpdateRow = {
  id: string;
  alt: string;
  sortOrder: number;
  variantId: string | null;
};

export function findImages(productId: string): Promise<ProductImageRecord[]> {
  return db.productImage.findMany({ where: { productId }, orderBy: { sortOrder: "asc" } });
}

export async function findVariantIds(productId: string): Promise<string[]> {
  const rows = await db.productVariant.findMany({ where: { productId }, select: { id: true } });
  return rows.map((row) => row.id);
}

export async function insertImages(productId: string, rows: NewImageRow[]): Promise<void> {
  await db.productImage.createMany({ data: rows.map((row) => ({ ...row, productId })) });
}

export async function applyImageChanges(
  productId: string,
  updates: ImageUpdateRow[],
  deleteIds: string[],
): Promise<void> {
  await db.$transaction([
    db.productImage.deleteMany({ where: { productId, id: { in: deleteIds } } }),
    ...updates.map((row) =>
      db.productImage.update({
        where: { id: row.id },
        data: { alt: row.alt, sortOrder: row.sortOrder, variantId: row.variantId },
      }),
    ),
  ]);
}
