import { expect, type Page } from "@playwright/test";
import { clearE2eSpamCounter, runSql } from "./db";

/** Tiền tố tên khách của mọi đơn do E2E tạo; global-teardown dựa vào đây để dọn. */
export const E2E_PREFIX = "E2E";
export const E2E_PHONE = "0912345678";
/** Sản phẩm trong dữ liệu mẫu (pnpm db:seed). */
export const SEED_PRODUCT = "/san-pham/binh-mau-don-hong-phan";

export function adminCredentials(): { email: string; password: string } {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_INITIAL_PASSWORD;
  if (!email || !password) throw new Error("Thiếu ADMIN_EMAIL / ADMIN_INITIAL_PASSWORD trong .env");
  return { email, password };
}

export async function loginAdmin(page: Page): Promise<void> {
  const { email, password } = adminCredentials();
  // Tài khoản vừa seed bị bắt đổi mật khẩu lần đầu (docs/08 mục 1); E2E bỏ qua bước đó.
  await runSql(`update "User" set "mustChangePassword" = false where lower(email) = lower($1)`, [
    email,
  ]);
  await page.goto("/admin/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Mật khẩu").fill(password);
  await page.getByRole("button", { name: /Đăng nhập/ }).click();
  await expect(page).toHaveURL(/\/admin(?!\/login)/);
}

/** Thêm sản phẩm mẫu vào giỏ rồi đặt hàng COD. Trả về mã đơn. */
export async function placeCodOrder(page: Page, customerName: string): Promise<string> {
  await clearE2eSpamCounter();
  await page.goto(SEED_PRODUCT);
  await page.getByRole("button", { name: "Thêm vào giỏ" }).first().click();
  await page.goto("/thanh-toan");
  await page.getByLabel("Họ và tên").fill(customerName);
  await page.getByLabel(/^Số điện thoại(?! người)/).fill(E2E_PHONE);
  await page.getByLabel("Tỉnh / thành phố").selectOption({ index: 1 });
  await expect(page.getByLabel("Phường / xã")).toBeEnabled();
  await page.getByLabel("Phường / xã").selectOption({ index: 1 });
  await page.getByLabel("Số nhà, tên đường").fill("12 Phố Huế");
  await page.getByRole("button", { name: /Thêm thiệp/ }).click();
  await page.getByLabel("Lời nhắn trên thiệp").fill("E2E chúc mừng sinh nhật");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Đặt hàng" }).click();
  await expect(page).toHaveURL(/dat-hang-thanh-cong\?code=/);
  const code = new URL(page.url()).searchParams.get("code");
  if (!code) throw new Error("Không đọc được mã đơn");
  return code;
}
