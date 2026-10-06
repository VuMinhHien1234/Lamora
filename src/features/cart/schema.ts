import { z } from "zod";
import { MAX_LINE_QUANTITY } from "./service";

export const MAX_CART_LINES = 30;

export const validateCartSchema = z.object({
  items: z
    .array(
      z.object({
        variantId: z.string().min(1).max(40),
        quantity: z.number().int().min(1).max(MAX_LINE_QUANTITY),
      }),
    )
    .max(MAX_CART_LINES, `Giỏ hàng tối đa ${MAX_CART_LINES} dòng`),
});

export type ValidateCartInput = z.infer<typeof validateCartSchema>;
