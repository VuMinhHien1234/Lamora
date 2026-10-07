"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { ButtonLink } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "../cart-store";
import { useCartValidation } from "../use-cart-validation";
import type { CartLine, CartValidation } from "../types";
import { CartLineList, type DisplayLine } from "./cart-line-list";
import { CartSummary } from "./cart-summary";
import { CartWarnings } from "./cart-warnings";
import { EmptyCart } from "./empty-cart";

type CartPanelProps = {
  /** Trang giỏ hàng: bật khi trang hiển thị. Giỏ nhỏ: bật khi ngăn đang mở. */
  active: boolean;
  variant: "page" | "drawer";
  onNavigate?: () => void;
};

/** Ghép dòng trong giỏ (số lượng mới nhất) với dữ liệu server (giá, ảnh, tồn kho). */
function toDisplayLines(lines: CartLine[], data: CartValidation | null): DisplayLine[] {
  if (!data) return [];
  const byId = new Map(data.lines.map((line) => [line.variantId, line]));
  return lines.flatMap((line) => {
    const found = byId.get(line.variantId);
    return found ? [{ ...found, quantity: line.quantity }] : [];
  });
}

function LoadError() {
  return (
    <p role="alert" className="type-small py-5 text-error-700">
      Không tải được giỏ hàng. Vui lòng thử lại sau.
    </p>
  );
}

function LoadingRows() {
  return (
    <div className="flex flex-col gap-5 py-5" aria-busy>
      {[0, 1].map((i) => (
        <div key={i} className="flex gap-4">
          <Skeleton className="aspect-[4/5] w-20" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

function useHydrated(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

type LayoutProps = { list: ReactNode; summary: ReactNode; onNavigate?: () => void };

function DrawerLayout({ list, summary, onNavigate }: LayoutProps) {
  return (
    <div className="flex min-h-full flex-col">
      <div className="flex flex-1 flex-col gap-4 px-5 py-4">{list}</div>
      <div className="sticky bottom-0 border-t border-sand-200 bg-ivory-50 px-5 py-5">
        {summary}
        <ButtonLink href="/gio-hang" fullWidth onClick={onNavigate} className="mt-4">
          Xem giỏ hàng
        </ButtonLink>
      </div>
    </div>
  );
}

export function CartPanel({ active, variant, onNavigate }: CartPanelProps) {
  const cart = useCart();
  const hydrated = useHydrated();
  const { data, loading, failed } = useCartValidation(cart.lines, active);
  if (!hydrated)
    return (
      <div className="px-5">
        <LoadingRows />
      </div>
    );
  if (cart.lines.length === 0) return <EmptyCart onNavigate={onNavigate} />;

  const display = toDisplayLines(cart.lines, data);
  const hasUnavailable =
    display.some((line) => !line.available) || (data?.warnings.length ?? 0) > 0;
  const list = (
    <>
      {failed && !data && <LoadError />}
      {!data && !failed && <LoadingRows />}
      {data && <CartWarnings warnings={data.warnings} />}
      {display.length > 0 && (
        <CartLineList
          lines={display}
          compact={variant === "drawer"}
          onQuantity={cart.setQuantity}
          onRemove={cart.remove}
          onNavigate={onNavigate}
        />
      )}
    </>
  );
  const summary = (
    <CartSummary
      subtotal={data?.subtotal ?? 0}
      blocked={!data || hasUnavailable || failed}
      loading={loading}
      onNavigate={onNavigate}
      showCheckout={variant !== "drawer"}
    />
  );

  return variant === "drawer" ? (
    <DrawerLayout list={list} summary={summary} onNavigate={onNavigate} />
  ) : (
    <div className="grid gap-10 lg:grid-cols-[1fr_24rem] lg:gap-16">
      <div className="flex flex-col gap-4">{list}</div>
      <aside className="h-fit border border-sand-200 p-6 lg:sticky lg:top-28">{summary}</aside>
    </div>
  );
}
