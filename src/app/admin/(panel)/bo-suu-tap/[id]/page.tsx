import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdminPage } from "@/features/auth";
import { adminGetCollection, CollectionEditor, type CollectionDetail } from "@/features/collection";
import { adminListProductOptions } from "@/features/product";
import { isAppError } from "@/lib/errors";

export const metadata: Metadata = { title: "Sửa bộ sưu tập" };

type PageProps = { params: Promise<{ id: string }> };

async function loadCollection(id: string): Promise<CollectionDetail> {
  try {
    return await adminGetCollection(id);
  } catch (error) {
    if (isAppError(error) && error.code === "NOT_FOUND") notFound();
    throw error;
  }
}

export default async function EditCollectionPage({ params }: PageProps) {
  await requireAdminPage();
  const { id } = await params;
  const [collection, products] = await Promise.all([loadCollection(id), adminListProductOptions()]);
  // Dựng lại khi danh sách sản phẩm đã lưu đổi, để ô chọn lấy đúng dữ liệu mới.
  const key = collection.products.map((p) => p.id).join(",");
  return <CollectionEditor key={key} collection={collection} products={products} />;
}
