import provinces from "@/config/address/provinces.json";
import type { AddressOption } from "./types";

const PROVINCES: AddressOption[] = provinces;

export function listProvinces(): AddressOption[] {
  return PROVINCES;
}

export function findProvince(code: string): AddressOption | null {
  return PROVINCES.find((province) => province.code === code) ?? null;
}

/** Phường/xã của một tỉnh, chỉ nạp file của tỉnh đó. Tỉnh không tồn tại → mảng rỗng. */
export async function listWards(provinceCode: string): Promise<AddressOption[]> {
  if (!findProvince(provinceCode)) return [];
  const loaded = (await import(`@/config/address/wards/${provinceCode}.json`)) as {
    default: AddressOption[];
  };
  return loaded.default;
}
