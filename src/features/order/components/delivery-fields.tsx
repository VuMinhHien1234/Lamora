"use client";

import type { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { vnDateString } from "@/lib/date";
import { CUSTOMER_NOTE_MAX, MAX_DELIVERY_DAYS_AHEAD, type CheckoutFormInput } from "../schema";

export function DeliveryFields({ form }: { form: UseFormReturn<CheckoutFormInput> }) {
  const { register, formState } = form;
  const now = new Date();
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <Input
        label="Ngày muốn nhận hàng"
        type="date"
        min={vnDateString(now, 1)}
        max={vnDateString(now, MAX_DELIVERY_DAYS_AHEAD)}
        hint="Không bắt buộc. Shop sẽ cố gắng giao đúng ngày."
        error={formState.errors.preferredDeliveryDate?.message}
        {...register("preferredDeliveryDate")}
      />
      <div className="md:col-span-2">
        <Textarea
          label="Ghi chú cho shop"
          rows={3}
          maxLength={CUSTOMER_NOTE_MAX}
          error={formState.errors.customerNote?.message}
          {...register("customerNote")}
        />
      </div>
    </div>
  );
}
