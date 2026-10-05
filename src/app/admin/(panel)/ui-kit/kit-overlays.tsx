"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Drawer } from "@/components/ui/drawer";
import { useToast } from "@/components/ui/toast";
import { KitRow, KitSection } from "./kit-section";

type Side = "right" | "left" | "bottom";

function DrawerDemos() {
  const [drawer, setDrawer] = useState<Side | null>(null);
  return (
    <>
      <KitRow label="Ngăn trượt (Drawer)">
        <Button variant="secondary" onClick={() => setDrawer("right")}>
          Giỏ hàng (phải)
        </Button>
        <Button variant="secondary" onClick={() => setDrawer("left")}>
          Menu (trái)
        </Button>
        <Button variant="secondary" onClick={() => setDrawer("bottom")}>
          Bộ lọc (dưới)
        </Button>
      </KitRow>
      <Drawer
        open={drawer !== null}
        onClose={() => setDrawer(null)}
        title="Ví dụ ngăn trượt"
        side={drawer ?? "right"}
        className="p-5"
      >
        <p className="type-body text-stone-500">Nội dung ngăn trượt. Cuộn được khi nội dung dài.</p>
      </Drawer>
    </>
  );
}

function ConfirmDemo() {
  const toast = useToast();
  const [open, setOpen] = useState(false);
  return (
    <>
      <KitRow label="Hộp xác nhận (ConfirmDialog)">
        <Button variant="danger" onClick={() => setOpen(true)}>
          Hủy đơn…
        </Button>
      </KitRow>
      <ConfirmDialog
        open={open}
        title="Hủy đơn LMR-261001-A2KP?"
        description="Hệ thống sẽ cộng lại tồn kho. Thao tác này không hoàn tác được."
        confirmLabel="Hủy đơn"
        danger
        onCancel={() => setOpen(false)}
        onConfirm={() => {
          setOpen(false);
          toast("Đã hủy đơn (ví dụ)");
        }}
      />
    </>
  );
}

export function KitOverlays() {
  const toast = useToast();
  return (
    <KitSection
      id="lop-phu"
      title="Ngăn trượt, thông báo, hộp xác nhận"
      note="Đóng bằng nút X, bấm nền hoặc phím Esc."
    >
      <DrawerDemos />
      <KitRow label="Thông báo (Toast, tự ẩn sau 3 giây)">
        <Button variant="subtle" onClick={() => toast("Đã thêm vào giỏ")}>
          Thông báo thường
        </Button>
        <Button
          variant="subtle"
          onClick={() => toast("Có chút trục trặc, bạn thử lại giúp chúng tôi", "error")}
        >
          Thông báo lỗi
        </Button>
      </KitRow>
      <ConfirmDemo />
    </KitSection>
  );
}
