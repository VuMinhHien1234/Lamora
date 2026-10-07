import { describe, expect, it, vi } from "vitest";
import { isAppError } from "@/lib/errors";

vi.mock("./repository", () => ({ markPasswordChanged: vi.fn() }));

import { assertAdmin } from "./service";

const admin = {
  id: "u1",
  email: "a@b.vn",
  name: "Chủ shop",
  role: "ADMIN",
  mustChangePassword: false,
};

function codeOf(fn: () => unknown): string | undefined {
  try {
    fn();
  } catch (error) {
    return isAppError(error) ? error.code : "OTHER";
  }
  return undefined;
}

describe("assertAdmin", () => {
  it("trả thông tin admin khi hợp lệ", () => {
    expect(assertAdmin(admin)).toEqual({
      id: "u1",
      email: "a@b.vn",
      name: "Chủ shop",
      mustChangePassword: false,
    });
  });

  it("chưa đăng nhập → UNAUTHORIZED", () => {
    expect(codeOf(() => assertAdmin(null))).toBe("UNAUTHORIZED");
    expect(codeOf(() => assertAdmin(undefined))).toBe("UNAUTHORIZED");
  });

  it("không phải ADMIN → UNAUTHORIZED", () => {
    expect(codeOf(() => assertAdmin({ ...admin, role: "STAFF" }))).toBe("UNAUTHORIZED");
    expect(codeOf(() => assertAdmin({ ...admin, role: null }))).toBe("UNAUTHORIZED");
  });

  it("còn bị bắt đổi mật khẩu → PASSWORD_CHANGE_REQUIRED", () => {
    const mustChange = { ...admin, mustChangePassword: true };
    expect(codeOf(() => assertAdmin(mustChange))).toBe("PASSWORD_CHANGE_REQUIRED");
  });

  it("đang ở trang đổi mật khẩu thì được qua", () => {
    const mustChange = { ...admin, mustChangePassword: true };
    expect(assertAdmin(mustChange, { allowPasswordChange: true }).id).toBe("u1");
  });
});
