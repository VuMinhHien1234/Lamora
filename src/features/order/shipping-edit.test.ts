import { describe, expect, it } from "vitest";
import { planShippingEdit } from "./shipping-edit";

const addr = { provinceName: "Hà Nội", wardName: "Phường A", zone: "HANOI_INNER" as const };

describe("planShippingEdit", () => {
  it("sửa người nhận và địa chỉ khi đơn chờ xác nhận", () => {
    const plan = planShippingEdit(
      "PENDING",
      { recipientName: "Lan", addressLine: "5 Lê Lợi", provinceCode: "01", wardCode: "00001" },
      addr,
    );
    expect(plan.data).toMatchObject({
      recipientName: "Lan",
      addressLine: "5 Lê Lợi",
      provinceName: "Hà Nội",
      wardName: "Phường A",
      shippingZone: "HANOI_INNER",
    });
    expect(plan.data).not.toHaveProperty("shippingFee");
    expect(plan.note).toContain("Sửa thông tin giao hàng");
  });

  it("đang giao: chỉ sửa được vận đơn, địa chỉ thì bị từ chối", () => {
    expect(planShippingEdit("SHIPPING", { trackingCode: "ABC" }, null).data).toEqual({
      trackingCode: "ABC",
    });
    expect(() => planShippingEdit("SHIPPING", { addressLine: "x y z" }, null)).toThrowError(
      expect.objectContaining({ code: "CONFLICT" }),
    );
  });

  it("đã giao/hủy/hoàn: không sửa gì", () => {
    for (const status of ["DELIVERED", "CANCELLED", "RETURNED"] as const) {
      expect(() => planShippingEdit(status, { carrier: "GHN" }, null)).toThrow();
      expect(() => planShippingEdit(status, { recipientName: "An" }, null)).toThrow();
    }
  });

  it("không có thay đổi nào → lỗi", () => {
    expect(() => planShippingEdit("PENDING", {}, null)).toThrowError(
      expect.objectContaining({ code: "VALIDATION_ERROR" }),
    );
  });

  it("cho phép xóa mã vận đơn bằng chuỗi rỗng", () => {
    expect(planShippingEdit("CONFIRMED", { trackingCode: "" }, null).data).toEqual({
      trackingCode: "",
    });
  });
});
