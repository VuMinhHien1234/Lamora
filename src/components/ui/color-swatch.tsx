import { cn } from "@/lib/utils";

type ColorSwatchProps = {
  name: string;
  hex: string;
  selected?: boolean;
  soldOut?: boolean;
  onClick?: () => void;
};

const SOLD_OUT_LINE =
  "bg-[linear-gradient(135deg,transparent_46%,var(--color-ink-900)_46%,var(--color-ink-900)_54%,transparent_54%)]";

/** Ô màu tròn 24px (ngoại lệ duy nhất được bo tròn), vùng bấm 44px. */
export function ColorSwatch({ name, hex, selected, soldOut, onClick }: ColorSwatchProps) {
  const label = `Màu ${name}${soldOut ? ", hết hàng" : ""}`;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={selected}
      title={label}
      className="grid size-11 place-items-center"
    >
      <span
        className={cn(
          "relative block size-6 rounded-full border border-sand-200",
          selected && "ring-1 ring-ink-900 ring-offset-[3px] ring-offset-ivory-50",
        )}
        style={{ backgroundColor: hex }}
      >
        {soldOut && <span className={cn("absolute inset-0 rounded-full", SOLD_OUT_LINE)} />}
      </span>
    </button>
  );
}
