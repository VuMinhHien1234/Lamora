"use client";

import { Menu, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MAIN_NAV } from "@/config/site";
import { cn } from "@/lib/utils";
import { CartButton } from "./cart-button";
import { Logo } from "./logo";
import { MobileMenu } from "./mobile-menu";

const SCROLL_THRESHOLD_PX = 8;

function useScrolled(): boolean {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = (): void => setScrolled(window.scrollY > SCROLL_THRESHOLD_PX);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return scrolled;
}

/** Header dính: logo ở giữa, menu bên trái, tìm kiếm + giỏ bên phải. Cao 88px → 64px khi cuộn (máy tính). */
export function SiteHeader() {
  const scrolled = useScrolled();
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b bg-ivory-50 transition-colors duration-300",
        scrolled ? "border-sand-200" : "border-transparent",
      )}
    >
      <div
        className={cn(
          "page-container grid grid-cols-[1fr_auto_1fr] items-center transition-[height] duration-300 ease-soft",
          scrolled ? "h-14 md:h-16" : "h-14 md:h-22",
        )}
      >
        <div className="flex items-center">
          <button
            type="button"
            aria-label="Mở menu"
            onClick={() => setMenuOpen(true)}
            className="-ml-3 grid size-11 place-items-center md:hidden"
          >
            <Menu aria-hidden strokeWidth={1.25} className="size-5" />
          </button>
          <nav aria-label="Menu chính" className="hidden items-center gap-8 md:flex">
            {MAIN_NAV.map((link) => (
              <Link key={link.label} href={link.href} className="type-eyebrow link-underline py-1">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <Link href="/" aria-label="Lamora Flower — trang chủ">
          <Logo />
        </Link>
        <div className="-mr-3 flex items-center justify-end">
          <Link href="/tim-kiem" aria-label="Tìm kiếm" className="grid size-11 place-items-center">
            <Search aria-hidden strokeWidth={1.25} className="size-5 md:size-[22px]" />
          </Link>
          <CartButton />
        </div>
      </div>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
