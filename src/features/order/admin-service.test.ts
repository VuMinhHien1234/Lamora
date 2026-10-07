import { beforeEach, describe, expect, it, vi } from "vitest";
import type { LockedOrder, OrderMutation } from "./admin-write-repository";

let locked: LockedOrder;
let captured: OrderMutation | undefined;
vi.mock("./admin-write-repository", () => ({
  mutateOrder: vi.fn(async (_id: string, plan: (o: LockedOrder) => OrderMutation) => {
    captured = plan(locked);
    return { code: locked.code };
  }),
}));
vi.mock("./admin-repository", () => ({}));
vi.mock("@/features/shipping", () => ({
  resolveAddress: vi.fn(async (p: string, w: string) =>
    p === "01" && w === "00001" ? { provinceName: "Hà Nội", wardName: "Phường A" } : null,
  ),
  getZoneByProvince: () => "HANOI_INNER",
}));
vi.mock("@/lib/cloudinary", () => ({ cloudinaryUrl: () => "x" }));

const service = await import("./admin-service");

beforeEach(() => {
  captured = undefined;
  locked = {
    id: "o1",
    code: "LMR-261006-ABCD",
    status: "PENDING",
    paymentStatus: "UNPAID",
    paymentMethod: "COD",
    items: [{ variantId: "v1", quantity: 2 }],
  };
});

describe("changeStatus", () => {
  it("xác nhận đơn: ghi lịch sử PENDING → CONFIRMED", async () => {
    await service.changeStatus("o1", { toStatus: "CONFIRMED" }, "admin");
    expect(captured?.history).toMatchObject({ fromStatus: "PENDING", toStatus: "CONFIRMED" });
    expect(captured?.restock).toEqual([]);
  });

  it("hủy đơn: cộng lại kho, lưu lý do", async () => {
    await service.changeStatus("o1", { toStatus: "CANCELLED", note: "Hết hoa" }, "admin");
    expect(captured?.restock).toEqual([{ variantId: "v1", quantity: 2 }]);
    expect(captured?.data).toMatchObject({ status: "CANCELLED", cancelReason: "Hết hoa" });
    expect(captured?.history?.note).toBe("Hết hoa");
  });

  it("bước sai luồng bị từ chối", async () => {
    locked.status = "DELIVERED";
    await expect(service.changeStatus("o1", { toStatus: "CONFIRMED" }, "a")).rejects.toMatchObject({
      code: "INVALID_STATUS_TRANSITION",
    });
  });
});

describe("markPaid", () => {
  it("ghi PAID kèm lịch sử, không đổi trạng thái đơn", async () => {
    const at = new Date("2026-10-06T01:00:00Z");
    await service.markPaid("o1", at, "admin");
    expect(captured?.data).toEqual({ paymentStatus: "PAID", paidAt: at });
    expect(captured?.history).toMatchObject({ fromStatus: "PENDING", toStatus: "PENDING" });
  });

  it("đơn đã trả → CONFLICT", async () => {
    locked.paymentStatus = "PAID";
    await expect(service.markPaid("o1", undefined, "a")).rejects.toMatchObject({
      code: "CONFLICT",
    });
  });
});

describe("updateShipping", () => {
  it("đổi địa chỉ hợp lệ", async () => {
    await service.updateShipping({ id: "o1", provinceCode: "01", wardCode: "00001" }, "admin");
    expect(captured?.data).toMatchObject({ provinceName: "Hà Nội", wardName: "Phường A" });
  });

  it("phường không thuộc tỉnh → INVALID_ADDRESS", async () => {
    await expect(
      service.updateShipping({ id: "o1", provinceCode: "01", wardCode: "99999" }, "a"),
    ).rejects.toMatchObject({ code: "INVALID_ADDRESS" });
  });

  it("chỉ gửi tỉnh không gửi phường → INVALID_ADDRESS", async () => {
    await expect(
      service.updateShipping({ id: "o1", provinceCode: "01" }, "a"),
    ).rejects.toMatchObject({
      code: "INVALID_ADDRESS",
    });
  });
});

describe("setAdminNote", () => {
  it("lưu ghi chú, không ghi lịch sử; rỗng thì xóa", async () => {
    await service.setAdminNote("o1", "Gọi trước 9h", "a");
    expect(captured?.data).toEqual({ adminNote: "Gọi trước 9h" });
    expect(captured?.history).toBeNull();
    await service.setAdminNote("o1", "", "a");
    expect(captured?.data).toEqual({ adminNote: null });
  });
});
