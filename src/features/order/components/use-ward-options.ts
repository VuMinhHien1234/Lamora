"use client";

import { useEffect, useState } from "react";
import { getAddressOptions, type AddressOption } from "@/features/shipping";

type State = { provinceCode: string; wards: AddressOption[] };

/** Tải danh sách phường/xã khi khách chọn tỉnh. */
export function useWardOptions(provinceCode: string): { wards: AddressOption[]; loading: boolean } {
  const [state, setState] = useState<State>({ provinceCode: "", wards: [] });

  useEffect(() => {
    if (!provinceCode) return;
    let stale = false;
    getAddressOptions({ provinceCode }).then((result) => {
      if (!stale && result.ok) setState({ provinceCode, wards: result.data });
    });
    return () => {
      stale = true;
    };
  }, [provinceCode]);

  const ready = state.provinceCode === provinceCode;
  return { wards: ready ? state.wards : [], loading: Boolean(provinceCode) && !ready };
}
