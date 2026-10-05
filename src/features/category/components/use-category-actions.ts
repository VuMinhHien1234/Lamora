"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/components/ui/toast";
import { deleteCategory, reorderCategories, updateCategory } from "../actions";
import type { CategoryWithCount } from "../types";

/** Chuyển một danh mục thành dữ liệu form để gửi lại cho server (giữ nguyên các trường khác). */
export function toInput(category: CategoryWithCount): Record<string, unknown> {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description ?? "",
    imagePublicId: category.imagePublicId ?? "",
    parentId: category.parentId ?? "",
    isActive: category.isActive,
    seoTitle: category.seoTitle ?? "",
    seoDescription: category.seoDescription ?? "",
  };
}

type Result = { ok: boolean };

/** Các thao tác nhanh trên danh sách: bật/tắt, đổi thứ tự, xóa. Làm xong tự tải lại dữ liệu. */
export function useCategoryActions() {
  const router = useRouter();
  const toast = useToast();
  const [busyId, setBusyId] = useState<string | null>(null);

  async function run(
    id: string,
    task: () => Promise<{ ok: boolean; message?: string }>,
    done?: string,
  ): Promise<Result> {
    setBusyId(id);
    const result = await task();
    setBusyId(null);
    if (!result.ok) {
      toast(result.message ?? "Có lỗi xảy ra, vui lòng thử lại.");
      return { ok: false };
    }
    if (done) toast(done);
    router.refresh();
    return { ok: true };
  }

  async function toggleActive(category: CategoryWithCount): Promise<void> {
    await run(category.id, async () => {
      const result = await updateCategory({ ...toInput(category), isActive: !category.isActive });
      return result.ok ? { ok: true } : { ok: false, message: result.error.message };
    });
  }

  async function move(siblings: CategoryWithCount[], index: number, step: -1 | 1): Promise<void> {
    const target = index + step;
    const moved = siblings[index];
    if (!moved || target < 0 || target >= siblings.length) return;
    const order = siblings.map((item) => item.id);
    order.splice(index, 1);
    order.splice(target, 0, moved.id);
    await run(moved.id, async () => {
      const result = await reorderCategories(order.map((id, sortOrder) => ({ id, sortOrder })));
      return result.ok ? { ok: true } : { ok: false, message: result.error.message };
    });
  }

  async function remove(category: CategoryWithCount): Promise<Result> {
    return run(
      category.id,
      async () => {
        const result = await deleteCategory({ id: category.id });
        return result.ok ? { ok: true } : { ok: false, message: result.error.message };
      },
      "Đã xóa danh mục",
    );
  }

  return { busyId, toggleActive, move, remove };
}
