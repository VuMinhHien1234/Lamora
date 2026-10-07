// API công khai của feature shipping (phí giao hàng, địa chỉ).
export { getAddressOptions, quoteShipping } from "./actions";
export { listProvinces } from "./queries";
export {
  calculateShippingFee,
  getZoneByProvince,
  quoteShipping as computeShippingQuote,
  resolveAddress,
} from "./service";
export type { AddressOption, ResolvedAddress, ShippingQuote } from "./types";
