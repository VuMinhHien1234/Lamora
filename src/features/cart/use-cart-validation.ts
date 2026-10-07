"use client";

import { useEffect, useState } from "react";
import { validateCart } from "./actions";
import type { CartLine, CartValidation } from "./types";

const DEBOUNCE_MS = 250;

type State = { data: CartValidation | null; loading: boolean; failed: boolean };

export type CartValidationState = State;

/**
 * Đối chiếu giỏ với server mỗi khi `active` bật và mỗi khi giỏ đổi (docs/05 mục 6).
 * Giữ kết quả cũ trong lúc tải lại và bỏ qua phản hồi đến muộn.
 */
export function useCartValidation(lines: CartLine[], active: boolean): CartValidationState {
  const [state, setState] = useState<State>({ data: null, loading: false, failed: false });
  const key = JSON.stringify(lines);

  useEffect(() => {
    const items = JSON.parse(key) as CartLine[];
    if (!active || items.length === 0) return;
    let stale = false;
    const timer = window.setTimeout(() => {
      setState((prev) => ({ ...prev, loading: true }));
      validateCart({ items })
        .then((result) => {
          if (stale) return;
          if (result.ok) setState({ data: result.data, loading: false, failed: false });
          else setState((prev) => ({ ...prev, loading: false, failed: true }));
        })
        .catch(() => {
          if (!stale) setState((prev) => ({ ...prev, loading: false, failed: true }));
        });
    }, DEBOUNCE_MS);
    return () => {
      stale = true;
      window.clearTimeout(timer);
    };
  }, [key, active]);

  return lines.length === 0 ? { data: null, loading: false, failed: false } : state;
}
