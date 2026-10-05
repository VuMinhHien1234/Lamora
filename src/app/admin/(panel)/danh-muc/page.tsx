import type { Metadata } from "next";
import { requireAdminPage } from "@/features/auth";
import { adminListCategories, CategoryManager } from "@/features/category";

export const metadata: Metadata = { title: "Danh mục" };

export default async function CategoriesPage() {
  await requireAdminPage();
  const tree = await adminListCategories();
  return <CategoryManager tree={tree} />;
}
