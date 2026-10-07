"use client";

import { useEffect, useState } from "react";
import { quoteShipping } from "@/features/shipping";

type State = { key: string; fee: number | null };

/** Phí ship tạm tính theo tỉnh và tiền hàng. null = chưa chọn tỉnh hoặc đang tính. Tiền thật vẫn do server tính lại khi đặt đơn. */
export function useShippingFee(provinceCode: string, subtotal: number | null): number | null {
  const [state, setState] = useState<State>({ key: "", fee: null });
  const key = `${provinceCode}:${subtotal}`;

  useEffect(() => {
    if (!provinceCode || subtotal === null) return;
    let stale = false;
    quoteShipping({ provinceCode, subtotal }).then((result) => {
      if (!stale && result.ok) setState({ key, fee: result.data.shippingFee });
    });
    return () => {
      stale = true;
    };
  }, [provinceCode, subtotal, key]);

  return provinceCode && subtotal !== null && state.key === key ? state.fee : null;
}
