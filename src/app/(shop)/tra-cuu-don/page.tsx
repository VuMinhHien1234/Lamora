import type { Metadata } from "next";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { OrderLookupForm, TrackingResult } from "@/features/tracking";

export const metadata: Metadata = {
  title: "Tra cứu đơn hàng",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type PageProps = { searchParams: Promise<{ ma?: string }> };

/** S10 — Tra cứu đơn hàng. Khớp mã đơn + SĐT thì chuyển sang `?ma=...` và hiện tiến trình, chi tiết. */
export default async function TrackingPage({ searchParams }: PageProps) {
  const { ma } = await searchParams;
  return (
    <div className="page-container flex max-w-2xl flex-col gap-8 py-8 lg:py-12">
      <div>
        <Breadcrumb items={[{ label: "Trang chủ", href: "/" }, { label: "Tra cứu đơn hàng" }]} />
        <h1 className="type-h1 mt-4">Tra cứu đơn hàng</h1>
        <p className="type-body mt-2 text-stone-500">
          Nhập mã đơn (có trong tin nhắn xác nhận) và số điện thoại đã dùng khi đặt hàng.
        </p>
      </div>
      <OrderLookupForm />
      {ma && <TrackingResult code={ma} />}
    </div>
  );
}
