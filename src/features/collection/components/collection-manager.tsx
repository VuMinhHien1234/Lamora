"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useState } from "react";
import { AdminPageHeader } from "@/components/layout/admin-page-header";
import { buttonStyles } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import type { CollectionWithCount } from "../types";
import { CollectionCard } from "./collection-card";
import { useCollectionActions } from "./use-collection-actions";

/** Màn hình M8: danh sách bộ sưu tập, bật/tắt, đổi thứ tự, xóa (docs/06 mục 10). */
export function CollectionManager({ collections }: { collections: CollectionWithCount[] }) {
  const actions = useCollectionActions();
  const [toDelete, setToDelete] = useState<CollectionWithCount | null>(null);
  return (
    <>
      <AdminPageHeader
        title="Bộ sưu tập"
        description="Nhóm sản phẩm theo dịp (Tết, 8/3, quà tặng…). Bộ sưu tập bật “Trang chủ” sẽ hiện ở trang chủ."
        actions={
          <Link
            href="/admin/bo-suu-tap/moi"
            className={buttonStyles({ variant: "primary", size: "compact" })}
          >
            <Plus aria-hidden strokeWidth={1.25} className="size-4" /> Thêm bộ sưu tập
          </Link>
        }
      />
      {collections.length === 0 ? (
        <EmptyState
          title="Chưa có bộ sưu tập nào"
          description="Thêm bộ sưu tập đầu tiên để gom sản phẩm theo dịp."
        />
      ) : (
        <ul className="border-t border-sand-200">
          {collections.map((item, index) => (
            <CollectionCard
              key={item.id}
              collection={item}
              isFirst={index === 0}
              isLast={index === collections.length - 1}
              busy={actions.busyId === item.id}
              onMove={(step) => void actions.move(collections, index, step)}
              onToggleActive={() => void actions.setActive(item, { isActive: !item.isActive })}
              onToggleHome={() => void actions.setHome(item, { showOnHome: !item.showOnHome })}
              onDelete={() => setToDelete(item)}
            />
          ))}
        </ul>
      )}
      <DeleteDialog
        collection={toDelete}
        busy={actions.busyId === toDelete?.id}
        onCancel={() => setToDelete(null)}
        onConfirm={(item) => void actions.remove(item).then(() => setToDelete(null))}
      />
    </>
  );
}

type DeleteDialogProps = {
  collection: CollectionWithCount | null;
  busy: boolean;
  onCancel: () => void;
  onConfirm: (collection: CollectionWithCount) => void;
};

function DeleteDialog({ collection, busy, onCancel, onConfirm }: DeleteDialogProps) {
  return (
    <ConfirmDialog
      open={collection !== null}
      danger
      title="Xóa bộ sưu tập?"
      description={`Bộ sưu tập "${collection?.name ?? ""}" sẽ bị xóa. Các sản phẩm bên trong vẫn được giữ nguyên.`}
      confirmLabel="Xóa bộ sưu tập"
      loading={busy}
      onCancel={onCancel}
      onConfirm={() => {
        if (collection) onConfirm(collection);
      }}
    />
  );
}
