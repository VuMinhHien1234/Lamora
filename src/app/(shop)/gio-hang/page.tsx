import type { Metadata } from "next";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { CartPageView } from "@/features/cart";

export const metadata: Metadata = {
  title: "Giỏ hàng",
  robots: { index: false, follow: false },
};

// S7 — Giỏ hàng (docs/05 mục 6). Giỏ lưu ở trình duyệt, giá và tồn kho do server đối chiếu.
export default function CartPage() {
  return (
    <div className="page-container py-8 lg:py-12">
      <Breadcrumb items={[{ label: "Trang chủ", href: "/" }, { label: "Giỏ hàng" }]} />
      <h1 className="type-h1 mt-4 mb-8 lg:mb-12">Giỏ hàng</h1>
      <CartPageView />
    </div>
  );
}
