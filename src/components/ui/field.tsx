import type { ReactNode } from "react";

type FieldShellProps = {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
};

/** Khung chung của ô nhập: nhãn phía trên, gợi ý, dòng lỗi (docs/03 mục 7.2). */
export function FieldShell({ id, label, required, hint, error, children }: FieldShellProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="type-small font-medium text-ink-900">
        {label}
        {required && (
          <span aria-hidden className="ml-0.5 text-rose-700">
            *
          </span>
        )}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="type-small text-stone-500">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="type-small text-error-700">
          {error}
        </p>
      )}
    </div>
  );
}

export const CONTROL_CLASS =
  "w-full rounded-xs border border-sand-200 bg-ivory-50 px-4 text-ink-900 placeholder:text-stone-500 transition-colors duration-300 hover:border-sand-300 focus:border-ink-900 disabled:bg-sand-200 disabled:text-stone-500 aria-[invalid=true]:border-error-700";

export type FieldProps = {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
};

export function describedBy(id: string, hint?: string, error?: string): string | undefined {
  if (error) return `${id}-error`;
  return hint ? `${id}-hint` : undefined;
}
