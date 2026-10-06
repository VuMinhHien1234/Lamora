import { computeShippingQuote, resolveAddress } from "@/features/shipping";
import { AppError } from "@/lib/errors";
import { vnDateString } from "@/lib/date";
import { generateOrderCode } from "./code";
import { planOrder } from "./plan";
import * as repo from "./repository";
import { MAX_DELIVERY_DAYS_AHEAD, type CreateOrderInput } from "./schema";
import type { CreateOrderData, OrderLineError } from "./types";

const SPAM_WINDOW_MS = 10 * 60 * 1000;
const SPAM_MAX_ORDERS = 3;

export type CreateOrderContext = { ipHash: string; now?: Date };

function assertDeliveryDate(date: string | undefined, now: Date): string | null {
  if (!date) return null;
  const earliest = vnDateString(now, 1);
  const latest = vnDateString(now, MAX_DELIVERY_DAYS_AHEAD);
  if (date < earliest || date > latest) {
    throw new AppError("VALIDATION_ERROR", "Ngày nhận hàng chưa hợp lệ.", {
      fieldErrors: {
        preferredDeliveryDate: [
          `Vui lòng chọn ngày từ ngày mai đến ${MAX_DELIVERY_DAYS_AHEAD} ngày tới.`,
        ],
      },
    });
  }
  return date;
}

async function assertNotSpam(ipHash: string, now: Date): Promise<void> {
  const since = new Date(now.getTime() - SPAM_WINDOW_MS);
  if ((await repo.countOrdersByIpSince(ipHash, since)) >= SPAM_MAX_ORDERS) {
    throw new AppError(
      "TOO_MANY_ORDERS",
      "Bạn vừa đặt nhiều đơn liên tiếp. Vui lòng thử lại sau ít phút hoặc nhắn Zalo cho shop.",
    );
  }
}

function cartInvalid(errors: OrderLineError[]): AppError {
  const fieldErrors: Record<string, string[]> = {};
  for (const { variantId, message } of errors) fieldErrors[variantId] = [message];
  return new AppError("CART_INVALID", "Một số sản phẩm trong giỏ không còn đủ để đặt hàng.", {
    fieldErrors,
  });
}

/** Đơn giả cho bot (ô bẫy `website` bị điền): trả "thành công" nhưng không tạo gì (docs/04 mục 8.3). */
function fakeSuccess(input: CreateOrderInput, now: Date): CreateOrderData {
  return { code: generateOrderCode(now), total: 0, paymentMethod: input.paymentMethod };
}

/** Tạo đơn hàng. Mọi số tiền được tính lại ở đây từ giá trong database (docs/04 mục 8.3). */
export async function createOrder(
  input: CreateOrderInput,
  ctx: CreateOrderContext,
): Promise<CreateOrderData> {
  const now = ctx.now ?? new Date();
  if (input.website) return fakeSuccess(input, now);

  await assertNotSpam(ctx.ipHash, now);
  const deliveryDate = assertDeliveryDate(input.preferredDeliveryDate, now);
  const address = await resolveAddress(input.address.provinceCode, input.address.wardCode);
  if (!address) {
    throw new AppError("INVALID_ADDRESS", "Địa chỉ giao hàng chưa đúng, vui lòng chọn lại.", {
      fieldErrors: { "address.wardCode": ["Vui lòng chọn lại phường/xã."] },
    });
  }

  const ids = [...new Set(input.items.map((line) => line.variantId))];
  const result = await repo.placeOrder(
    ids,
    (variants) =>
      planOrder(input, variants, {
        ...address,
        ipHash: ctx.ipHash,
        deliveryDate,
        quote: (subtotal) => computeShippingQuote(input.address.provinceCode, subtotal),
      }),
    () => generateOrderCode(now),
  );
  if (!result.ok) throw cartInvalid(result.errors);
  const { code, total, paymentMethod } = result.order;
  return { code, total, paymentMethod };
}
