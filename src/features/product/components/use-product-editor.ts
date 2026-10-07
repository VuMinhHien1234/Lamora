"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useToast } from "@/components/ui/toast";
import { createProduct, updateProduct, upsertVariants } from "../actions";
import type { ProductDetail } from "../types";
import { emptyGeneral, generalFromProduct, type GeneralValues } from "./general-form";
import { useImagesEditor, type ImagesEditorState } from "./use-images-editor";
import {
  emptyRow,
  rowsFromRecords,
  splitFieldErrors,
  toVariantPayload,
  type SplitErrors,
  type VariantRowState,
} from "./variant-form";

type Snapshot = { general: GeneralValues; rows: VariantRowState[] };
type SaveResult = {
  ok: boolean;
  id?: string;
  error?: { message: string; fieldErrors?: Record<string, string[]> };
};

function initialSnapshot(product: ProductDetail | null): Snapshot {
  return {
    general: product ? generalFromProduct(product) : emptyGeneral(),
    rows: product ? rowsFromRecords(product.variants) : [emptyRow("new-0")],
  };
}

/** Lưu sản phẩm: tạo mới một lần, hoặc sửa thông tin chung rồi tới biến thể. */
async function persist(
  productId: string | null,
  current: Snapshot,
  onGeneralSaved: () => void,
): Promise<SaveResult> {
  const variants = toVariantPayload(current.rows);
  if (!productId) {
    const created = await createProduct({ ...current.general, variants });
    return created.ok ? { ok: true, id: created.data.id } : { ok: false, error: created.error };
  }
  const general = await updateProduct({ ...current.general, id: productId });
  if (!general.ok) return { ok: false, error: general.error };
  onGeneralSaved();
  const saved = await upsertVariants({ productId, variants });
  return saved.ok ? { ok: true, id: productId } : { ok: false, error: saved.error };
}

function useWarnOnLeave(dirty: boolean): void {
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent): void => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
}

type FinishInput = {
  id: string;
  isNew: boolean;
  images: ImagesEditorState;
  router: ReturnType<typeof useRouter>;
  toast: ReturnType<typeof useToast>;
};

/** Sau khi lưu thông tin: lưu ảnh, rồi quay về danh sách. Trả về lỗi nếu ảnh chưa lưu được. */
async function finishSave(input: FinishInput): Promise<string | undefined> {
  const imageError = await input.images.commit(input.id);
  if (imageError) {
    // Sản phẩm mới đã được tạo: chuyển sang trang sửa để thử lại, tránh tạo trùng.
    if (input.isNew) input.router.push(`/admin/san-pham/${input.id}`);
    return `Đã lưu thông tin sản phẩm nhưng chưa lưu được ảnh: ${imageError}`;
  }
  input.toast(input.isNew ? "Đã tạo sản phẩm ở trạng thái Nháp" : "Đã lưu sản phẩm");
  input.router.push("/admin/san-pham");
  return undefined;
}

/** Trạng thái và thao tác của form thêm/sửa sản phẩm. */
export function useProductEditor(product: ProductDetail | null) {
  const router = useRouter();
  const toast = useToast();
  const counter = useRef(0);
  const [initial] = useState(() => initialSnapshot(product));
  const [saved, setSaved] = useState<Snapshot>(initial);
  const [general, setGeneral] = useState(initial.general);
  const [rows, setRows] = useState(initial.rows);
  const [errors, setErrors] = useState<SplitErrors>({ general: {}, variants: {} });
  const [topError, setTopError] = useState<string>();
  const [saving, setSaving] = useState(false);
  const images = useImagesEditor(product?.images ?? []);
  const dirty = JSON.stringify({ general, rows }) !== JSON.stringify(saved) || images.dirty;
  useWarnOnLeave(dirty);

  const makeKey = (): string => `new-${(counter.current += 1)}`;

  async function save(event: FormEvent): Promise<void> {
    event.preventDefault();
    setSaving(true);
    setErrors({ general: {}, variants: {} });
    setTopError(undefined);
    const result = await persist(product?.id ?? null, { general, rows }, () =>
      setSaved((s) => ({ ...s, general })),
    );
    if (!result.ok) {
      setSaving(false);
      setErrors(splitFieldErrors(result.error?.fieldErrors));
      setTopError(result.error?.message ?? "Có lỗi xảy ra, vui lòng thử lại.");
      return;
    }
    setSaved({ general, rows });
    const error = await finishSave({ id: result.id ?? "", isNew: !product, images, router, toast });
    setSaving(false);
    if (error) setTopError(error);
  }

  return {
    general,
    setGeneral,
    rows,
    setRows,
    errors,
    topError,
    saving,
    dirty,
    makeKey,
    save,
    images,
  };
}
