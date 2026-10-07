import type { Metadata } from "next";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { CheckoutForm } from "@/features/order";
import { listProvinces } from "@/features/shipping";

export const metadata: Metadata = {
  title: "Thanh toán",
  robots: { index: false, follow: false },
};

// S8 — Thanh toán (docs/05 mục 7). Giá và tồn kho do server đối chiếu lại khi đặt hàng.
export default function CheckoutPage() {
  return (
    <div className="page-container py-8 lg:py-12">
      <Breadcrumb
        items={[
          { label: "Trang chủ", href: "/" },
          { label: "Giỏ hàng", href: "/gio-hang" },
          { label: "Thanh toán" },
        ]}
      />
      <h1 className="type-h1 mt-4 mb-8 lg:mb-12">Thanh toán</h1>
      <CheckoutForm provinces={listProvinces()} />
    </div>
  );
}
