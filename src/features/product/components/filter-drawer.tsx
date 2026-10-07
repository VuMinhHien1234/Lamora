"use client";

import { SlidersHorizontal } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Drawer } from "@/components/ui/drawer";

/** Nút "Bộ lọc" + bảng trượt từ dưới lên trên điện thoại; trên máy tính bộ lọc nằm ở cột bên. */
export function FilterDrawer({ count, children }: { count: number; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="type-eyebrow flex min-h-11 items-center gap-2 border border-sand-300 px-4 lg:hidden"
      >
        <SlidersHorizontal aria-hidden strokeWidth={1.25} className="size-4" />
        Bộ lọc{count > 0 ? ` (${count})` : ""}
      </button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title="Bộ lọc"
        side="bottom"
        className="overflow-y-auto px-5 py-4"
      >
        {children}
      </Drawer>
    </>
  );
}
