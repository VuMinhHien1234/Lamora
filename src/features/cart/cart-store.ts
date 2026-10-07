"use client";

import { useSyncExternalStore } from "react";
import {
  addToCart,
  countItems,
  parseStoredCart,
  removeLine,
  serializeCart,
  setLineQuantity,
} from "./service";
import type { CartLine } from "./types";

// Giỏ hàng lưu ở trình duyệt (localStorage). Nếu trình duyệt chặn lưu trữ thì giỏ vẫn dùng được trong phiên này.
const STORAGE_KEY = "lamora-cart-v1";
const EMPTY_CART: CartLine[] = [];

let lines: CartLine[] = EMPTY_CART;
let loaded = false;
const listeners = new Set<() => void>();

function readStorage(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeStorage(value: string): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // Trình duyệt chặn lưu trữ (chế độ riêng tư…): bỏ qua, giỏ chỉ sống đến khi tải lại trang.
  }
}

function emit(): void {
  for (const listener of listeners) listener();
}

function load(): void {
  if (loaded) return;
  loaded = true;
  const stored = parseStoredCart(readStorage());
  lines = stored.length > 0 ? stored : EMPTY_CART;
}

function update(next: CartLine[]): void {
  lines = next.length > 0 ? next : EMPTY_CART;
  writeStorage(serializeCart(lines));
  emit();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  const onStorage = (event: StorageEvent): void => {
    if (event.key !== STORAGE_KEY) return;
    lines = parseStoredCart(event.newValue);
    emit();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot(): CartLine[] {
  load();
  return lines;
}

function getServerSnapshot(): CartLine[] {
  return EMPTY_CART;
}

export type CartApi = {
  lines: CartLine[];
  /** Tổng số sản phẩm (cộng số lượng các dòng). Luôn 0 ở lần render đầu trên server. */
  count: number;
  add: (variantId: string, quantity?: number) => void;
  setQuantity: (variantId: string, quantity: number) => void;
  remove: (variantId: string) => void;
  clear: () => void;
};

export function useCart(): CartApi {
  const current = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return {
    lines: current,
    count: countItems(current),
    add: (variantId, quantity) => update(addToCart(lines, variantId, quantity)),
    setQuantity: (variantId, quantity) => update(setLineQuantity(lines, variantId, quantity)),
    remove: (variantId) => update(removeLine(lines, variantId)),
    clear: () => update(EMPTY_CART),
  };
}
