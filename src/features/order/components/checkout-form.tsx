"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  countWrapped,
  useCardNotes,
  useCart,
  useCartValidation,
  type CartValidation,
} from "@/features/cart";
import type { AddressOption } from "@/features/shipping";
import { AddressFields } from "./address-fields";
import { CustomerFields } from "./customer-fields";
import { DeliveryFields } from "./delivery-fields";
import { CardFields } from "./card-fields";
import { GiftFields } from "./gift-fields";
import { OrderSummary } from "./order-summary";
import { PaymentFields } from "./payment-fields";
import { useCheckoutForm } from "./use-checkout-form";
import { useShippingFee } from "./use-shipping-fee";
import { useHydrated } from "./use-hydrated";
import { CartProblem } from "./cart-problem";

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-5">
      <h2 className="type-h3">{title}</h2>
      {children}
    </section>
  );
}

function Consent({ error, register }: { error?: string; register: object }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-start gap-3">
        <input type="checkbox" className="mt-1 size-4 accent-ink-900" {...register} />
        <span className="type-small">
          Tôi đồng ý với{" "}
          <Link href="/chinh-sach-bao-mat" className="underline underline-offset-4">
            Chính sách bảo mật
          </Link>{" "}
          và{" "}
          <Link href="/chinh-sach-doi-tra" className="underline underline-offset-4">
            Chính sách đổi trả
          </Link>
          .
        </span>
      </label>
      {error && (
        <p role="alert" className="type-small text-error-700">
          {error}
        </p>
      )}
    </div>
  );
}

type Controller = ReturnType<typeof useCheckoutForm>;

type FieldsProps = {
  form: Controller["form"];
  provinces: AddressOption[];
  validation: CartValidation | null;
};

function Fields({ form, provinces, validation }: FieldsProps) {
  return (
    <div className="flex flex-col gap-10">
      <Block title="Người đặt hàng">
        <CustomerFields form={form} />
      </Block>
      <Block title="Địa chỉ nhận hàng">
        <AddressFields form={form} provinces={provinces} />
      </Block>
      <Block title="Người nhận">
        <GiftFields form={form} />
      </Block>
      <Block title="Thiệp & lời nhắn">
        <CardFields validation={validation} />
      </Block>
      <Block title="Thời gian nhận hàng">
        <DeliveryFields form={form} />
      </Block>
      <Block title="Thanh toán">
        <PaymentFields form={form} />
      </Block>
      {/* Ô bẫy bot: người thật không thấy và không điền. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input type="text" tabIndex={-1} autoComplete="off" {...form.register("website")} />
        </label>
      </div>
    </div>
  );
}

type SidebarProps = {
  controller: Controller;
  validation: CartValidation | null;
};

function Sidebar({ controller, validation }: SidebarProps) {
  const { form, problem } = controller;
  const { watch, register, formState } = form;
  const province = watch("address.provinceCode") ?? "";
  const shippingFee = useShippingFee(province, validation?.subtotal ?? null);
  const notes = useCardNotes();
  const wrapCount = countWrapped(notes, validation?.lines.map((line) => line.variantId) ?? []);
  const stockIssue = validation !== null && validation.warnings.length > 0;
  return (
    <aside className="flex h-fit flex-col gap-6 border border-sand-200 p-6 lg:sticky lg:top-28">
      <h2 className="type-eyebrow">Đơn hàng của bạn</h2>
      <OrderSummary validation={validation} shippingFee={shippingFee} wrapCount={wrapCount} />
      {stockIssue && (
        <p role="alert" className="type-small text-warning-700">
          Có sản phẩm không đủ hàng.{" "}
          <Link href="/gio-hang" className="underline underline-offset-4">
            Quay lại giỏ hàng
          </Link>{" "}
          để điều chỉnh.
        </p>
      )}
      {problem && <CartProblem problem={problem} />}
      <Consent error={formState.errors.agree?.message} register={register("agree")} />
      <Button
        type="submit"
        fullWidth
        loading={formState.isSubmitting}
        disabled={!validation || stockIssue}
      >
        Đặt hàng
      </Button>
    </aside>
  );
}

export function CheckoutForm({ provinces }: { provinces: AddressOption[] }) {
  const router = useRouter();
  const hydrated = useHydrated();
  const cart = useCart();
  const { data: validation } = useCartValidation(cart.lines, true);
  const controller = useCheckoutForm(cart);
  const empty = hydrated && cart.lines.length === 0;

  useEffect(() => {
    if (empty && !controller.placed) router.replace("/gio-hang");
  }, [empty, controller.placed, router]);

  if (!hydrated || empty) return <Skeleton className="h-96 w-full" />;
  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        controller.submit();
      }}
      className="grid gap-10 lg:grid-cols-[1fr_24rem] lg:gap-16"
    >
      <Fields form={controller.form} provinces={provinces} validation={validation} />
      <Sidebar controller={controller} validation={validation} />
    </form>
  );
}
