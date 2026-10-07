"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/components/ui/toast";
import { deleteCollection, reorderCollections, updateCollection } from "../actions";
import type { CollectionRecord } from "../types";

/** Chuyển bộ sưu tập thành dữ liệu form để gửi lại server (giữ nguyên các trường khác). */
export function toInput(collection: CollectionRecord): Record<string, unknown> {
  return {
    id: collection.id,
    name: collection.name,
    slug: collection.slug,
    description: collection.description ?? "",
    imagePublicId: collection.imagePublicId ?? "",
    isActive: collection.isActive,
    showOnHome: collection.showOnHome,
  };
}

type Outcome = { ok: boolean; message?: string };

/** Thao tác nhanh trên danh sách: bật/tắt, hiện trang chủ, đổi thứ tự, xóa. Xong tự tải lại. */
export function useCollectionActions() {
  const router = useRouter();
  const toast = useToast();
  const [busyId, setBusyId] = useState<string | null>(null);

  async function run(id: string, task: () => Promise<Outcome>, done?: string): Promise<boolean> {
    setBusyId(id);
    const result = await task();
    setBusyId(null);
    if (!result.ok) {
      toast(result.message ?? "Có lỗi xảy ra, vui lòng thử lại.", "error");
      return false;
    }
    if (done) toast(done);
    router.refresh();
    return true;
  }

  const patch = (c: CollectionRecord, change: Partial<CollectionRecord>): Promise<boolean> =>
    run(c.id, async () => {
      const result = await updateCollection({ ...toInput(c), ...change });
      return result.ok ? { ok: true } : { ok: false, message: result.error.message };
    });

  async function move(list: CollectionRecord[], index: number, step: -1 | 1): Promise<void> {
    const moved = list[index];
    const target = index + step;
    if (!moved || target < 0 || target >= list.length) return;
    const order = list.map((item) => item.id);
    order.splice(index, 1);
    order.splice(target, 0, moved.id);
    await run(moved.id, async () => {
      const result = await reorderCollections(order.map((id, sortOrder) => ({ id, sortOrder })));
      return result.ok ? { ok: true } : { ok: false, message: result.error.message };
    });
  }

  function remove(collection: CollectionRecord): Promise<boolean> {
    return run(
      collection.id,
      async () => {
        const result = await deleteCollection({ id: collection.id });
        return result.ok ? { ok: true } : { ok: false, message: result.error.message };
      },
      "Đã xóa bộ sưu tập",
    );
  }

  return { busyId, move, remove, setActive: patch, setHome: patch };
}
