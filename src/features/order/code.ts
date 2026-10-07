import { randomInt } from "node:crypto";
import { vnDateString } from "@/lib/date";

// Bỏ O, 0, I, 1 cho dễ đọc qua điện thoại (docs/02 mục 3.8).
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const SUFFIX_LENGTH = 4;

/** Mã đơn: `LMR-YYMMDD-XXXX` (ngày theo giờ Việt Nam). */
export function generateOrderCode(now: Date = new Date()): string {
  const day = vnDateString(now).slice(2).replaceAll("-", "");
  let suffix = "";
  for (let i = 0; i < SUFFIX_LENGTH; i++) suffix += ALPHABET[randomInt(ALPHABET.length)];
  return `LMR-${day}-${suffix}`;
}
