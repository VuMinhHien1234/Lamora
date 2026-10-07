import { createHmac, timingSafeEqual } from "node:crypto";

// Mã thông báo ký bằng HMAC, tự hết hạn. Dùng cho cookie "vừa đặt đơn" (docs/04 mục 8.1 #2).

function sign(body: string, secret: string): string {
  return createHmac("sha256", secret).update(body).digest("base64url");
}

/** Tạo token dạng `<nội dung base64url>.<hết hạn tính bằng giây>.<chữ ký>`. */
export function signToken(
  payload: string,
  secret: string,
  options: { ttlSeconds: number; now?: Date },
): string {
  const { ttlSeconds, now = new Date() } = options;
  const body = `${Buffer.from(payload).toString("base64url")}.${Math.floor(now.getTime() / 1000) + ttlSeconds}`;
  return `${body}.${sign(body, secret)}`;
}

/** Trả nội dung nếu chữ ký đúng và chưa hết hạn, ngược lại null. */
export function verifyToken(
  token: string | undefined,
  secret: string,
  now = new Date(),
): string | null {
  const parts = token?.split(".") ?? [];
  if (parts.length !== 3) return null;
  const [payload, expires, signature] = parts as [string, string, string];
  const expected = Buffer.from(sign(`${payload}.${expires}`, secret));
  const actual = Buffer.from(signature);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;
  if (Number(expires) < Math.floor(now.getTime() / 1000)) return null;
  return Buffer.from(payload, "base64url").toString();
}
