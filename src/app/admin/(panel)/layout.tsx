import type { ReactNode } from "react";
import { requireAdminPage } from "@/features/auth";
import { AdminShell } from "@/components/layout/admin-shell";

export default async function AdminPanelLayout({ children }: { children: ReactNode }) {
  const admin = await requireAdminPage();
  return <AdminShell adminName={admin.name}>{children}</AdminShell>;
}
