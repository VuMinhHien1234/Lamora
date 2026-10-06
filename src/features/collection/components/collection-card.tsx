"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUp, Pencil, Trash2 } from "lucide-react";
import type { ReactNode } from "react";
import { Switch } from "@/components/ui/switch";
import type { CollectionWithCount } from "../types";

type CollectionCardProps = {
  collection: CollectionWithCount;
  isFirst: boolean;
  isLast: boolean;
  busy: boolean;
  onMove: (step: -1 | 1) => void;
  onToggleActive: () => void;
  onToggleHome: () => void;
  onDelete: () => void;
};

const ICON_BUTTON =
  "grid size-11 place-items-center text-ink-900 transition-colors duration-300 hover:text-rose-700 disabled:opacity-30 disabled:hover:text-ink-900";
const ICON = { "aria-hidden": true, strokeWidth: 1.25, className: "size-5" } as const;

function IconButton(props: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={props.label}
      className={ICON_BUTTON}
      disabled={props.disabled}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}

function Thumb({ collection }: { collection: CollectionWithCount }) {
  const url = collection.imagePreviewUrl;
  return (
    <div className="relative aspect-[4/5] w-16 shrink-0 bg-sand-200">
      {url && (
        <Image
          src={url}
          alt={collection.name}
          fill
          unoptimized
          sizes="64px"
          className="object-cover"
        />
      )}
    </div>
  );
}

function Toggles(props: CollectionCardProps) {
  const { collection, busy } = props;
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
      <label className="type-small flex items-center gap-2">
        <Switch
          checked={collection.showOnHome}
          onChange={props.onToggleHome}
          disabled={busy}
          ariaLabel={`Hiện "${collection.name}" trên trang chủ`}
        />
        Trang chủ
      </label>
      <label className="type-small flex items-center gap-2">
        <Switch
          checked={collection.isActive}
          onChange={props.onToggleActive}
          disabled={busy}
          ariaLabel={`Hiển thị "${collection.name}" trên website`}
        />
        Hiển thị
      </label>
    </div>
  );
}

function Actions(props: CollectionCardProps) {
  const name = `"${props.collection.name}"`;
  const { busy } = props;
  return (
    <div className="flex items-center">
      <IconButton
        label={`Đưa ${name} lên trên`}
        disabled={busy || props.isFirst}
        onClick={() => props.onMove(-1)}
      >
        <ArrowUp {...ICON} />
      </IconButton>
      <IconButton
        label={`Đưa ${name} xuống dưới`}
        disabled={busy || props.isLast}
        onClick={() => props.onMove(1)}
      >
        <ArrowDown {...ICON} />
      </IconButton>
      <Link
        href={`/admin/bo-suu-tap/${props.collection.id}`}
        aria-label={`Sửa ${name}`}
        className={ICON_BUTTON}
      >
        <Pencil {...ICON} />
      </Link>
      <IconButton label={`Xóa ${name}`} disabled={busy} onClick={props.onDelete}>
        <Trash2 {...ICON} />
      </IconButton>
    </div>
  );
}

/** Một bộ sưu tập ở danh sách M8: ảnh, tên, số sản phẩm, công tắc và thao tác. */
export function CollectionCard(props: CollectionCardProps) {
  const { collection } = props;
  return (
    <li className="flex flex-col gap-3 border-b border-sand-200 py-4 sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <Thumb collection={collection} />
        <div className="min-w-0">
          <Link
            href={`/admin/bo-suu-tap/${collection.id}`}
            className="type-body link-underline font-medium"
          >
            {collection.name}
          </Link>
          <p className="type-small text-stone-500">
            /{collection.slug} · {collection.productCount} sản phẩm
          </p>
        </div>
      </div>
      <Toggles {...props} />
      <Actions {...props} />
    </li>
  );
}
