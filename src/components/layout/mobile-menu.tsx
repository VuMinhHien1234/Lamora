"use client";

import Link from "next/link";
import { Drawer } from "@/components/ui/drawer";
import { FOOTER_ABOUT_LINKS, FOOTER_SUPPORT_LINKS, MAIN_NAV, type NavLink } from "@/config/site";

type MobileMenuProps = { open: boolean; onClose: () => void };

function LinkGroup({
  links,
  large,
  onClose,
}: {
  links: NavLink[];
  large?: boolean;
  onClose: () => void;
}) {
  return (
    <ul className="flex flex-col">
      {links.map((link) => (
        <li key={`${link.label}-${link.href}`}>
          <Link
            href={link.href}
            onClick={onClose}
            className={
              large
                ? "type-h3 flex min-h-14 items-center"
                : "type-body flex min-h-11 items-center text-stone-500"
            }
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** Menu trượt từ trái trên điện thoại (docs/05 mục 2). */
export function MobileMenu({ open, onClose }: MobileMenuProps) {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Menu"
      side="left"
      className="flex flex-col gap-6 px-5 py-4"
    >
      <LinkGroup links={MAIN_NAV} large onClose={onClose} />
      <hr className="border-t border-sand-200" />
      <LinkGroup links={[...FOOTER_SUPPORT_LINKS, ...FOOTER_ABOUT_LINKS]} onClose={onClose} />
    </Drawer>
  );
}
