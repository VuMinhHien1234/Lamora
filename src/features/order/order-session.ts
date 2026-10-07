import { cookies } from "next/headers";
import { getEnv } from "@/lib/env";
import { signToken, verifyToken } from "@/lib/signed-token";

const COOKIE_NAME = "lamora_order";
const LOOKUP_COOKIE_NAME = "lamora_lookup";
const TTL_SECONDS = 60 * 60;
const LOOKUP_TTL_SECONDS = 30 * 60;

/** Ghi nhớ trong 1 giờ rằng trình duyệt này vừa đặt đơn `code`. */
export async function rememberPlacedOrder(code: string): Promise<void> {
  (await cookies()).set(
    COOKIE_NAME,
    signToken(code, getEnv().AUTH_SECRET, { ttlSeconds: TTL_SECONDS }),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: TTL_SECONDS,
    },
  );
}

/** Mã đơn vừa đặt trên trình duyệt này, hoặc null nếu không có/hết hạn/sai chữ ký. */
export async function readPlacedOrderCode(): Promise<string | null> {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  return verifyToken(token, getEnv().AUTH_SECRET);
}

/** Ghi nhớ trong 30 phút rằng trình duyệt này vừa tra cứu thành công (khớp mã đơn + SĐT) đơn `code`. */
export async function rememberLookedUpOrder(code: string): Promise<void> {
  (await cookies()).set(
    LOOKUP_COOKIE_NAME,
    signToken(code, getEnv().AUTH_SECRET, { ttlSeconds: LOOKUP_TTL_SECONDS }),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: LOOKUP_TTL_SECONDS,
    },
  );
}

/** Mã đơn vừa tra cứu thành công trên trình duyệt này, hoặc null nếu không có/hết hạn/sai chữ ký. */
export async function readLookedUpOrderCode(): Promise<string | null> {
  const token = (await cookies()).get(LOOKUP_COOKIE_NAME)?.value;
  return verifyToken(token, getEnv().AUTH_SECRET);
}
