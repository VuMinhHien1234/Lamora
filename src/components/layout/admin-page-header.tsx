import type { ReactNode } from "react";

type AdminPageHeaderProps = {
  title: string;
  description?: string;
  /** Nút hành động chính của trang, ví dụ "+ Thêm sản phẩm". */
  actions?: ReactNode;
};

export function AdminPageHeader({ title, description, actions }: AdminPageHeaderProps) {
  return (
    <header className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-sand-200 pb-5">
      <div>
        <h1 className="type-h2">{title}</h1>
        {description && <p className="type-small mt-1 text-stone-500">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </header>
  );
}
