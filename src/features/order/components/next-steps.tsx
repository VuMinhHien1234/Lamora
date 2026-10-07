import Link from "next/link";
import { SITE } from "@/config/site";
import { buttonStyles } from "@/components/ui/button";

/** Việc tiếp theo sau khi đặt hàng. */
export function NextSteps() {
  const zalo = SITE.contact.zaloUrl;
  return (
    <section aria-labelledby="next-title" className="flex flex-col items-center gap-4 text-center">
      <h2 id="next-title" className="type-h3">
        Tiếp theo
      </h2>
      <p className="type-body max-w-md text-stone-500">
        Shop sẽ gọi xác nhận đơn trong giờ làm việc. Bạn có thể tra cứu tình trạng đơn bất cứ lúc
        nào bằng mã đơn và số điện thoại.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/tra-cuu-don" className={buttonStyles({ variant: "secondary" })}>
          Tra cứu đơn hàng
        </Link>
        {zalo && (
          <a
            href={zalo}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonStyles({ variant: "secondary" })}
          >
            Nhắn Zalo cho shop
          </a>
        )}
        <Link href="/san-pham" className={buttonStyles({ variant: "ghost" })}>
          Tiếp tục mua sắm
        </Link>
      </div>
    </section>
  );
}
