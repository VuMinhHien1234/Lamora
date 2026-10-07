import Link from "next/link";
import { Divider } from "@/components/ui/divider";

type Props = { title: string; href?: string; linkLabel?: string };

/** Tiêu đề khối trang chủ: tên khối, đường trang trí vàng và liên kết "Xem tất cả". */
export function SectionHeading({ title, href, linkLabel = "Xem tất cả" }: Props) {
  return (
    <div className="mb-8 flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="type-h2">{title}</h2>
        {href && (
          <Link href={href} className="type-small link-underline shrink-0 py-2">
            {linkLabel}
          </Link>
        )}
      </div>
      <Divider variant="ornament" className="justify-start" />
    </div>
  );
}
