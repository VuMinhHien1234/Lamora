"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useToast } from "@/components/ui/toast";
import { setCollectionProducts } from "../actions";
import { normalizeSearch } from "./picker-rules";

export type PickerProduct = { id: string; name: string; status: string; previewUrl: string | null };

/** Danh sách sản phẩm đã chọn (có thứ tự), ô tìm kiếm và thao tác lưu của ProductPicker. */
export function useProductPicker(collectionId: string, all: PickerProduct[], initialIds: string[]) {
  const router = useRouter();
  const toast = useToast();
  const [ids, setIds] = useState(initialIds);
  const [query, setQuery] = useState("");
  const [saving, setSaving] = useState(false);
  const byId = useMemo(() => new Map(all.map((p) => [p.id, p])), [all]);
  const selected = ids.flatMap((id) => byId.get(id) ?? []);
  const needle = normalizeSearch(query);
  const candidates = all.filter(
    (p) => !ids.includes(p.id) && (needle === "" || normalizeSearch(p.name).includes(needle)),
  );
  const dirty = ids.join() !== initialIds.join();

  async function save(): Promise<void> {
    setSaving(true);
    const result = await setCollectionProducts({ collectionId, productIds: ids });
    setSaving(false);
    if (!result.ok) return toast(result.error.message, "error");
    toast("Đã lưu danh sách sản phẩm");
    router.refresh();
  }

  const add = (id: string): void => setIds((list) => [...list, id]);
  const remove = (id: string): void => setIds((list) => list.filter((x) => x !== id));
  const move = (id: string, step: number): void =>
    setIds((list) => {
      const from = list.indexOf(id);
      const to = from + step;
      if (from < 0 || to < 0 || to >= list.length) return list;
      const next = [...list];
      next.splice(to, 0, ...next.splice(from, 1));
      return next;
    });

  return { selected, candidates, query, setQuery, dirty, saving, save, add, remove, move };
}
