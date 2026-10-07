import Link from "next/link";
import { buttonStyles } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { listFeaturedProducts, ProductGrid, SearchBox } from "@/features/product";
import ShopLayout from "./(shop)/layout";

const FEATURED_COUNT = 4;

/** S12 — 404: câu thông báo, ô tìm kiếm và vài sản phẩm nổi bật để khách không bị bỏ lại giữa chừng. */
export default async function NotFoundPage() {
  const featured = await listFeaturedProducts(FEATURED_COUNT).catch(() => []);
  return (
    <ShopLayout>
      <div className="page-container flex flex-col items-center gap-6 py-16 text-center lg:py-24">
        <Divider variant="ornament" />
        <h1 className="type-h1">Không tìm thấy trang</h1>
        <p className="type-lead max-w-md text-stone-500">
          Trang bạn mở không tồn tại hoặc đã được dời đi. Bạn thử tìm sản phẩm nhé.
        </p>
        <div className="w-full max-w-xl text-left">
          <SearchBox />
        </div>
        <Link href="/san-pham" className={buttonStyles({ variant: "secondary" })}>
          Xem tất cả sản phẩm
        </Link>
      </div>
      {featured.length > 0 && (
        <section className="page-container pb-16 lg:pb-24">
          <h2 className="type-h2 mb-8 text-center">Có thể bạn thích</h2>
          <ProductGrid products={featured} />
        </section>
      )}
    </ShopLayout>
  );
}
