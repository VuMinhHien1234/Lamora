import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdminPage } from "@/features/auth";
import { adminGetProduct, ProductEditor, type ProductDetail } from "@/features/product";
import { isAppError } from "@/lib/errors";
import { loadCategoryOptions } from "../category-options";

export const metadata: Metadata = { title: "Sửa sản phẩm" };

type PageProps = { params: Promise<{ id: string }> };

async function loadProduct(id: string): Promise<ProductDetail> {
  try {
    return await adminGetProduct(id);
  } catch (error) {
    if (isAppError(error) && error.code === "NOT_FOUND") notFound();
    throw error;
  }
}

export default async function EditProductPage({ params }: PageProps) {
  await requireAdminPage();
  const { id } = await params;
  const [product, categories] = await Promise.all([loadProduct(id), loadCategoryOptions()]);
  // Đổi key để form dựng lại khi trạng thái hoặc danh sách biến thể (id mới) thay đổi sau khi lưu.
  const formKey = `${product.status}:${product.variants.map((variant) => variant.id).join(",")}`;
  return <ProductEditor key={formKey} product={product} categories={categories} />;
}
