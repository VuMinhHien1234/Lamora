import type { ShippingZone } from "@/config/shipping";
import { AppError } from "@/lib/errors";
import type { OrderStatus } from "./status-flow";

export type ShippingEditInput = {
  carrier?: string;
  trackingCode?: string;
  recipientName?: string;
  recipientPhone?: string;
  addressLine?: string;
  provinceCode?: string;
  wardCode?: string;
};

export type ResolvedShippingAddress = {
  provinceName: string;
  wardName: string;
  zone: ShippingZone;
};

export type ShippingEditPlan = {
  data: Record<string, string>;
  /** Ghi vào lịch sử đơn, ví dụ "Sửa thông tin giao hàng: địa chỉ, người nhận". */
  note: string;
};

const ADDRESS_EDITABLE: readonly OrderStatus[] = ["PENDING", "CONFIRMED"];
const CARRIER_EDITABLE: readonly OrderStatus[] = ["PENDING", "CONFIRMED", "SHIPPING"];

function conflict(message: string): AppError {
  return new AppError("CONFLICT", message);
}

function addressChanges(
  input: ShippingEditInput,
  address: ResolvedShippingAddress | null,
): { fields: Record<string, string>; labels: string[] } {
  const fields: Record<string, string> = {};
  const labels: string[] = [];
  if (input.recipientName) {
    fields.recipientName = input.recipientName;
    labels.push("tên người nhận");
  }
  if (input.recipientPhone) {
    fields.recipientPhone = input.recipientPhone;
    labels.push("SĐT người nhận");
  }
  if (input.addressLine) {
    fields.addressLine = input.addressLine;
    labels.push("số nhà, đường");
  }
  if (address && input.provinceCode && input.wardCode) {
    Object.assign(fields, {
      provinceCode: input.provinceCode,
      provinceName: address.provinceName,
      wardCode: input.wardCode,
      wardName: address.wardName,
      shippingZone: address.zone,
    });
    labels.push("tỉnh/phường (không tính lại phí ship)");
  }
  return { fields, labels };
}

/**
 * Sửa thông tin giao hàng (docs/04 mục 8.2 #9). Địa chỉ và người nhận chỉ sửa được khi đơn chờ/đã xác nhận;
 * đơn vị vận chuyển và mã vận đơn sửa được đến khi đang giao. Không tính lại phí ship.
 */
export function planShippingEdit(
  status: OrderStatus,
  input: ShippingEditInput,
  address: ResolvedShippingAddress | null,
): ShippingEditPlan {
  const { fields, labels } = addressChanges(input, address);
  const carrierFields: Record<string, string> = {};
  if (input.carrier !== undefined) carrierFields.carrier = input.carrier;
  if (input.trackingCode !== undefined) carrierFields.trackingCode = input.trackingCode;
  const hasAddress = Object.keys(fields).length > 0;
  const hasCarrier = Object.keys(carrierFields).length > 0;

  if (!hasAddress && !hasCarrier) {
    throw new AppError("VALIDATION_ERROR", "Chưa có thông tin nào thay đổi.");
  }
  if (hasAddress && !ADDRESS_EDITABLE.includes(status)) {
    throw conflict(
      "Chỉ sửa được địa chỉ và người nhận khi đơn đang chờ xác nhận hoặc đã xác nhận.",
    );
  }
  if (hasCarrier && !CARRIER_EDITABLE.includes(status)) {
    throw conflict("Đơn đã kết thúc, không sửa được đơn vị vận chuyển.");
  }
  const changed = [...labels, ...(hasCarrier ? ["đơn vị vận chuyển / mã vận đơn"] : [])];
  return {
    data: { ...fields, ...carrierFields },
    note: `Sửa thông tin giao hàng: ${changed.join(", ")}`,
  };
}
