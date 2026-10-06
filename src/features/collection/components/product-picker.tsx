"use client";

import Image from "next/image";
import { ArrowDown, ArrowUp, Plus, X } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProductPicker, type PickerProduct } from "./use-product-picker";

const ICON = { "aria-hidden": true, strokeWidth: 1.25, className: "size-4" } as const;
const MAX_SHOWN = 30;

const statusNote = (status: string): string =>
  status === "ACTIVE" ? "" : status === "DRAFT" ? " · Nháp" : " · Ngừng bán";

function Row({ product, children }: { product: PickerProduct; children: ReactNode }) {
  return (
    <li className="flex items-center gap-3 border-b border-sand-200 py-2">
      <div className="relative aspect-[4/5] w-10 shrink-0 bg-sand-200">
        {product.previewUrl && (
          <Image
            src={product.previewUrl}
            alt=""
            fill
            unoptimized
            sizes="40px"
            className="object-cover"
          />
        )}
      </div>
      <span className="type-small min-w-0 flex-1 truncate">
        {product.name}
        <span className="text-stone-500">{statusNote(product.status)}</span>
      </span>
      {children}
    </li>
  );
}

type Picker = ReturnType<typeof useProductPicker>;

function IconButton(props: {
  label: string;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <Button
      variant="subtle"
      size="compact"
      className="w-9 px-0"
      aria-label={props.label}
      disabled={props.disabled}
      onClick={props.onClick}
    >
      {props.children}
    </Button>
  );
}

function SelectedList({ picker }: { picker: Picker }) {
  const { selected } = picker;
  return (
    <div>
      <h3 className="type-small mb-2 font-medium">Đã chọn ({selected.length})</h3>
      {selected.length === 0 && (
        <p className="type-small text-stone-500">Chưa có sản phẩm. Chọn từ danh sách bên cạnh.</p>
      )}
      <ul>
        {selected.map((p, index) => (
          <Row key={p.id} product={p}>
            <IconButton
              label={`Đưa ${p.name} lên trên`}
              disabled={index === 0}
              onClick={() => picker.move(p.id, -1)}
            >
              <ArrowUp {...ICON} />
            </IconButton>
            <IconButton
              label={`Đưa ${p.name} xuống dưới`}
              disabled={index === selected.length - 1}
              onClick={() => picker.move(p.id, 1)}
            >
              <ArrowDown {...ICON} />
            </IconButton>
            <IconButton label={`Bỏ ${p.name}`} onClick={() => picker.remove(p.id)}>
              <X {...ICON} />
            </IconButton>
          </Row>
        ))}
      </ul>
      {picker.dirty && (
        <div className="mt-4">
          <Button
            variant="primary"
            size="compact"
            loading={picker.saving}
            onClick={() => void picker.save()}
          >
            Lưu sản phẩm
          </Button>
        </div>
      )}
    </div>
  );
}

function CandidateList({ picker }: { picker: Picker }) {
  const { candidates } = picker;
  return (
    <div>
      <Input
        label="Tìm sản phẩm để thêm"
        type="search"
        value={picker.query}
        placeholder="Gõ tên sản phẩm"
        onChange={(e) => picker.setQuery(e.target.value)}
      />
      <ul className="mt-3">
        {candidates.slice(0, MAX_SHOWN).map((p) => (
          <Row key={p.id} product={p}>
            <Button
              variant="secondary"
              size="compact"
              aria-label={`Thêm ${p.name}`}
              onClick={() => picker.add(p.id)}
            >
              <Plus {...ICON} /> Thêm
            </Button>
          </Row>
        ))}
      </ul>
      {candidates.length === 0 && (
        <p className="type-small mt-3 text-stone-500">Không có sản phẩm nào để thêm.</p>
      )}
      {candidates.length > MAX_SHOWN && (
        <p className="type-small mt-3 text-stone-500">
          Còn {candidates.length - MAX_SHOWN} sản phẩm nữa, gõ tên để lọc.
        </p>
      )}
    </div>
  );
}

type PickerProps = { collectionId: string; products: PickerProduct[]; selectedIds: string[] };

/** Chọn sản phẩm cho bộ sưu tập: tìm, thêm, đổi thứ tự, bỏ. Lưu một lần bằng nút "Lưu sản phẩm". */
export function ProductPicker({ collectionId, products, selectedIds }: PickerProps) {
  const picker = useProductPicker(collectionId, products, selectedIds);
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-2">
      <SelectedList picker={picker} />
      <CandidateList picker={picker} />
    </div>
  );
}
