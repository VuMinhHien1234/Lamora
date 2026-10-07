import { defineConfig, devices } from "@playwright/test";

// Đọc .env giống Next.js để test dùng cùng tài khoản admin và database local.
try {
  process.loadEnvFile(".env");
} catch {
  // Không có .env: dùng biến môi trường của hệ thống (CI).
}

const PORT = 3000;
const BASE_URL = process.env.E2E_BASE_URL ?? `http://localhost:${PORT}`;

// Chạy tuần tự (workers: 1): các test dùng chung một database và tạo đơn hàng thật.
// CHỈ chạy trên database local/dev. Teardown xóa các đơn "E2E …" và trả lại tồn kho.
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  timeout: 90_000,
  expect: { timeout: 15_000 },
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  globalTeardown: "./e2e/global-teardown.ts",
  use: {
    baseURL: BASE_URL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    locale: "vi-VN",
  },
  projects: [
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 900 } },
    },
    { name: "mobile", use: { ...devices["Pixel 7"], viewport: { width: 360, height: 800 } } },
  ],
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : { command: "pnpm dev", url: BASE_URL, reuseExistingServer: true, timeout: 180_000 },
});
