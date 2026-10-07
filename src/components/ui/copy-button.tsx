"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type CopyButtonProps = {
  value: string;
  /** Đọc cho trình đọc màn hình, ví dụ "mã đơn" → "Sao chép mã đơn". */
  what: string;
  className?: string;
};

const RESET_MS = 2000;

/** Nút sao chép vào bộ nhớ tạm. Đổi thành dấu ✓ trong 2 giây. */
export function CopyButton({ value, what, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), RESET_MS);
    return () => window.clearTimeout(timer);
  }, [copied]);

  async function copy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch {
      // Trình duyệt chặn clipboard: khách vẫn thấy chữ và tự chép được.
    }
  }

  const Icon = copied ? Check : Copy;
  return (
    <button
      type="button"
      onClick={() => void copy()}
      aria-label={copied ? `Đã sao chép ${what}` : `Sao chép ${what}`}
      className={cn(
        "grid size-11 shrink-0 place-items-center text-ink-900 hover:bg-ivory-100",
        className,
      )}
    >
      <Icon aria-hidden strokeWidth={1.25} className="size-4" />
    </button>
  );
}
