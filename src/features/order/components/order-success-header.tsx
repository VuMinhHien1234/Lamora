import { CopyButton } from "@/components/ui/copy-button";
import { GoldRule } from "@/components/ui/divider";

export function OrderSuccessHeader({ code }: { code: string }) {
  return (
    <header className="flex flex-col items-center gap-3 text-center">
      <GoldRule />
      <h1 className="type-h1">Cảm ơn bạn!</h1>
      <p className="type-lead text-stone-500">Đơn hàng của bạn đã được ghi nhận.</p>
      <p className="flex items-center gap-1">
        <span className="type-body">Mã đơn:</span>
        <strong className="type-body font-medium tracking-wide">{code}</strong>
        <CopyButton value={code} what="mã đơn" />
      </p>
    </header>
  );
}
