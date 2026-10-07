"use server";

import { headers } from "next/headers";
import { lookupOrderData, rememberLookedUpOrder } from "@/features/order";
import { AppError } from "@/lib/errors";
import { getEnv } from "@/lib/env";
import { checkRateLimit, getClientIp, hashIp } from "@/lib/rate-limit";
import { dbRateLimitStore } from "@/lib/rate-limit-db";
import { ok, toErrorResult, type ActionResult } from "@/lib/result";
import { lookupSchema } from "./schema";

const LOOKUP_LIMIT = 10;
const LOOKUP_WINDOW_SECONDS = 10 * 60;
const NOT_FOUND_MESSAGE = "Không tìm thấy đơn. Kiểm tra lại mã đơn và số điện thoại.";

async function enforceRateLimit(): Promise<void> {
  const ipHash = hashIp(getClientIp(await headers()), getEnv().IP_HASH_SALT);
  const decision = await checkRateLimit(
    { key: `lookup:${ipHash}`, limit: LOOKUP_LIMIT, windowSeconds: LOOKUP_WINDOW_SECONDS },
    dbRateLimitStore,
  );
  if (decision.allowed) return;
  const minutes = Math.ceil(decision.retryAfterSeconds / 60);
  throw new AppError(
    "RATE_LIMITED",
    `Bạn tra cứu quá nhiều lần. Vui lòng thử lại sau ${minutes} phút.`,
  );
}

/**
 * 🌐 Tra cứu đơn bằng mã đơn + số điện thoại (docs/04 mục 8.1 #3). Phải khớp cả hai; sai thì chỉ báo
 * một câu chung. Giới hạn 10 lần / 10 phút / IP.
 * Khớp thì ghi cookie ký 30 phút; trang kết quả (server) đọc cookie đó, số điện thoại không nằm trên URL.
 */
export async function lookupOrder(input: unknown): Promise<ActionResult<{ code: string }>> {
  try {
    const { code, phone } = lookupSchema.parse(input);
    await enforceRateLimit();
    const found = await lookupOrderData(code, phone);
    if (!found) throw new AppError("NOT_FOUND", NOT_FOUND_MESSAGE);
    await rememberLookedUpOrder(found.order.code);
    return ok({ code: found.order.code });
  } catch (error) {
    return toErrorResult(error);
  }
}
