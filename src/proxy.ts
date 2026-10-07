import { getSessionCookie } from "better-auth/cookies";
import { NextResponse, type NextRequest } from "next/server";

const LOGIN_PATH = "/admin/login";

// Chặn nhanh /admin khi chưa có cookie đăng nhập. Đây chỉ là lớp ngoài: mọi query/action
// quản trị vẫn phải tự gọi requireAdmin() ở server (docs/08 mục 1).
export function proxy(request: NextRequest): NextResponse {
  const { pathname, search } = request.nextUrl;

  if (pathname !== LOGIN_PATH && !getSessionCookie(request)) {
    const loginUrl = new URL(LOGIN_PATH, request.url);
    loginUrl.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  // Chuyển đường dẫn hiện tại cho layout admin (layout không tự biết mình đang ở trang nào).
  const headers = new Headers(request.headers);
  headers.set("x-admin-path", pathname);
  return NextResponse.next({ request: { headers } });
}

export const config = { matcher: ["/admin/:path*"] };
