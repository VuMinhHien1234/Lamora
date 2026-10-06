import { z } from "zod";

const PROVINCE_CODE = /^\d{2}$/;
const WARD_CODE = /^\d{5}$/;
const MAX_SUBTOTAL = 1_000_000_000;

export const provinceCodeSchema = z.string().regex(PROVINCE_CODE, "Mã tỉnh không hợp lệ");
export const wardCodeSchema = z.string().regex(WARD_CODE, "Mã phường/xã không hợp lệ");

export const addressOptionsSchema = z.object({ provinceCode: provinceCodeSchema.optional() });

export const quoteShippingSchema = z.object({
  provinceCode: provinceCodeSchema,
  subtotal: z.number().int("Số tiền phải là số nguyên").min(0).max(MAX_SUBTOTAL),
});

export type QuoteShippingInput = z.infer<typeof quoteShippingSchema>;
