import { requireAdmin } from "@/features/auth";
import * as service from "./service";
import type { AdminSummary } from "./types";

/** 🔐 Số liệu tổng quan cho M2. */
export async function getAdminSummary(): Promise<AdminSummary> {
  await requireAdmin();
  return service.getAdminSummary();
}

/** 🌐 Dùng cho `/api/health`: không trả dữ liệu, chỉ ném lỗi khi database không sống. */
export async function checkHealth(): Promise<void> {
  await service.checkHealth();
}
