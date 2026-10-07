import type { Metadata } from "next";
import Link from "next/link";
import { buttonStyles } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { getOrderConfirmation, NextSteps, OrderRecap, OrderSuccessHeader } from "@/features/order";
import { BankTransferBox, getBankTransferInfo } from "@/features/payment";

export const metadata: Metadata = {
  title: "Đặt hàng thành công",
  robots: { index: false, follow: false },
};

type PageProps = { searchParams: Promise<{ code?: string }> };

function NotViewable() {
  return (
    <EmptyState
      title="Không xem được đơn này"
      description="Trang này chỉ hiện ngay sau khi đặt hàng. Bạn có thể tra cứu đơn bằng mã đơn và số điện thoại."
      action={
        <Link href="/tra-cuu-don" className={buttonStyles({ variant: "secondary" })}>
          Tra cứu đơn hàng
        </Link>
      }
    />
  );
}

// S9 — Đặt hàng thành công (docs/05 mục 8). Chỉ xem được khi cookie phiên đặt hàng còn hạn.
export default async function OrderSuccessPage({ searchParams }: PageProps) {
  const { code = "" } = await searchParams;
  const order = await getOrderConfirmation(code);
  if (!order)
    return (
      <div className="page-container py-12">
        <NotViewable />
      </div>
    );
  const bank = await getBankTransferInfo(code);
  return (
    <div className="page-container flex max-w-3xl flex-col gap-10 py-12 lg:py-16">
      <OrderSuccessHeader code={order.code} />
      {bank && <BankTransferBox info={bank} />}
      <OrderRecap order={order} />
      <NextSteps />
    </div>
  );
}
