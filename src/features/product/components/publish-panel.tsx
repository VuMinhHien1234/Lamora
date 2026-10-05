"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { useToast } from "@/components/ui/toast";
import { setProductStatus } from "../actions";
import { listMissingForSale } from "../rules";
import type { ProductDetail, ProductStatus } from "../types";

type Action = { label: string; status: ProductStatus; variant: "primary" | "secondary" };

const ACTIONS: Record<ProductStatus, Action[]> = {
  DRAFT: [
    { label: "Đăng bán", status: "ACTIVE", variant: "primary" },
    { label: "Ngừng bán", status: "ARCHIVED", variant: "secondary" },
  ],
  ACTIVE: [
    { label: "Chuyển về nháp", status: "DRAFT", variant: "secondary" },
    { label: "Ngừng bán", status: "ARCHIVED", variant: "secondary" },
  ],
  ARCHIVED: [
    { label: "Đăng bán lại", status: "ACTIVE", variant: "primary" },
    { label: "Chuyển về nháp", status: "DRAFT", variant: "secondary" },
  ],
};

type PublishPanelProps = { product: ProductDetail; dirty: boolean };

function Checklist({ product }: { product: ProductDetail }) {
  const missing = listMissingForSale({
    imageCount: product.images.length,
    variants: product.variants,
  });
  if (product.status === "ACTIVE" || missing.length === 0) return null;
  return (
    <div className="mt-4">
      <p className="type-small text-stone-500">Để đăng bán, sản phẩm còn thiếu:</p>
      <ul className="type-small mt-1 list-disc pl-5 text-warning-700">
        {missing.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

/** Khung đăng bán: trạng thái hiện tại, nút đổi trạng thái, danh sách điều kiện còn thiếu. */
export function PublishPanel({ product, dirty }: PublishPanelProps) {
  const router = useRouter();
  const toast = useToast();
  const [busy, setBusy] = useState<ProductStatus | null>(null);

  async function change(status: ProductStatus): Promise<void> {
    setBusy(status);
    const result = await setProductStatus({ id: product.id, status });
    setBusy(null);
    toast(result.ok ? "Đã đổi trạng thái" : result.error.message);
    router.refresh();
  }

  return (
    <div className="border border-sand-200 bg-ivory-50 p-5">
      <div className="flex flex-wrap items-center gap-4">
        <StatusBadge kind="product" status={product.status} />
        {ACTIONS[product.status].map((action) => (
          <Button
            key={action.status}
            variant={action.variant}
            size="compact"
            disabled={dirty}
            loading={busy === action.status}
            onClick={() => void change(action.status)}
          >
            {action.label}
          </Button>
        ))}
      </div>
      {dirty && (
        <p className="type-small mt-3 text-stone-500">Hãy lưu thay đổi trước khi đổi trạng thái.</p>
      )}
      <Checklist product={product} />
    </div>
  );
}
