import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type SizeOptionProps = ButtonHTMLAttributes<HTMLButtonElement> & { selected?: boolean };

export function SizeOption({ selected, disabled, className, children, ...rest }: SizeOptionProps) {
  return (
    <button
      type="button"
      {...rest}
      disabled={disabled}
      aria-pressed={selected}
      className={cn(
        "type-small min-h-11 min-w-11 border px-4 transition-colors duration-300",
        selected
          ? "border-ink-900 shadow-[inset_0_0_0_0.5px_var(--color-ink-900)]"
          : "border-sand-200 hover:border-sand-300",
        disabled && "text-stone-500 line-through opacity-60",
        className,
      )}
    >
      {children}
    </button>
  );
}
