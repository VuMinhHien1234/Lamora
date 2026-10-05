import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/layout/admin-page-header";
import { requireAdminPage } from "@/features/auth";
import { KitAdmin } from "./kit-admin";
import { KitButtons } from "./kit-buttons";
import { KitColors } from "./kit-colors";
import { KitCommerce } from "./kit-commerce";
import { KitContent } from "./kit-content";
import { KitForms } from "./kit-forms";
import { KitOverlays } from "./kit-overlays";
import { KitTypography } from "./kit-typography";

export const metadata: Metadata = { title: "Bộ component" };

// Trang duyệt giao diện (docs/03 mục 12): chủ shop xem trên điện thoại và máy tính trước khi dựng các trang.
export default async function UiKitPage() {
  await requireAdminPage();
  return (
    <>
      <AdminPageHeader
        title="Bộ component"
        description="Duyệt màu, chữ và các thành phần giao diện trước khi dựng trang."
      />
      <div className="flex flex-col gap-8">
        <KitColors />
        <KitTypography />
        <KitButtons />
        <KitForms />
        <KitCommerce />
        <KitContent />
        <KitOverlays />
        <KitAdmin />
      </div>
    </>
  );
}
