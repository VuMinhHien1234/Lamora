import { cn } from "@/lib/utils";

type LogoProps = {
  /** "full": LAMORA + đường kẻ ✿ + FLOWER; "wordmark": chỉ dòng LAMORA (header hẹp). */
  variant?: "full" | "wordmark";
  /** "light": chữ sáng, dùng trên nền tối (footer, menu admin). */
  tone?: "dark" | "light";
  className?: string;
};

/** Logo chữ tạm (docs/03 mục 5.2). Khi có logo thật, thay nội dung file này bằng SVG. */
export function Logo({ variant = "wordmark", tone = "dark", className }: LogoProps) {
  const color = tone === "light" ? "text-ivory-50" : "text-ink-900";
  return (
    <span className={cn("inline-flex flex-col items-center leading-none", color, className)}>
      <span className="pl-[0.3em] font-display text-[1.375rem] font-medium tracking-[0.3em] md:text-[1.625rem]">
        LAMORA
      </span>
      {variant === "full" && (
        <>
          <span aria-hidden className="my-2 flex items-center gap-2 text-gold-500">
            <span className="h-px w-8 bg-gold-500" />
            <span className="text-[0.625rem]">✿</span>
            <span className="h-px w-8 bg-gold-500" />
          </span>
          <span className="pl-[0.5em] text-[0.6875rem] font-normal tracking-[0.5em]">FLOWER</span>
        </>
      )}
    </span>
  );
}
