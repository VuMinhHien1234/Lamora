import Image from "next/image";
import { BANK_NAMES } from "@/config/banks";
import { CopyButton } from "@/components/ui/copy-button";
import { formatVnd } from "@/lib/money";
import type { BankTransferInfo } from "../types";

const QR_WIDTH = 240;
const QR_HEIGHT = 284;

function InfoRow({ label, value, copy }: { label: string; value: string; copy?: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-sand-200 py-1 last:border-b-0">
      <div className="min-w-0">
        <dt className="type-small text-stone-500">{label}</dt>
        <dd className="type-body font-medium break-words">{value}</dd>
      </div>
      {copy && <CopyButton value={copy} what={label.toLowerCase()} />}
    </div>
  );
}

/** Khối chuyển khoản trên trang cảm ơn: mã QR đã điền sẵn số tiền và nội dung, kèm thông tin để chép tay (docs/07 mục 2). */
export function BankTransferBox({ info }: { info: BankTransferInfo }) {
  return (
    <section aria-labelledby="bank-title" className="border border-sand-200 p-6">
      <h2 id="bank-title" className="type-h3">
        Chuyển khoản qua VietQR
      </h2>
      <div className="mt-6 grid gap-6 md:grid-cols-[15rem_1fr]">
        <Image
          src={info.qrImageUrl}
          alt="Mã QR chuyển khoản đã điền sẵn số tiền và nội dung"
          width={QR_WIDTH}
          height={QR_HEIGHT}
          unoptimized
          className="mx-auto h-auto w-60 border border-sand-200"
        />
        <dl className="flex flex-col">
          <InfoRow label="Ngân hàng" value={BANK_NAMES[info.bankBin] ?? "Ngân hàng"} />
          <InfoRow label="Số tài khoản" value={info.accountNo} copy={info.accountNo} />
          <InfoRow label="Chủ tài khoản" value={info.accountName} />
          <InfoRow label="Số tiền" value={formatVnd(info.amount)} copy={String(info.amount)} />
          <InfoRow
            label="Nội dung chuyển khoản"
            value={info.transferContent}
            copy={info.transferContent}
          />
        </dl>
      </div>
      <p className="type-small mt-4 text-stone-500">
        Vui lòng giữ nguyên nội dung chuyển khoản để chúng tôi xác nhận nhanh.
      </p>
    </section>
  );
}
