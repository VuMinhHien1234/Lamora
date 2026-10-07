import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdminPage } from "@/features/auth";
import { adminGetOrder, OrderDetailView } from "@/features/order";
import { listProvinces } from "@/features/shipping";
import { isAppError } from "@/lib/errors";

export const metadata: Metadata = { title: "Chi tiết đơn hàng" };

type PageProps = { params: Promise<{ id: string }> };

// M4 — Chi tiết đơn hàng (docs/06 mục 6).
export default async function OrderDetailPage({ params }: PageProps) {
  await requireAdminPage();
  const { id } = await params;
  const order = await adminGetOrder(id).catch((error: unknown) => {
    if (isAppError(error) && error.code === "NOT_FOUND") return null;
    throw error;
  });
  if (!order) notFound();
  return <OrderDetailView order={order} provinces={listProvinces()} />;
}
