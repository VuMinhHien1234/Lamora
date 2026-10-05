"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

type SwitchProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Nhãn hiển thị bên cạnh công tắc; nếu ẩn nhãn thì phải truyền `ariaLabel`. */
  label?: string;
  ariaLabel?: string;
  disabled?: boolean;
  className?: string;
};

/** Công tắc bật/tắt. Vuông góc bo 2px theo quy tắc không bo tròn (docs/03 mục 7.3). */
export function Switch({ checked, onChange, label, ariaLabel, disabled, className }: SwitchProps) {
  const labelId = useId();
  return (
    <span className={cn("inline-flex min-h-11 items-center gap-3", className)}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={label ? labelId : undefined}
        aria-label={label ? undefined : ariaLabel}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-xs border transition-colors duration-300 disabled:opacity-40",
          checked ? "border-ink-900 bg-ink-900" : "border-sand-300 bg-sand-200",
        )}
      >
        <span
          aria-hidden
          className={cn(
            "absolute top-0.5 left-0 size-4 rounded-xs bg-ivory-50 transition-transform duration-300",
            checked ? "translate-x-6" : "translate-x-0.5",
          )}
        />
      </button>
      {label && (
        <span id={labelId} className="type-body">
          {label}
        </span>
      )}
    </span>
  );
}
