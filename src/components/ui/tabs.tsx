"use client";

import { useId, useState, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type TabItem = { id: string; label: string; content: ReactNode };

function nextIndex(key: string, current: number, count: number): number | null {
  if (key === "ArrowRight") return (current + 1) % count;
  if (key === "ArrowLeft") return (current - 1 + count) % count;
  if (key === "Home") return 0;
  if (key === "End") return count - 1;
  return null;
}

type TabButtonProps = { baseId: string; item: TabItem; active: boolean; onSelect: () => void };

function TabButton({ baseId, item, active, onSelect }: TabButtonProps) {
  return (
    <button
      id={`${baseId}-tab-${item.id}`}
      role="tab"
      type="button"
      aria-selected={active}
      aria-controls={`${baseId}-panel-${item.id}`}
      tabIndex={active ? 0 : -1}
      onClick={onSelect}
      className={cn(
        "type-eyebrow -mb-px min-h-11 border-b py-3 transition-colors duration-300",
        active
          ? "border-ink-900 text-ink-900"
          : "border-transparent text-stone-500 hover:text-ink-900",
      )}
    >
      {item.label}
    </button>
  );
}

export function Tabs({ items }: { items: TabItem[] }) {
  const baseId = useId();
  const [activeId, setActiveId] = useState(items[0]?.id);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    const current = items.findIndex((item) => item.id === activeId);
    const target = nextIndex(event.key, current, items.length);
    const next = target === null ? undefined : items[target];
    if (!next) return;
    event.preventDefault();
    setActiveId(next.id);
    document.getElementById(`${baseId}-tab-${next.id}`)?.focus();
  }

  return (
    <div>
      <div role="tablist" onKeyDown={onKeyDown} className="flex gap-8 border-b border-sand-200">
        {items.map((item) => (
          <TabButton
            key={item.id}
            baseId={baseId}
            item={item}
            active={item.id === activeId}
            onSelect={() => setActiveId(item.id)}
          />
        ))}
      </div>
      {items.map((item) => (
        <div
          key={item.id}
          id={`${baseId}-panel-${item.id}`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${item.id}`}
          hidden={item.id !== activeId}
          className="pt-6"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}
