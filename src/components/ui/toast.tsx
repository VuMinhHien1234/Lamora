"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

type ToastTone = "default" | "error";
type ToastItem = { id: number; message: string; tone: ToastTone };
type ToastFn = (message: string, tone?: ToastTone) => void;

const ToastContext = createContext<ToastFn | null>(null);
const TOAST_DURATION_MS = 3000;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const nextId = useRef(0);

  const toast = useCallback<ToastFn>((message, tone = "default") => {
    const id = nextId.current++;
    setItems((current) => [...current, { id, message, tone }]);
    setTimeout(
      () => setItems((current) => current.filter((item) => item.id !== id)),
      TOAST_DURATION_MS,
    );
  }, []);

  const value = useMemo(() => toast, [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-4 bottom-4 z-[70] flex flex-col items-center gap-2 md:inset-x-auto md:right-6 md:bottom-6 md:items-end"
      >
        {items.map((item) => (
          <div
            key={item.id}
            className={`type-small animate-[lamora-rise_400ms_var(--ease-soft)] bg-ink-900 px-5 py-3 text-ivory-50 shadow-float ${
              item.tone === "error" ? "border-l-2 border-rose-400" : ""
            }`}
          >
            {item.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/** const toast = useToast(); toast("Đã lưu"); toast("Có lỗi", "error"). */
export function useToast(): ToastFn {
  const toast = useContext(ToastContext);
  if (!toast) throw new Error("useToast phải nằm trong ToastProvider");
  return toast;
}
