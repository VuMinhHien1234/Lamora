"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToast } from "@/components/ui/toast";
import { deleteCollection } from "../actions";
import type { CollectionDetail } from "../types";
import { CollectionForm } from "./collection-form";
import { ProductPicker } from "./product-picker";
import type { PickerProduct } from "./use-product-picker";

type EditorProps = {
  /** null: thêm mới (chưa chọn được sản phẩm cho tới khi tạo xong). */
  collection: CollectionDetail | null;
  products: PickerProduct[];
};

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border border-sand-200 bg-ivory-50 p-5 lg:p-8">
      <h2 className="type-h3">{title}</h2>
      {hint && <p className="type-small mt-1 text-stone-500">{hint}</p>}
      <div className="mt-6">{children}</div>
    </section>
  );
}

function useDelete(collection: CollectionDetail | null) {
  const router = useRouter();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  async function confirm(): Promise<void> {
    if (!collection) return;
    setBusy(true);
    const result = await deleteCollection({ id: collection.id });
    setBusy(false);
    if (!result.ok) return toast(result.error.message, "error");
    toast("Đã xóa bộ sưu tập");
    router.push("/admin/bo-suu-tap");
  }
  return { open, setOpen, busy, confirm };
}

/** Màn hình M9: thông tin bộ sưu tập, chọn sản phẩm, xóa (docs/06 mục 10). */
export function CollectionEditor({ collection, products }: EditorProps) {
  const del = useDelete(collection);
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-6">
      <div>
        <Link href="/admin/bo-suu-tap" className="type-small link-underline">
          ‹ Bộ sưu tập
        </Link>
        <h1 className="type-h2">{collection ? collection.name : "Thêm bộ sưu tập"}</h1>
      </div>
      <Section title="Thông tin">
        <CollectionForm collection={collection} />
      </Section>
      {collection && (
        <Section
          title="Sản phẩm trong bộ sưu tập"
          hint="Thứ tự ở đây là thứ tự khách nhìn thấy. Sản phẩm nháp hoặc ngừng bán sẽ không hiện trên website."
        >
          <ProductPicker
            collectionId={collection.id}
            products={products}
            selectedIds={collection.products.map((p) => p.id)}
          />
        </Section>
      )}
      {collection && (
        <div>
          <Button variant="danger" onClick={() => del.setOpen(true)}>
            Xóa bộ sưu tập
          </Button>
        </div>
      )}
      <ConfirmDialog
        open={del.open}
        danger
        title="Xóa bộ sưu tập?"
        description="Bộ sưu tập sẽ bị xóa. Các sản phẩm bên trong vẫn được giữ nguyên."
        confirmLabel="Xóa bộ sưu tập"
        loading={del.busy}
        onCancel={() => del.setOpen(false)}
        onConfirm={() => void del.confirm()}
      />
    </div>
  );
}
