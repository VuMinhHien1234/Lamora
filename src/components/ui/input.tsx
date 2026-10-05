"use client";

import { useId, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { CONTROL_CLASS, FieldShell, describedBy, type FieldProps } from "./field";

type InputProps = FieldProps & InputHTMLAttributes<HTMLInputElement>;

export function Input({ label, hint, error, required, id, className, ...rest }: InputProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  return (
    <FieldShell id={inputId} label={label} required={required} hint={hint} error={error}>
      <input
        {...rest}
        id={inputId}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(inputId, hint, error)}
        className={cn(CONTROL_CLASS, "h-12", className)}
      />
    </FieldShell>
  );
}
