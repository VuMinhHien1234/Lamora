import * as service from "./service";
import type { CleanupResult } from "./service";

/** Chạy dọn dẹp. KHÔNG tự kiểm tra quyền: chỉ gọi từ route `/api/cron/cleanup` đã xác thực bằng CRON_SECRET. */
export function cleanup(): Promise<CleanupResult> {
  return service.runCleanup();
}
