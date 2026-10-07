import type { Metadata } from "next";
import { requireAdminPage } from "@/features/auth";
import { adminListCollections, CollectionManager } from "@/features/collection";

export const metadata: Metadata = { title: "Bộ sưu tập" };

export default async function CollectionsPage() {
  await requireAdminPage();
  const collections = await adminListCollections();
  return <CollectionManager collections={collections} />;
}
