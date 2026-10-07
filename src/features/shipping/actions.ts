"use server";

import { toErrorResult, ok, type ActionResult } from "@/lib/result";
import { addressOptionsSchema, quoteShippingSchema } from "./schema";
import * as service from "./service";
import type { AddressOption, ShippingQuote } from "./types";

/** 🌐 Danh sách tỉnh, hoặc phường/xã của một tỉnh (cho ô chọn địa chỉ ở trang thanh toán). */
export async function getAddressOptions(input: unknown): Promise<ActionResult<AddressOption[]>> {
  try {
    const { provinceCode } = addressOptionsSchema.parse(input ?? {});
    return ok(await service.getAddressOptions(provinceCode));
  } catch (error) {
    return toErrorResult(error);
  }
}

/** 🌐 Phí giao hàng tạm tính theo tỉnh và tiền hàng. Tiền thật vẫn do server tính lại khi đặt đơn. */
export async function quoteShipping(input: unknown): Promise<ActionResult<ShippingQuote>> {
  try {
    const { provinceCode, subtotal } = quoteShippingSchema.parse(input);
    return ok(service.quoteShipping(provinceCode, subtotal));
  } catch (error) {
    return toErrorResult(error);
  }
}
