import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Price } from "@/components/ui/price";
import { cn } from "@/lib/utils";
import type { ColorSwatchData, ProductCard as ProductCardData } from "../shop-types";

const MAX_DOTS = 4;

function Dots({ swatches }: { swatches: ColorSwatchData[] }) {
  if (swatches.length === 0) return null;
  const shown = swatches.slice(0, MAX_DOTS);
  const rest = swatches.length - shown.length;
  return (
    <p className="flex items-center gap-1.5" aria-label={`${swatches.length} màu`}>
      {shown.map((swatch) => (
        <span
          key={swatch.name}
          title={swatch.name}
          style={{ backgroundColor: swatch.hex }}
          className={cn(
            "block size-3.5 rounded-full border border-sand-200",
            swatch.soldOut && "opacity-40",
          )}
        />
      ))}
      {rest > 0 && <span className="type-small text-stone-500">+{rest}</span>}
    </p>
  );
}

type ProductCardProps = {
  product: ProductCardData;
  /** Ảnh đầu trang nên tải ngay (LCP); còn lại tải lười. */
  priority?: boolean;
};

/** Thẻ sản phẩm (docs/03 mục 8.1): bấm cả thẻ để vào chi tiết. Không có nút mua trên thẻ. */
export function ProductCard({ product, priority }: ProductCardProps) {
  return (
    <article className="group">
      <Link href={`/san-pham/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-ivory-100">
          {product.imageUrl && (
            <Image
              src={product.imageUrl}
              alt={product.imageAlt}
              fill
              unoptimized
              priority={priority}
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
              className={cn(
                "object-cover transition-transform duration-500 ease-soft group-hover:scale-[1.03]",
                product.isOutOfStock && "opacity-70",
              )}
            />
          )}
          {product.isOutOfStock && (
            <Badge tone="outline" className="absolute top-3 left-3">
              Hết hàng
            </Badge>
          )}
        </div>
        <div className="mt-3 grid gap-1.5">
          <h3 className="type-body font-medium">{product.name}</h3>
          <Dots swatches={product.colorSwatches} />
          <Price price={product.priceFrom} compareAtPrice={product.compareAtPriceFrom} from />
        </div>
      </Link>
    </article>
  );
}
