import type { Metadata } from "next";
import { requireAdminPage } from "@/features/auth";
import { ProductEditor } from "@/features/product";
import { loadCategoryOptions } from "../category-options";

export const metadata: Metadata = { title: "Thêm sản phẩm" };

export default async function NewProductPage() {
  await requireAdminPage();
  const categories = await loadCategoryOptions();
  return <ProductEditor product={null} categories={categories} />;
}
