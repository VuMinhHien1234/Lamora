"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatVnd } from "@/lib/money";
import type { Suggestion } from "../shop-types";

const MIN_CHARS = 2;
const DEBOUNCE_MS = 250;

function useSuggestions(text: string): Suggestion[] {
  const [items, setItems] = useState<Suggestion[]>([]);
  useEffect(() => {
    const q = text.trim();
    if (q.length < MIN_CHARS) return;
    const controller = new AbortController();
    const timer = setTimeout(() => {
      fetch(`/api/goi-y-tim-kiem?q=${encodeURIComponent(q)}`, { signal: controller.signal })
        .then((response) => (response.ok ? response.json() : []))
        .then((data: Suggestion[]) => setItems(data))
        .catch(() => undefined);
    }, DEBOUNCE_MS);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [text]);
  return text.trim().length < MIN_CHARS ? [] : items;
}

/** Ô tìm kiếm: gõ từ 2 ký tự hiện tối đa 6 gợi ý; Enter sang trang kết quả (form GET nên không cần JS). */
export function SearchBox({ defaultValue = "" }: { defaultValue?: string }) {
  const [text, setText] = useState(defaultValue);
  const suggestions = useSuggestions(text);
  return (
    <div className="relative">
      <form method="get" action="/tim-kiem" role="search">
        <label htmlFor="search-q" className="sr-only">
          Tìm sản phẩm
        </label>
        <input
          id="search-q"
          name="q"
          type="search"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Tìm bình hoa, giỏ hoa, hoa treo tường…"
          autoComplete="off"
          className="type-body min-h-12 w-full border border-sand-300 bg-ivory-50 px-4 focus-visible:border-ink-900 focus-visible:outline-none"
        />
      </form>
      {suggestions.length > 0 && (
        <ul className="absolute inset-x-0 top-full z-10 border border-t-0 border-sand-300 bg-ivory-50">
          {suggestions.map((item) => (
            <li key={item.slug}>
              <Link
                href={`/san-pham/${item.slug}`}
                className="type-small flex min-h-11 items-center justify-between gap-4 px-4 py-2 hover:bg-ivory-100"
              >
                <span>{item.name}</span>
                <span className="shrink-0 text-stone-500 tabular-nums">
                  {formatVnd(item.priceFrom)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
