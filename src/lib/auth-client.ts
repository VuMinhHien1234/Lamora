"use client";

import { createAuthClient } from "better-auth/react";

// Dùng ở trình duyệt: đăng nhập, đăng xuất. Địa chỉ gốc tự lấy từ trang hiện tại.
export const authClient = createAuthClient();
