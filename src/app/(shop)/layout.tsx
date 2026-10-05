import type { ReactNode } from "react";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { ChatFloatingButtons } from "@/components/layout/chat-buttons";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

// Khung chung của web khách (S0, docs/05 mục 2).
export default function ShopLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AnnouncementBar />
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
      <ChatFloatingButtons />
    </>
  );
}
