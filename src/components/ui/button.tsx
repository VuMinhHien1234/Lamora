import Link from "next/link";
import type { ButtonHTMLAttributes, ComponentProps } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "subtle" | "danger";
type ButtonSize = "default" | "compact";

type StyleOptions = { variant?: ButtonVariant; size?: ButtonSize; fullWidth?: boolean };

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: "bg-ink-900 text-ivory-50 hover:bg-rose-700",
  secondary: "border border-ink-900 text-ink-900 hover:bg-ink-900 hover:text-ivory-50",
  ghost: "underline decoration-sand-300 underline-offset-8 hover:decoration-rose-400",
  subtle: "bg-ivory-100 text-ink-900 hover:bg-sand-200",
  danger: "border border-error-700 text-error-700 hover:bg-error-700 hover:text-ivory-50",
};

const SIZE_CLASS: Record<ButtonSize, string> = {
  default: "h-12 px-7 md:h-13",
  compact: "h-10 px-5",
};

/** Class của nút. Dùng riêng khi cần một liên kết trông như nút. */
export function buttonStyles({ variant = "primary", size, fullWidth }: StyleOptions = {}): string {
  // Nút subtle/danger chỉ dùng trong admin nên mặc định cao 40px.
  const resolvedSize =
    size ?? (variant === "subtle" || variant === "danger" ? "compact" : "default");
  return cn(
    "type-eyebrow relative inline-flex select-none items-center justify-center gap-2 transition-colors duration-300 ease-soft disabled:pointer-events-none disabled:opacity-50",
    variant !== "ghost" && SIZE_CLASS[resolvedSize],
    VARIANT_CLASS[variant],
    fullWidth && "w-full",
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  StyleOptions & {
    /** Đang xử lý: giữ nguyên chiều rộng, thay chữ bằng 3 chấm và khóa bấm. */
    loading?: boolean;
  };

export function Button({
  variant,
  size,
  fullWidth,
  loading,
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type="button"
      {...rest}
      disabled={rest.disabled || loading}
      aria-busy={loading || undefined}
      className={cn(buttonStyles({ variant, size, fullWidth }), className)}
    >
      <span className={cn("inline-flex items-center gap-2", loading && "invisible")}>
        {children}
      </span>
      {loading && <LoadingDots />}
    </button>
  );
}

function LoadingDots() {
  return (
    <span aria-hidden className="absolute inset-0 flex items-center justify-center gap-1.5">
      {[0, 1, 2].map((index) => (
        <span
          key={index}
          className="size-1 animate-[lamora-dots_1.2s_ease-in-out_infinite] rounded-full bg-current"
          style={{ animationDelay: `${index * 160}ms` }}
        />
      ))}
    </span>
  );
}

type ButtonLinkProps = ComponentProps<typeof Link> & StyleOptions;

export function ButtonLink({ variant, size, fullWidth, className, ...rest }: ButtonLinkProps) {
  return <Link {...rest} className={cn(buttonStyles({ variant, size, fullWidth }), className)} />;
}
