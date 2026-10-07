"use client";

import type { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { AddressOption } from "@/features/shipping";
import type { CheckoutFormInput } from "../schema";
import { useWardOptions } from "./use-ward-options";

function Options({ items }: { items: AddressOption[] }) {
  return items.map((item) => (
    <option key={item.code} value={item.code}>
      {item.name}
    </option>
  ));
}

type AddressFieldsProps = { form: UseFormReturn<CheckoutFormInput>; provinces: AddressOption[] };

export function AddressFields({ form, provinces }: AddressFieldsProps) {
  const { register, watch, setValue, formState } = form;
  const errors = formState.errors.address;
  const provinceCode = watch("address.provinceCode");
  const { wards, loading } = useWardOptions(provinceCode ?? "");
  const province = register("address.provinceCode");

  return (
    <div className="grid gap-5 md:grid-cols-2">
      <Select
        label="Tỉnh / thành phố"
        required
        autoComplete="address-level1"
        error={errors?.provinceCode?.message}
        {...province}
        onChange={(event) => {
          void province.onChange(event);
          setValue("address.wardCode", "");
        }}
      >
        <option value="">Chọn tỉnh / thành phố</option>
        <Options items={provinces} />
      </Select>
      <Select
        label="Phường / xã"
        required
        disabled={!provinceCode || loading}
        error={errors?.wardCode?.message}
        {...register("address.wardCode")}
      >
        <option value="">{loading ? "Đang tải…" : "Chọn phường / xã"}</option>
        <Options items={wards} />
      </Select>
      <div className="md:col-span-2">
        <Input
          label="Số nhà, tên đường"
          required
          autoComplete="address-line1"
          error={errors?.addressLine?.message}
          {...register("address.addressLine")}
        />
      </div>
    </div>
  );
}
