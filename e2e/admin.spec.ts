import { expect, test } from "@playwright/test";
import { E2E_PREFIX, loginAdmin, placeCodOrder } from "./helpers";

test.describe("Quản trị", () => {
  test("chưa đăng nhập thì bị chuyển sang trang đăng nhập", async ({ page }) => {
    await page.goto("/admin/don-hang");
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("xem tổng quan sau khi đăng nhập", async ({ page }) => {
    await loginAdmin(page);
    await page.goto("/admin");
    await expect(page.getByRole("heading", { name: "Tổng quan" })).toBeVisible();
    await expect(page.getByText("Doanh thu hôm nay")).toBeVisible();
  });

  test("xử lý đơn: xác nhận → giao hàng → đã giao (COD tự thành đã thanh toán)", async ({
    page,
    browser,
  }) => {
    const customer = await browser.newContext();
    const code = await placeCodOrder(await customer.newPage(), `${E2E_PREFIX} Khách admin`);
    await customer.close();

    await loginAdmin(page);
    await page.goto(`/admin/don-hang?q=${code}`);
    await page.getByRole("link", { name: code }).first().click();
    await expect(page.getByText("Chờ xác nhận").first()).toBeVisible();
    await expect(page.getByText("E2E chúc mừng sinh nhật")).toBeVisible();

    await page.getByRole("button", { name: "Xác nhận đơn" }).click();
    await expect(page.getByText("Đã xác nhận").first()).toBeVisible();

    await page.getByRole("button", { name: "Giao hàng" }).click();
    const dialog = page.locator("dialog[open]");
    await dialog.getByLabel("Đơn vị vận chuyển").fill("Viettel Post");
    await dialog.getByLabel("Mã vận đơn").fill("E2E123");
    await dialog.getByRole("button", { name: "Bắt đầu giao" }).click();
    await expect(page.getByText("Đang giao").first()).toBeVisible();

    await page.getByRole("button", { name: "Đã giao" }).click();
    await expect(page.getByText("Đã thanh toán").first()).toBeVisible();
  });

  test("hủy đơn bắt buộc có lý do", async ({ page, browser }) => {
    const customer = await browser.newContext();
    const code = await placeCodOrder(await customer.newPage(), `${E2E_PREFIX} Khách hủy`);
    await customer.close();

    await loginAdmin(page);
    await page.goto(`/admin/don-hang?q=${code}`);
    await page.getByRole("link", { name: code }).first().click();
    await page.getByRole("button", { name: "Hủy đơn" }).click();
    const dialog = page.locator("dialog[open]");
    await dialog.getByLabel(/Lý do hủy/).fill("Khách đổi ý");
    await dialog.getByRole("button", { name: "Hủy đơn" }).click();
    await expect(page.getByText("Đã hủy").first()).toBeVisible();
  });
});
