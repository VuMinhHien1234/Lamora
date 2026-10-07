import { z } from "zod";
import { GIFT_MESSAGE_MAX } from "@/config/shipping";
import { emptyToUndefined } from "@/lib/zod-helpers";
import { normalizePhone } from "@/lib/phone";

export const MAX_ORDER_LINES = 30;
export const MAX_LINE_QUANTITY = 99;
export { GIFT_MESSAGE_MAX };
export const CUSTOMER_NOTE_MAX = 500;
export const MAX_DELIVERY_DAYS_AHEAD = 30;

const phoneSchema = z
  .string("Vui lòng nhập số điện thoại")
  .trim()
  .transform((value, ctx) => {
    const phone = normalizePhone(value);
    if (!phone) {
      ctx.addIssue({ code: "custom", message: "Số điện thoại chưa đúng, ví dụ 0912 345 678" });
      return z.NEVER;
    }
    return phone;
  });

const nameSchema = (label: string) =>
  z
    .string(`Vui lòng nhập ${label}`)
    .trim()
    .min(2, `Vui lòng nhập ${label}`)
    .max(80, `${label} quá dài`);

const optionalText = (max: number, message: string) =>
  z.preprocess(emptyToUndefined, z.string().trim().max(max, message).optional());

const emailSchema = z.preprocess(
  emptyToUndefined,
  z
    .string()
    .trim()
    .toLowerCase()
    .max(120, "Email quá dài")
    .pipe(z.email("Email chưa đúng"))
    .optional(),
);

const dateSchema = z.preprocess(
  emptyToUndefined,
  z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Ngày nhận chưa đúng")
    .optional(),
);

const orderFields = z.object({
  items: z
    .array(
      z.object({
        variantId: z.string().min(1).max(40),
        quantity: z.number().int().min(1).max(MAX_LINE_QUANTITY),
        /** Lời nhắn thiệp riêng của sản phẩm này. */
        cardMessage: optionalText(GIFT_MESSAGE_MAX, `Lời nhắn tối đa ${GIFT_MESSAGE_MAX} ký tự`),
        /** Gói quà riêng cho sản phẩm này. */
        giftWrap: z.boolean().default(false),
      }),
    )
    .min(1, "Giỏ hàng đang trống")
    .max(MAX_ORDER_LINES, `Giỏ hàng tối đa ${MAX_ORDER_LINES} dòng`),
  customer: z.object({
    name: nameSchema("họ tên"),
    phone: phoneSchema,
    email: emailSchema,
  }),
  isGift: z.boolean(),
  recipient: z.object({ name: nameSchema("tên người nhận"), phone: phoneSchema }).optional(),
  address: z.object({
    provinceCode: z.string().min(1, "Vui lòng chọn tỉnh/thành").max(10),
    wardCode: z.string().min(1, "Vui lòng chọn phường/xã").max(10),
    addressLine: z
      .string("Vui lòng nhập số nhà, đường")
      .trim()
      .min(3, "Vui lòng nhập số nhà, đường")
      .max(200, "Địa chỉ quá dài"),
  }),
  preferredDeliveryDate: dateSchema,
  customerNote: optionalText(CUSTOMER_NOTE_MAX, `Ghi chú tối đa ${CUSTOMER_NOTE_MAX} ký tự`),
  paymentMethod: z.enum(["COD", "BANK_TRANSFER"], "Vui lòng chọn cách thanh toán"),
  /** Trường bẫy bot: người thật không thấy nên luôn để trống. */
  website: z.string().max(200).optional(),
});

function requireRecipientForGift(
  value: { isGift: boolean; recipient?: unknown },
  ctx: z.RefinementCtx,
): void {
  if (value.isGift && !value.recipient) {
    ctx.addIssue({
      code: "custom",
      path: ["recipient", "name"],
      message: "Vui lòng nhập thông tin người nhận",
    });
  }
}

export const createOrderSchema = orderFields.superRefine(requireRecipientForGift);

/** Schema của form thanh toán: giống `createOrderSchema` nhưng không có `items` (giỏ lấy từ trình duyệt) và có ô đồng ý điều khoản. */
export const checkoutFormSchema = orderFields
  .omit({ items: true })
  .extend({
    agree: z.literal(true, "Vui lòng đồng ý với Chính sách bảo mật và Chính sách đổi trả"),
  })
  .superRefine(requireRecipientForGift);

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type CheckoutFormInput = z.input<typeof checkoutFormSchema>;
export type CheckoutFormValues = z.output<typeof checkoutFormSchema>;
