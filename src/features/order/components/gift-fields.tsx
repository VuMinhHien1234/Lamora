"use client";

import { Controller, type UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import type { CheckoutFormInput } from "../schema";

type Form = UseFormReturn<CheckoutFormInput>;

function GiftDetails({ form }: { form: Form }) {
  const { register, formState } = form;
  const errors = formState.errors;
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <Input
        label="Tên người nhận"
        required
        error={errors.recipient?.name?.message}
        {...register("recipient.name")}
      />
      <Input
        label="Số điện thoại người nhận"
        required
        type="tel"
        inputMode="tel"
        error={errors.recipient?.phone?.message}
        {...register("recipient.phone")}
      />
    </div>
  );
}

export function GiftFields({ form }: { form: Form }) {
  const isGift = form.watch("isGift");
  return (
    <div className="flex flex-col gap-5">
      <Controller
        control={form.control}
        name="isGift"
        render={({ field }) => (
          <Switch
            checked={field.value}
            onChange={field.onChange}
            label="Giao cho người khác (tặng quà)"
          />
        )}
      />
      {isGift && <GiftDetails form={form} />}
    </div>
  );
}
