"use server";

import { headers } from "next/headers";
import { getEnv } from "@/lib/env";
import { getClientIp, hashIp } from "@/lib/rate-limit";
import { ok, toErrorResult, type ActionResult } from "@/lib/result";
import { createOrderSchema } from "./schema";
import * as service from "./service";
import type { CreateOrderData } from "./types";

/** 🌐 Đặt hàng. Giá, phí ship, tổng tiền luôn tính lại ở server; trình duyệt chỉ gửi mã biến thể và số lượng. */
export async function createOrder(input: unknown): Promise<ActionResult<CreateOrderData>> {
  try {
    const parsed = createOrderSchema.parse(input);
    const ipHash = hashIp(getClientIp(await headers()), getEnv().IP_HASH_SALT);
    return ok(await service.createOrder(parsed, { ipHash }));
  } catch (error) {
    return toErrorResult(error);
  }
}
