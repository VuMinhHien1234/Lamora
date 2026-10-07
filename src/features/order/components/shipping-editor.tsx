"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { CARRIERS } from "@/config/shipping";
import type { AddressOption } from "@/features/shipping";
import { updateOrderShippingInfo } from "../admin-actions";
import type { AdminOrderDetail } from "../admin-types";
import { FormDialog } from "./form-dialog";
import { useOrderAction } from "./use-order-action";
import { useWardOptions } from "./use-ward-options";

type Form = {
  recipientName: string;
  recipientPhone: string;
  addressLine: string;
  provinceCode: string;
  wardCode: string;
  carrier: string;
  trackingCode: string;
};

function initialForm(order: AdminOrderDetail): Form {
  return {
    recipientName: order.recipientName,
    recipientPhone: order.recipientPhone,
    addressLine: order.addressLine,
    provinceCode: order.provinceCode,
    wardCode: order.wardCode,
    carrier: order.carrier ?? "",
    trackingCode: order.trackingCode ?? "",
  };
}

/** Chỉ gửi những trường thật sự đổi; địa chỉ hành chính đổi thì gửi cả tỉnh và phường/xã. */
function changedFields(order: AdminOrderDetail, form: Form): Record<string, string> {
  const before = initialForm(order);
  const out: Record<string, string> = {};
  for (const key of [
    "recipientName",
    "recipientPhone",
    "addressLine",
    "carrier",
    "trackingCode",
  ] as const) {
    if (form[key] !== before[key]) out[key] = form[key];
  }
  if (form.provinceCode !== before.provinceCode || form.wardCode !== before.wardCode) {
    out.provinceCode = form.provinceCode;
    out.wardCode = form.wardCode;
  }
  return out;
}

type Props = { order: AdminOrderDetail; provinces: AddressOption[] };
type SetForm = (patch: Partial<Form>) => void;

function LocationInputs({
  form,
  set,
  provinces,
}: {
  form: Form;
  set: SetForm;
  provinces: AddressOption[];
}) {
  const { wards, loading } = useWardOptions(form.provinceCode);
  return (
    <>
      <Select
        label="Tỉnh / thành phố"
        value={form.provinceCode}
        onChange={(e) => set({ provinceCode: e.target.value, wardCode: "" })}
      >
        {provinces.map((p) => (
          <option key={p.code} value={p.code}>
            {p.name}
          </option>
        ))}
      </Select>
      <Select
        label="Phường / xã"
        value={form.wardCode}
        disabled={loading}
        onChange={(e) => set({ wardCode: e.target.value })}
      >
        <option value="">{loading ? "Đang tải…" : "Chọn phường / xã"}</option>
        {wards.map((w) => (
          <option key={w.code} value={w.code}>
            {w.name}
          </option>
        ))}
      </Select>
    </>
  );
}

function AddressInputs({
  form,
  set,
  provinces,
}: {
  form: Form;
  set: SetForm;
  provinces: AddressOption[];
}) {
  return (
    <>
      <Input
        label="Tên người nhận"
        value={form.recipientName}
        onChange={(e) => set({ recipientName: e.target.value })}
      />
      <Input
        label="SĐT người nhận"
        type="tel"
        value={form.recipientPhone}
        onChange={(e) => set({ recipientPhone: e.target.value })}
      />
      <LocationInputs form={form} set={set} provinces={provinces} />
      <Input
        label="Số nhà, tên đường"
        value={form.addressLine}
        onChange={(e) => set({ addressLine: e.target.value })}
      />
    </>
  );
}

type ShippingFormProps = {
  order: AdminOrderDetail;
  form: Form;
  set: SetForm;
  provinces: AddressOption[];
  busy: boolean;
  onSubmit: () => void;
  onClose: () => void;
};

function ShippingForm({ order, form, set, provinces, busy, onSubmit, onClose }: ShippingFormProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="flex flex-col gap-4"
    >
      {order.canEditShipping && <AddressInputs form={form} set={set} provinces={provinces} />}
      <datalist id="edit-carrier-list">
        {CARRIERS.map((c) => (
          <option key={c} value={c} />
        ))}
      </datalist>
      <Input
        label="Đơn vị vận chuyển"
        list="edit-carrier-list"
        value={form.carrier}
        onChange={(e) => set({ carrier: e.target.value })}
      />
      <Input
        label="Mã vận đơn"
        value={form.trackingCode}
        onChange={(e) => set({ trackingCode: e.target.value })}
      />
      <p className="type-small text-stone-500">Phí ship không được tính lại khi sửa địa chỉ.</p>
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="ghost" onClick={onClose} disabled={busy}>
          Quay lại
        </Button>
        <Button type="submit" loading={busy}>
          Lưu
        </Button>
      </div>
    </form>
  );
}

/** Sửa người nhận, địa chỉ, vận đơn. Không tính lại phí ship (docs/04 mục 8.2 #9). */
export function ShippingEditor({ order, provinces }: Props) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Form>(() => initialForm(order));
  const { busy, run } = useOrderAction();
  const set: SetForm = (patch) => setForm((prev) => ({ ...prev, ...patch }));
  if (!order.canEditShipping && order.status !== "SHIPPING") return null;

  async function submit(): Promise<void> {
    const fields = changedFields(order, form);
    if (Object.keys(fields).length === 0) return setOpen(false);
    const done = await run(
      () => updateOrderShippingInfo({ id: order.id, ...fields }),
      "Đã cập nhật thông tin giao hàng",
    );
    if (done) setOpen(false);
  }

  return (
    <>
      <Button
        variant="subtle"
        size="compact"
        onClick={() => {
          setForm(initialForm(order));
          setOpen(true);
        }}
      >
        Sửa
      </Button>
      <FormDialog open={open} title="Sửa thông tin giao hàng" onClose={() => setOpen(false)}>
        <ShippingForm
          order={order}
          form={form}
          set={set}
          provinces={provinces}
          busy={busy}
          onSubmit={() => void submit()}
          onClose={() => setOpen(false)}
        />
      </FormDialog>
    </>
  );
}
