import { expect, test } from "@playwright/test";
import { E2E_PHONE, E2E_PREFIX, placeCodOrder } from "./helpers";

test.describe("Khách hàng", () => {
  test("xem sản phẩm, lọc theo giá và sắp xếp trên URL", async ({ page }) => {
    await page.goto("/san-pham?gia=0-500000&sap-xep=gia-tang");
    await expect(page.getByRole("heading", { name: "Tất cả sản phẩm" })).toBeVisible();
    await expect(page.getByRole("link", { name: /Bỏ lọc/ })).toBeVisible();
    await page.getByRole("link", { name: /Bỏ lọc/ }).click();
    await expect(page).toHaveURL(/\/san-pham(\?sap-xep=gia-tang)?$/);
  });

  test("tìm kiếm và trang danh mục", async ({ page }) => {
    await page.goto("/tim-kiem?q=hoa");
    await expect(page.getByRole("heading", { name: /Kết quả cho/ })).toBeVisible();
    await page.goto("/danh-muc/binh-hoa-cam-san");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Bình hoa");
  });

  test("slug không tồn tại → 404", async ({ page }) => {
    const response = await page.goto("/danh-muc/khong-co-danh-muc-nay");
    expect(response?.status()).toBe(404);
    await expect(page.getByText("Không tìm thấy trang")).toBeVisible();
  });

  test("đặt hàng COD rồi tra cứu đơn bằng mã + số điện thoại", async ({ page }) => {
    const code = await placeCodOrder(page, `${E2E_PREFIX} Khách tra cứu`);
    await expect(page.getByText(code).first()).toBeVisible();

    await page.goto("/tra-cuu-don");
    await page.getByLabel(/Mã đơn/).fill(code);
    await page.getByLabel(/Số điện thoại/).fill("0900000009");
    await page.getByRole("button", { name: "Tra cứu" }).click();
    await expect(page.getByText("Không tìm thấy đơn")).toBeVisible();

    await page.getByLabel(/Số điện thoại/).fill(E2E_PHONE);
    await page.getByRole("button", { name: "Tra cứu" }).click();
    await expect(page).toHaveURL(/tra-cuu-don\?ma=/);
    await expect(page.getByText("Chờ xác nhận").first()).toBeVisible();
  });

  test("trang chính sách và sitemap/robots", async ({ page, request }) => {
    await page.goto("/chinh-sach-van-chuyen");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Chính sách vận chuyển");
    const robots = await (await request.get("/robots.txt")).text();
    expect(robots).toContain("Disallow: /admin");
    const sitemap = await (await request.get("/sitemap.xml")).text();
    expect(sitemap).toContain("/san-pham");
    expect(sitemap).not.toContain("/admin");
  });
});
