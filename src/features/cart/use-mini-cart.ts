"use client";

import { useSyncExternalStore } from "react";

// Trạng thái đóng/mở của giỏ nhỏ (ngăn trượt). Dùng chung cho nút giỏ ở đầu trang và nút "Thêm vào giỏ".
let isOpen = false;
const listeners = new Set<() => void>();

function set(value: boolean): void {
  if (isOpen === value) return;
  isOpen = value;
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function openMiniCart(): void {
  set(true);
}

export function closeMiniCart(): void {
  set(false);
}

export function useMiniCartOpen(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => isOpen,
    () => false,
  );
}
