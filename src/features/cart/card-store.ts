"use client";

import { useSyncExternalStore } from "react";
import { GIFT_MESSAGE_MAX } from "@/config/shipping";

// Thiệp + gói quà soạn ở giỏ hàng cho TỪNG sản phẩm (theo mã biến thể), lưu ở trình duyệt.
// Trang thanh toán đọc lại từ đây khi đặt hàng.
const STORAGE_KEY = "lamora-card-v2";

export type CardNote = { message: string; wrap: boolean };
export type CardNotes = Readonly<Record<string, CardNote>>;

const EMPTY_NOTE: CardNote = { message: "", wrap: false };
const EMPTY: CardNotes = {};
let notes: CardNotes = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function parseNote(value: unknown): CardNote | null {
  if (!value || typeof value !== "object") return null;
  const data = value as Partial<CardNote>;
  const message = typeof data.message === "string" ? data.message.slice(0, GIFT_MESSAGE_MAX) : "";
  const wrap = data.wrap === true;
  return message || wrap ? { message, wrap } : null;
}

function parse(text: string | null): CardNotes {
  try {
    const data = JSON.parse(text ?? "null") as Record<string, unknown> | null;
    if (!data || typeof data !== "object") return EMPTY;
    const result: Record<string, CardNote> = {};
    for (const [variantId, value] of Object.entries(data)) {
      const note = parseNote(value);
      if (note) result[variantId] = note;
    }
    return result;
  } catch {
    return EMPTY;
  }
}

function load(): void {
  if (loaded) return;
  loaded = true;
  try {
    notes = parse(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    notes = EMPTY;
  }
}

function save(next: CardNotes): void {
  notes = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch {
    // Trình duyệt chặn lưu trữ: chỉ giữ trong phiên này.
  }
  for (const listener of listeners) listener();
}

function update(variantId: string, patch: Partial<CardNote>): void {
  load();
  const merged = { ...(notes[variantId] ?? EMPTY_NOTE), ...patch };
  const next = Object.fromEntries(Object.entries(notes).filter(([id]) => id !== variantId));
  save(merged.message || merged.wrap ? { ...next, [variantId]: merged } : next);
}

/** Đọc một lần (không theo dõi thay đổi), dùng khi gửi đơn. */
export function readCardNotes(): CardNotes {
  load();
  return notes;
}

export function clearCardNotes(): void {
  save(EMPTY);
}

export function setCardMessage(variantId: string, message: string): void {
  update(variantId, { message: message.slice(0, GIFT_MESSAGE_MAX) });
}

export function setCardWrap(variantId: string, wrap: boolean): void {
  update(variantId, { wrap });
}

export function useCardNotes(): CardNotes {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => {
      load();
      return notes;
    },
    () => EMPTY,
  );
}

export function useCardNote(variantId: string): CardNote {
  return useCardNotes()[variantId] ?? EMPTY_NOTE;
}

/** Số sản phẩm được chọn gói quà trong danh sách mã biến thể (để tính phí). */
export function countWrapped(all: CardNotes, variantIds: string[]): number {
  return variantIds.filter((id) => all[id]?.wrap).length;
}
