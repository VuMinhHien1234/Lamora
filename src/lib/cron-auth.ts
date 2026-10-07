import { timingSafeEqual } from "node:crypto";

/** Kiểm tra header `Authorization: Bearer <CRON_SECRET>` của các route `/api/cron/*` (docs/09 mục 7). */
export function isValidCronAuth(header: string | null, secret: string): boolean {
  if (!header?.startsWith("Bearer ")) return false;
  const given = Buffer.from(header.slice("Bearer ".length));
  const expected = Buffer.from(secret);
  return given.length === expected.length && timingSafeEqual(given, expected);
}
