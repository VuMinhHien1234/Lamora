"use client";

import { ChevronDown } from "lucide-react";
import { useId, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { CONTROL_CLASS, FieldShell, describedBy, type FieldProps } from "./field";

type SelectProps = FieldProps & SelectHTMLAttributes<HTMLSelectElement>;

export function Select({
  label,
  hint,
  error,
  required,
  id,
  className,
  children,
  ...rest
}: SelectProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  return (
    <FieldShell id={inputId} label={label} required={required} hint={hint} error={error}>
      <div className="relative">
        <select
          {...rest}
          id={inputId}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(inputId, hint, error)}
          className={cn(CONTROL_CLASS, "h-12 appearance-none pr-11", className)}
        >
          {children}
        </select>
        <ChevronDown
          aria-hidden
          strokeWidth={1.25}
          className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 text-ink-900"
        />
      </div>
    </FieldShell>
  );
}
