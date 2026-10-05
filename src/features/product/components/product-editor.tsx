"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { ProductDetail } from "../types";
import { EditorSection } from "./editor-section";
import { GeneralFields } from "./general-fields";
import type { GeneralValues } from "./general-form";
import type { CategoryOption } from "./product-filters";
import { PublishPanel } from "./publish-panel";
import { SeoFields } from "./seo-fields";
import { useProductEditor } from "./use-product-editor";
import { VariantsEditor } from "./variants-editor";

type ProductEditorProps = {
  /** null: thêm mới. */
  product: ProductDetail | null;
  categories: CategoryOption[];
};

function SaveBar({ title, dirty, saving }: { title: string; dirty: boolean; saving: boolean }) {
  return (
    <div className="sticky top-14 z-20 -mx-4 mb-6 flex items-center justify-between gap-4 border-b border-sand-200 bg-ivory-100/95 px-4 py-3 backdrop-blur lg:top-0 lg:-mx-8 lg:px-8">
      <div className="min-w-0">
        <Link href="/admin/san-pham" className="type-small link-underline">
          ‹ Sản phẩm
        </Link>
        <h1 className="type-h3 truncate">{title}</h1>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        {dirty && <span className="type-small hidden text-warning-700 sm:inline">Chưa lưu</span>}
        <Button type="submit" variant="primary" size="compact" loading={saving}>
          Lưu
        </Button>
      </div>
    </div>
  );
}

function PlaceholderBlocks() {
  return (
    <>
      <EditorSection
        title="Ảnh sản phẩm"
        description="Tải ảnh, sắp xếp, gắn với màu — sẽ có ở bước kế tiếp (G4). Cần ít nhất 1 ảnh mới đăng bán được."
      >
        <p className="type-small text-stone-500">Chưa khả dụng.</p>
      </EditorSection>
      <EditorSection
        title="Bộ sưu tập"
        description="Chọn bộ sưu tập cho sản phẩm — sẽ có ở bước G5."
      >
        <p className="type-small text-stone-500">Chưa khả dụng.</p>
      </EditorSection>
    </>
  );
}

type BodyProps = ProductEditorProps & { editor: ReturnType<typeof useProductEditor> };

function EditorBody({ product, categories, editor }: BodyProps) {
  const patchGeneral = (patch: Partial<GeneralValues>): void =>
    editor.setGeneral((current) => ({ ...current, ...patch }));
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-6">
      {product && <PublishPanel product={product} dirty={editor.dirty} />}
      <EditorSection title="Thông tin chung">
        <GeneralFields
          values={editor.general}
          errors={editor.errors.general}
          categories={categories}
          onChange={patchGeneral}
        />
      </EditorSection>
      <EditorSection
        title="Biến thể"
        description="Mỗi tổ hợp màu và cỡ là một biến thể có giá và tồn kho riêng. Sản phẩm không có màu hay cỡ vẫn cần 1 biến thể."
      >
        <VariantsEditor
          rows={editor.rows}
          errors={editor.errors.variants}
          makeKey={editor.makeKey}
          onChange={editor.setRows}
        />
      </EditorSection>
      {product && <PlaceholderBlocks />}
      <EditorSection title="SEO">
        <SeoFields values={editor.general} errors={editor.errors.general} onChange={patchGeneral} />
      </EditorSection>
    </div>
  );
}

/** Màn hình M6: thêm / sửa sản phẩm trên một trang (docs/06 mục 8). */
export function ProductEditor({ product, categories }: ProductEditorProps) {
  const editor = useProductEditor(product);
  return (
    <form onSubmit={editor.save} noValidate>
      <SaveBar
        title={product ? product.name : "Thêm sản phẩm"}
        dirty={editor.dirty}
        saving={editor.saving}
      />
      {editor.topError && (
        <p
          role="alert"
          className="type-small mb-6 border-l-2 border-error-700 bg-blush-100 px-4 py-3 text-error-700"
        >
          {editor.topError}
        </p>
      )}
      <EditorBody product={product} categories={categories} editor={editor} />
    </form>
  );
}
