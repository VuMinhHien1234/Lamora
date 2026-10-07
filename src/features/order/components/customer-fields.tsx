"use client";

import type { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import type { CheckoutFormInput } from "../schema";

type Form = UseFormReturn<CheckoutFormInput>;

export function CustomerFields({ form }: { form: Form }) {
  const { register, formState } = form;
  const errors = formState.errors.customer;
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <Input
        label="Họ và tên"
        required
        autoComplete="name"
        error={errors?.name?.message}
        {...register("customer.name")}
      />
      <Input
        label="Số điện thoại"
        required
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        error={errors?.phone?.message}
        {...register("customer.phone")}
      />
      <div className="md:col-span-2">
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          hint="Không bắt buộc. Để shop gửi xác nhận đơn nếu bạn muốn."
          error={errors?.email?.message}
          {...register("customer.email")}
        />
      </div>
    </div>
  );
}
