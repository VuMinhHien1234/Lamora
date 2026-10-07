"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/components/ui/toast";
import type { ActionResult } from "@/lib/result";

/** Chạy một thao tác quản trị: khóa nút khi đang chạy, báo kết quả, làm mới trang. Trả về true nếu thành công. */
export function useOrderAction(): {
  busy: boolean;
  run: (action: () => Promise<ActionResult<unknown>>, success: string) => Promise<boolean>;
} {
  const router = useRouter();
  const toast = useToast();
  const [busy, setBusy] = useState(false);

  async function run(
    action: () => Promise<ActionResult<unknown>>,
    success: string,
  ): Promise<boolean> {
    setBusy(true);
    const result = await action();
    setBusy(false);
    toast(result.ok ? success : result.error.message, result.ok ? "default" : "error");
    if (result.ok) router.refresh();
    return result.ok;
  }

  return { busy, run };
}
