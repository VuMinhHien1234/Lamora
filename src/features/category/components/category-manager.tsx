"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { AdminPageHeader } from "@/components/layout/admin-page-header";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { useToast } from "@/components/ui/toast";
import type { CategoryNode, CategoryWithCount } from "../types";
import { CategoryFormDialog } from "./category-form-dialog";
import { CategoryRow } from "./category-row";
import { useCategoryActions } from "./use-category-actions";

type FormState = { open: boolean; editing: CategoryWithCount | null };

/** Trạng thái của màn hình: hộp thoại thêm/sửa, hộp xác nhận xóa, và kiểm tra "có được xóa không". */
function useManagerState() {
  const toast = useToast();
  const [form, setForm] = useState<FormState>({ open: false, editing: null });
  const [toDelete, setToDelete] = useState<CategoryWithCount | null>(null);

  function askDelete(category: CategoryWithCount, childCount: number): void {
    if (category.productCount > 0) {
      toast(
        `Danh mục còn ${category.productCount} sản phẩm. Hãy chuyển sản phẩm sang danh mục khác trước.`,
      );
    } else if (childCount > 0) {
      toast(`Danh mục còn ${childCount} danh mục con. Hãy xóa hoặc chuyển danh mục con trước.`);
    } else {
      setToDelete(category);
    }
  }

  return { form, setForm, toDelete, setToDelete, askDelete };
}

type ListProps = {
  tree: CategoryNode[];
  actions: ReturnType<typeof useCategoryActions>;
  onEdit: (category: CategoryWithCount) => void;
  onDelete: (category: CategoryWithCount, childCount: number) => void;
};

type RowSpec = {
  item: CategoryWithCount;
  siblings: CategoryWithCount[];
  index: number;
  childCount: number;
};

function CategoryList({ tree, actions, onEdit, onDelete }: ListProps) {
  function row({ item, siblings, index, childCount }: RowSpec) {
    return (
      <CategoryRow
        key={item.id}
        category={item}
        isChild={item.parentId !== null}
        isFirst={index === 0}
        isLast={index === siblings.length - 1}
        busy={actions.busyId === item.id}
        onMove={(step) => void actions.move(siblings, index, step)}
        onToggle={() => void actions.toggleActive(item)}
        onEdit={() => onEdit(item)}
        onDelete={() => onDelete(item, childCount)}
      />
    );
  }
  return (
    <ul className="border-t border-sand-200">
      {tree.flatMap((node, index) => [
        row({ item: node, siblings: tree, index, childCount: node.children.length }),
        ...node.children.map((child, i) =>
          row({ item: child, siblings: node.children, index: i, childCount: 0 }),
        ),
      ])}
    </ul>
  );
}

/** Màn hình M7: cây danh mục, thêm/sửa/xóa, bật/tắt, đổi thứ tự (docs/06 mục 9). */
export function CategoryManager({ tree }: { tree: CategoryNode[] }) {
  const actions = useCategoryActions();
  const { form, setForm, toDelete, setToDelete, askDelete } = useManagerState();
  const editingNode = tree.find((node) => node.id === form.editing?.id);
  return (
    <>
      <AdminPageHeader
        title="Danh mục"
        description="Nhóm sản phẩm hiển thị trên menu website. Tối đa một cấp danh mục con."
        actions={
          <Button
            variant="primary"
            size="compact"
            onClick={() => setForm({ open: true, editing: null })}
          >
            <Plus aria-hidden strokeWidth={1.25} className="size-4" /> Thêm danh mục
          </Button>
        }
      />
      {tree.length === 0 ? (
        <EmptyCategories />
      ) : (
        <CategoryList
          tree={tree}
          actions={actions}
          onEdit={(editing) => setForm({ open: true, editing })}
          onDelete={askDelete}
        />
      )}
      <CategoryFormDialog
        open={form.open}
        editing={form.editing}
        parentOptions={tree}
        hasChildren={(editingNode?.children.length ?? 0) > 0}
        onClose={() => setForm((state) => ({ ...state, open: false }))}
      />
      <DeleteCategoryDialog
        category={toDelete}
        busy={actions.busyId === toDelete?.id}
        onCancel={() => setToDelete(null)}
        onConfirm={(category) => void actions.remove(category).then(() => setToDelete(null))}
      />
    </>
  );
}

function EmptyCategories() {
  return (
    <EmptyState
      title="Chưa có danh mục nào"
      description="Thêm danh mục đầu tiên để bắt đầu phân loại sản phẩm."
    />
  );
}

type DeleteDialogProps = {
  category: CategoryWithCount | null;
  busy: boolean;
  onCancel: () => void;
  onConfirm: (category: CategoryWithCount) => void;
};

function DeleteCategoryDialog({ category, busy, onCancel, onConfirm }: DeleteDialogProps) {
  return (
    <ConfirmDialog
      open={category !== null}
      danger
      title="Xóa danh mục?"
      description={`Danh mục "${category?.name ?? ""}" sẽ bị xóa vĩnh viễn.`}
      confirmLabel="Xóa danh mục"
      loading={busy}
      onCancel={onCancel}
      onConfirm={() => {
        if (category) onConfirm(category);
      }}
    />
  );
}
