import type { Metadata } from "next";
import { requireAdminPage } from "@/features/auth";
import { CollectionEditor } from "@/features/collection";

export const metadata: Metadata = { title: "Thêm bộ sưu tập" };

export default async function NewCollectionPage() {
  await requireAdminPage();
  return <CollectionEditor collection={null} products={[]} />;
}
