import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { Markdown } from "@/components/ui/markdown";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE_ENABLED } from "@/config/shipping";
import { SITE } from "@/config/site";
import { formatVnd } from "@/lib/money";
import type { ShopProduct } from "../shop-types";

type Props = { product: ShopProduct };

function ChatToOrder() {
  const { zaloUrl, phone } = SITE.contact;
  const href = zaloUrl || `tel:${phone.replace(/\s/g, "")}`;
  return (
    <p className="type-small text-stone-500">
      Cần tư vấn?{" "}
      <a
        href={href}
        className="link-underline text-ink-900"
        {...(zaloUrl ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {zaloUrl ? "Nhắn Zalo cho shop" : `Gọi ${phone}`}
      </a>
    </p>
  );
}

/** Mô tả · Chất liệu & bảo quản · Giao hàng & đổi trả, dạng accordion (docs/03 mục 9.4). */
export function ProductDetailsAccordion({ product }: Props) {
  const description = product.description ?? product.shortDescription;
  const hasCare = product.material || product.careInstructions;
  return (
    <div className="grid gap-4">
      <Accordion>
        {description && (
          <AccordionItem title="Mô tả" defaultOpen>
            <Markdown source={description} />
          </AccordionItem>
        )}
        {hasCare && (
          <AccordionItem title="Chất liệu & bảo quản">
            <div className="grid gap-3">
              {product.material && <p>{product.material}</p>}
              {product.careInstructions && <Markdown source={product.careInstructions} />}
            </div>
          </AccordionItem>
        )}
        <AccordionItem title="Giao hàng & đổi trả">
          <div className="grid gap-3">
            <p>
              Giao toàn quốc trong 1–5 ngày.{" "}
              {SHIPPING_FEE_ENABLED
                ? `Miễn phí giao hàng cho đơn từ ${formatVnd(FREE_SHIPPING_THRESHOLD)}.`
                : "Phí vận chuyển shop sẽ báo khi liên hệ xác nhận đơn."}
            </p>
            <p>Đổi trả trong 7 ngày nếu sản phẩm lỗi hoặc không đúng mô tả.</p>
          </div>
        </AccordionItem>
      </Accordion>
      <ChatToOrder />
    </div>
  );
}
