"use client";

import { Menu } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Drawer } from "@/components/ui/drawer";
import { AdminNavList } from "./admin-nav-list";
import { Logo } from "./logo";

type AdminShellProps = { adminName: string; children: ReactNode };

/** Khung quản trị (M0): thanh bên 240px trên máy tính, menu trượt trên điện thoại. */
export function AdminShell({ adminName, children }: AdminShellProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="min-h-dvh bg-ivory-100 lg:grid lg:grid-cols-[15rem_1fr]">
      <aside className="sticky top-0 hidden h-dvh flex-col bg-ink-900 py-6 lg:flex">
        <div className="mb-8 px-5">
          <Logo tone="light" />
          <p className="type-small mt-3 text-ivory-50/60">Quản trị · {adminName}</p>
        </div>
        <AdminNavList />
      </aside>

      <div className="flex min-w-0 flex-col">
        <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-sand-200 bg-ivory-50 px-2 lg:hidden">
          <button
            type="button"
            aria-label="Mở menu"
            onClick={() => setMenuOpen(true)}
            className="grid size-11 place-items-center"
          >
            <Menu aria-hidden strokeWidth={1.25} className="size-5" />
          </button>
          <Logo />
          <span className="size-11" aria-hidden />
        </div>
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 lg:px-8 lg:py-10">
          {children}
        </main>
      </div>

      <Drawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        title="Menu quản trị"
        side="left"
        className="bg-ink-900 py-4"
      >
        <AdminNavList onNavigate={() => setMenuOpen(false)} />
      </Drawer>
    </div>
  );
}
