import type { ReactNode } from "react";

type EditorSectionProps = { title: string; description?: string; children: ReactNode };

/** Một khối của trang sửa sản phẩm: tiêu đề, mô tả ngắn, nội dung. */
export function EditorSection({ title, description, children }: EditorSectionProps) {
  return (
    <section className="border border-sand-200 bg-ivory-50 p-5 lg:p-8">
      <h2 className="type-h3">{title}</h2>
      {description && <p className="type-small mt-1 mb-6 text-stone-500">{description}</p>}
      {!description && <div className="mb-6" />}
      {children}
    </section>
  );
}
