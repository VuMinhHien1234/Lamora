import { z } from "zod";

/** Ô để trống trên form gửi lên chuỗi rỗng; coi như "không nhập". */
export function emptyToUndefined(value: unknown): unknown {
  return typeof value === "string" && value.trim() === "" ? undefined : value;
}

/** Chuỗi tùy chọn: rỗng → không có; có thì cắt khoảng trắng và giới hạn độ dài. */
export function optionalText(max: number, message: string): z.ZodOptional<z.ZodString> {
  return z.preprocess(
    emptyToUndefined,
    z.string().trim().max(max, message).optional(),
  ) as unknown as z.ZodOptional<z.ZodString>;
}
