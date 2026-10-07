import Link from "next/link";
import { buttonStyles } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { buildShopUrl, type ShopListState } from "../shop-url";

type Props = { basePath: string; state: ShopListState; filtered: boolean; description?: string };

/** Trạng thái rỗng: có đang lọc thì gợi ý "Xóa bộ lọc". */
export function ShopEmpty({ basePath, state, filtered, description }: Props) {
  const clearHref = buildShopUrl(basePath, state, {
    colors: [],
    priceMin: undefined,
    priceMax: undefined,
    page: 1,
  });
  return (
    <EmptyState
      title="Chưa có sản phẩm phù hợp"
      description={filtered ? "Thử bỏ bớt bộ lọc để xem thêm sản phẩm." : description}
      action={
        filtered ? (
          <Link href={clearHref} className={buttonStyles({ variant: "secondary" })}>
            Xóa bộ lọc
          </Link>
        ) : undefined
      }
    />
  );
}
