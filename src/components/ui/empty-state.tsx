import type { ReactNode } from "react";
import { GoldRule } from "./divider";

type EmptyStateProps = {
  title: string;
  description?: string;
  /** Một nút hoặc liên kết hành động. */
  action?: ReactNode;
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-16 text-center">
      <GoldRule className="mb-2" />
      <h2 className="type-h3">{title}</h2>
      {description && <p className="type-body text-stone-500">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
