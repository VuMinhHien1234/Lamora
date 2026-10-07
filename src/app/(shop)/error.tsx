"use client";

import { Button } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { SITE } from "@/config/site";

/** S12 — Lỗi bất ngờ ở web khách: câu xin lỗi, nút thử lại và đường nhắn Zalo. Không lộ chi tiết kỹ thuật. */
export default function ShopError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { zaloUrl, phone } = SITE.contact;
  return (
    <div className="page-container flex flex-col items-center gap-6 py-20 text-center">
      <Divider variant="ornament" />
      <h1 className="type-h1">Có lỗi xảy ra</h1>
      <p className="type-lead max-w-md text-stone-500">
        Xin lỗi bạn, trang tạm thời không tải được. Bạn thử lại nhé; nếu vẫn lỗi, hãy nhắn shop để
        được hỗ trợ đặt hàng.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Button onClick={reset}>Thử lại</Button>
        {zaloUrl ? (
          <a
            href={zaloUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="type-eyebrow link-underline py-3"
          >
            Nhắn Zalo cho shop
          </a>
        ) : (
          <a href={`tel:${phone.replaceAll(" ", "")}`} className="type-eyebrow link-underline py-3">
            Gọi {phone}
          </a>
        )}
      </div>
    </div>
  );
}
