import { listProvinces as listAllProvinces } from "./address-data";
import type { AddressOption } from "./types";

/** 🌐 Danh sách 34 tỉnh/thành, để Server Component truyền sẵn cho form địa chỉ. */
export function listProvinces(): AddressOption[] {
  return listAllProvinces();
}
