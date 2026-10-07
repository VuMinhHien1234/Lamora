"use client";

import type { UseFormReturn } from "react-hook-form";
import { cn } from "@/lib/utils";
import type { CheckoutFormInput } from "../schema";

const OPTIONS = [
  {
    value: "COD",
    title: "Thanh toán khi nhận hàng (COD)",
    note: "Bạn trả tiền mặt cho nhân viên giao hàng.",
  },
  {
    value: "BANK_TRANSFER",
    title: "Chuyển khoản ngân hàng (VietQR)",
    note: "Sau khi đặt hàng, bạn sẽ thấy mã QR để quét bằng ứng dụng ngân hàng.",
  },
] as const;

export function PaymentFields({ form }: { form: UseFormReturn<CheckoutFormInput> }) {
  const error = form.formState.errors.paymentMethod?.message;
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="sr-only">Cách thanh toán</legend>
      {OPTIONS.map((option) => (
        <label
          key={option.value}
          className={cn(
            "flex cursor-pointer items-start gap-4 border border-sand-200 p-4 transition-colors duration-300 hover:border-sand-300 has-[:checked]:border-ink-900",
          )}
        >
          <input
            type="radio"
            value={option.value}
            className="mt-1 size-4 accent-ink-900"
            {...form.register("paymentMethod")}
          />
          <span className="flex flex-col gap-1">
            <span className="type-body font-medium">{option.title}</span>
            <span className="type-small text-stone-500">{option.note}</span>
          </span>
        </label>
      ))}
      {error && (
        <p role="alert" className="type-small text-error-700">
          {error}
        </p>
      )}
    </fieldset>
  );
}
