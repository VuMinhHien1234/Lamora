"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm, type UseFormReturn, type FieldPath } from "react-hook-form";
import { clearCardNotes, readCardNotes, type CartApi } from "@/features/cart";
import { createOrder } from "../actions";
import {
  checkoutFormSchema,
  type CheckoutFormInput,
  type CheckoutFormValues,
  type CreateOrderInput,
} from "../schema";

const DEFAULTS = {
  customer: { name: "", phone: "", email: "" },
  isGift: false,
  address: { provinceCode: "", wardCode: "", addressLine: "" },
  paymentMethod: "COD",
  website: "",
} as unknown as CheckoutFormInput;

export type ServerProblem = {
  message: string;
  /** variantId → thông báo, khi giỏ có dòng không đặt được. */
  cartLines: Record<string, string>;
};

export type CheckoutController = {
  form: UseFormReturn<CheckoutFormInput, unknown, CheckoutFormValues>;
  submit: () => void;
  problem: ServerProblem | null;
  /** true sau khi đặt thành công, để trang không đẩy khách về giỏ trống. */
  placed: boolean;
};

/** Gắn thiệp và gói quà soạn riêng cho từng sản phẩm vào dòng hàng gửi lên server. */
function withCards(lines: CartApi["lines"]): CreateOrderInput["items"] {
  const notes = readCardNotes();
  return lines.map((line) => ({
    ...line,
    cardMessage: notes[line.variantId]?.message || undefined,
    giftWrap: notes[line.variantId]?.wrap ?? false,
  }));
}

export function useCheckoutForm(cart: CartApi): CheckoutController {
  const router = useRouter();
  const placedRef = useRef(false);
  const [placed, setPlaced] = useState(false);
  const [problem, setProblem] = useState<ServerProblem | null>(null);
  const form = useForm<CheckoutFormInput, unknown, CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: DEFAULTS,
    shouldUnregister: true,
  });

  const onValid = async (values: CheckoutFormValues): Promise<void> => {
    setProblem(null);
    // `agree` chỉ để kiểm tra ở form, không gửi lên server.
    const result = await createOrder({ ...values, agree: undefined, items: withCards(cart.lines) });
    if (result.ok) {
      placedRef.current = true;
      setPlaced(true);
      cart.clear();
      clearCardNotes();
      router.push(`/dat-hang-thanh-cong?code=${encodeURIComponent(result.data.code)}`);
      return;
    }
    const { code, message, fieldErrors = {} } = result.error;
    if (code === "CART_INVALID") return setProblem({ message, cartLines: flatten(fieldErrors) });
    const unmapped = applyFieldErrors(form, fieldErrors);
    setProblem({
      message: unmapped ? message : "Vui lòng kiểm tra lại các ô báo lỗi.",
      cartLines: {},
    });
  };

  return { form, submit: () => void form.handleSubmit(onValid)(), problem, placed };
}

function flatten(fieldErrors: Record<string, string[]>): Record<string, string> {
  return Object.fromEntries(Object.entries(fieldErrors).map(([key, list]) => [key, list[0] ?? ""]));
}

/** Gắn lỗi server vào đúng ô. Trả về true nếu còn lỗi không gắn được vào ô nào. */
function applyFieldErrors(
  form: UseFormReturn<CheckoutFormInput, unknown, CheckoutFormValues>,
  fieldErrors: Record<string, string[]>,
): boolean {
  const entries = Object.entries(fieldErrors);
  for (const [key, list] of entries) {
    form.setError(key as FieldPath<CheckoutFormInput>, { message: list[0] });
  }
  return entries.length === 0;
}
