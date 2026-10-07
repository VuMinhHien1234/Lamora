import type { ReactNode } from "react";
// import { AnnouncementBar } from "@/components/layout/announcement-bar"; // Tạm tắt dải "Miễn phí giao hàng"
import { ChatFloatingButtons } from "@/components/layout/chat-buttons";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { MAIN_NAV, type NavLink } from "@/config/site";
import { MiniCartDrawer } from "@/features/cart";
import { listActiveCategories } from "@/features/category";
import { logger } from "@/lib/logger";

const MAX_MENU_CATEGORIES = 5;

/** Menu chính: "Tất cả sản phẩm" + các danh mục cấp 1 đang bật. Lỗi đọc database thì dùng menu dự phòng. */
async function loadNavLinks(): Promise<NavLink[]> {
  try {
    const categories = await listActiveCategories();
    const links = categories
      .slice(0, MAX_MENU_CATEGORIES)
      .map((category) => ({ label: category.name, href: `/danh-muc/${category.slug}` }));
    return [...MAIN_NAV, ...links];
  } catch (error) {
    logger.error("shop.layout.categories", error);
    return MAIN_NAV;
  }
}

// Khung chung của web khách (S0, docs/05 mục 2).
export default async function ShopLayout({ children }: { children: ReactNode }) {
  const navLinks = await loadNavLinks();
  return (
    <>
      {/* <AnnouncementBar /> — tạm tắt, bỏ comment để bật lại */}
      <SiteHeader navLinks={navLinks} />
      <main>{children}</main>
      <SiteFooter />
      <ChatFloatingButtons />
      <MiniCartDrawer />
    </>
  );
}
