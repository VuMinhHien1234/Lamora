import type { ReactNode } from "react";

type KitSectionProps = { id: string; title: string; note?: string; children: ReactNode };

export function KitSection({ id, title, note, children }: KitSectionProps) {
  return (
    <section id={id} className="scroll-mt-20 border border-sand-200 bg-ivory-50 p-5 lg:p-8">
      <h2 className="type-h3">{title}</h2>
      {note && <p className="type-small mt-1 text-stone-500">{note}</p>}
      <div className="mt-6 flex flex-col gap-8">{children}</div>
    </section>
  );
}

export function KitRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="type-eyebrow mb-3 text-stone-500">{label}</p>
      <div className="flex flex-wrap items-center gap-4">{children}</div>
    </div>
  );
}
