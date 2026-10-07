import type { Metadata } from "next";
import type { ReactNode } from "react";

// Trang quản trị không cho công cụ tìm kiếm lập chỉ mục (docs/06).
export const metadata: Metadata = {
  title: { default: "Quản trị", template: "%s · Quản trị Lamora" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return children;
}
