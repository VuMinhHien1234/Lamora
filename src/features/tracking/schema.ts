import { z } from "zod";

export const lookupSchema = z.object({
  code: z.string("Vui lòng nhập mã đơn").trim().min(1, "Vui lòng nhập mã đơn").max(30),
  phone: z
    .string("Vui lòng nhập số điện thoại")
    .trim()
    .min(1, "Vui lòng nhập số điện thoại")
    .max(20),
});

export type LookupInput = z.infer<typeof lookupSchema>;
