import Link from "next/link";
import { Fragment } from "react";

export type BreadcrumbItem = { label: string; href?: string };

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Đường dẫn" className="type-small text-stone-500">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <Fragment key={`${item.label}-${index}`}>
              <li aria-current={isLast ? "page" : undefined}>
                {item.href && !isLast ? (
                  <Link href={item.href} className="hover:text-rose-700">
                    {item.label}
                  </Link>
                ) : (
                  <span className={isLast ? "text-ink-900" : undefined}>{item.label}</span>
                )}
              </li>
              {!isLast && <li aria-hidden>/</li>}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
