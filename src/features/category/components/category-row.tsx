"use client";

import { ArrowDown, ArrowUp, Pencil, Trash2 } from "lucide-react";
import type { ReactNode } from "react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import type { CategoryWithCount } from "../types";

type CategoryRowProps = {
  category: CategoryWithCount;
  isChild?: boolean;
  isFirst: boolean;
  isLast: boolean;
  busy: boolean;
  onMove: (step: -1 | 1) => void;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

const ICON_BUTTON =
  "grid size-11 place-items-center text-ink-900 transition-colors duration-300 hover:text-rose-700 disabled:opacity-30 disabled:hover:text-ink-900";

type IconActionProps = {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: ReactNode;
};

function IconAction({ label, disabled, onClick, children }: IconActionProps) {
  return (
    <button
      type="button"
      aria-label={label}
      className={ICON_BUTTON}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

const ICON = { "aria-hidden": true, strokeWidth: 1.25, className: "size-5" } as const;

function RowActions(props: CategoryRowProps) {
  const { category, isFirst, isLast, busy } = props;
  const name = `"${category.name}"`;
  return (
    <div className="flex flex-wrap items-center gap-x-1 sm:flex-nowrap">
      <IconAction
        label={`Đưa ${name} lên trên`}
        disabled={busy || isFirst}
        onClick={() => props.onMove(-1)}
      >
        <ArrowUp {...ICON} />
      </IconAction>
      <IconAction
        label={`Đưa ${name} xuống dưới`}
        disabled={busy || isLast}
        onClick={() => props.onMove(1)}
      >
        <ArrowDown {...ICON} />
      </IconAction>
      <Switch
        checked={category.isActive}
        onChange={props.onToggle}
        disabled={busy}
        ariaLabel={`Hiển thị ${name} trên website`}
        className="mx-2"
      />
      <IconAction label={`Sửa ${name}`} disabled={busy} onClick={props.onEdit}>
        <Pencil {...ICON} />
      </IconAction>
      <IconAction label={`Xóa ${name}`} disabled={busy} onClick={props.onDelete}>
        <Trash2 {...ICON} />
      </IconAction>
    </div>
  );
}

/** Một dòng danh mục: tên, đường dẫn, số sản phẩm và các nút thao tác. */
export function CategoryRow(props: CategoryRowProps) {
  const { category, isChild } = props;
  return (
    <li
      className={cn(
        "flex flex-col gap-2 border-b border-sand-200 py-3 sm:flex-row sm:items-center sm:justify-between",
        isChild && "ml-6 border-l border-l-sand-300 pl-4 sm:ml-10",
      )}
    >
      <div className="min-w-0">
        <p className="type-body font-medium">
          {category.name}
          {!category.isActive && <span className="type-small ml-2 text-stone-500">· Đang ẩn</span>}
        </p>
        <p className="type-small text-stone-500">
          /{category.slug} · {category.productCount} sản phẩm
        </p>
      </div>
      <RowActions {...props} />
    </li>
  );
}
