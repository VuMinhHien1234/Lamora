"use client";

import { useSyncExternalStore } from "react";

/** false khi render trên server và lần render đầu ở trình duyệt, để tránh lệch giữa hai bên. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}
