import { NextResponse, type NextRequest } from "next/server";
import { cleanup } from "@/features/maintenance";
import { isValidCronAuth } from "@/lib/cron-auth";
import { getEnv } from "@/lib/env";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

/** POST /api/cron/cleanup (docs/04 mục 12): dọn bộ đếm giới hạn tần suất và ipHash cũ. Gọi từ GitHub Actions `cron.yml`. */
export async function POST(request: NextRequest): Promise<NextResponse> {
  if (!isValidCronAuth(request.headers.get("authorization"), getEnv().CRON_SECRET)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  try {
    const result = await cleanup();
    logger.info("cron.cleanup", result);
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    logger.error("cron.cleanup.fail", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
