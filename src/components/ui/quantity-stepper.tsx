"use client";

import { Minus, Plus } from "lucide-react";

type QuantityStepperProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label?: string;
};

const STEP_BUTTON =
  "grid size-11 place-items-center transition-colors duration-300 hover:bg-ivory-100 disabled:text-stone-500 disabled:opacity-50 disabled:hover:bg-transparent";

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  label = "Số lượng",
}: QuantityStepperProps) {
  return (
    <div
      role="group"
      aria-label={label}
      className="inline-flex h-11 items-center border border-sand-200"
    >
      <button
        type="button"
        aria-label="Giảm số lượng"
        className={STEP_BUTTON}
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
      >
        <Minus aria-hidden strokeWidth={1.25} className="size-4" />
      </button>
      <output aria-live="polite" className="type-body min-w-10 text-center tabular-nums">
        {value}
      </output>
      <button
        type="button"
        aria-label="Tăng số lượng"
        className={STEP_BUTTON}
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
      >
        <Plus aria-hidden strokeWidth={1.25} className="size-4" />
      </button>
    </div>
  );
}
