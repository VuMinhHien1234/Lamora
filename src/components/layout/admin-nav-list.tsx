"use client";

import { ExternalLink, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ADMIN_NAV, type AdminNavItem } from "@/config/admin-nav";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const ITEM_CLASS = "flex min-h-11 items-center justify-between border-l-2 px-5 text-[0.9375rem]";
const MUTED_LINK =
  "border-transparent text-ivory-50/80 transition-colors duration-300 hover:text-ivory-50";

function isActive(pathname: string, href: string): boolean {
  return href === "/admin"
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);
}

type NavItemProps = { item: AdminNavItem; active: boolean; onNavigate?: () => void };

function NavItem({ item, active, onNavigate }: NavItemProps) {
  if (!item.ready) {
    return (
      <span aria-disabled className={cn(ITEM_CLASS, "border-transparent text-ivory-50/40")}>
        {item.label}
        <span className="type-small">Sắp có</span>
      </span>
    );
  }
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(ITEM_CLASS, active ? "border-gold-500 text-ivory-50" : MUTED_LINK)}
    >
      {item.label}
    </Link>
  );
}

function NavFooter() {
  const router = useRouter();

  async function logout(): Promise<void> {
    await authClient.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <div className="mt-auto flex flex-col border-t border-ivory-50/15 pt-3">
      <Link href="/" target="_blank" className={cn(ITEM_CLASS, MUTED_LINK)}>
        Xem website
        <ExternalLink aria-hidden strokeWidth={1.25} className="size-4" />
      </Link>
      <button
        type="button"
        onClick={logout}
        className={cn(ITEM_CLASS, MUTED_LINK, "w-full text-left")}
      >
        Đăng xuất
        <LogOut aria-hidden strokeWidth={1.25} className="size-4" />
      </button>
    </div>
  );
}

/** Danh sách mục menu quản trị, dùng cho cả thanh bên (máy tính) và menu trượt (điện thoại). */
export function AdminNavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Menu quản trị" className="flex flex-1 flex-col">
      <ul className="flex flex-col">
        {ADMIN_NAV.map((item) => (
          <li key={item.href}>
            <NavItem item={item} active={isActive(pathname, item.href)} onNavigate={onNavigate} />
          </li>
        ))}
      </ul>
      <NavFooter />
    </nav>
  );
}
