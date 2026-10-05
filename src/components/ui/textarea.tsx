"use client";

import { useId, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { CONTROL_CLASS, FieldShell, describedBy, type FieldProps } from "./field";

type TextareaProps = FieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({
  label,
  hint,
  error,
  required,
  id,
  className,
  rows = 4,
  ...rest
}: TextareaProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  return (
    <FieldShell id={inputId} label={label} required={required} hint={hint} error={error}>
      <textarea
        {...rest}
        id={inputId}
        rows={rows}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(inputId, hint, error)}
        className={cn(CONTROL_CLASS, "py-3", className)}
      />
    </FieldShell>
  );
}
