import { NextResponse } from "next/server";
import { checkHealth } from "@/features/dashboard";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

/** Giám sát: 200 `{ ok: true }` khi website và database sống, 503 khi không. Không lộ chi tiết lỗi. */
export async function GET(): Promise<NextResponse> {
  try {
    await checkHealth();
    return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    logger.error("health.fail", error);
    return NextResponse.json(
      { ok: false },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
