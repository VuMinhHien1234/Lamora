import { Minus, Plus } from "lucide-react";
import type { ReactNode } from "react";

export function Accordion({ children }: { children: ReactNode }) {
  return <div className="divide-y divide-sand-200 border-y border-sand-200">{children}</div>;
}

type AccordionItemProps = { title: string; defaultOpen?: boolean; children: ReactNode };

/** Dùng thẻ <details> có sẵn của trình duyệt: bấm bàn phím được, không cần JavaScript. */
export function AccordionItem({ title, defaultOpen, children }: AccordionItemProps) {
  return (
    <details open={defaultOpen} className="group">
      <summary className="type-eyebrow flex min-h-14 list-none items-center justify-between gap-4 py-4 [&::-webkit-details-marker]:hidden">
        {title}
        <Plus aria-hidden strokeWidth={1.25} className="size-5 shrink-0 group-open:hidden" />
        <Minus aria-hidden strokeWidth={1.25} className="hidden size-5 shrink-0 group-open:block" />
      </summary>
      <div className="type-body pb-6 text-stone-500">{children}</div>
    </details>
  );
}
