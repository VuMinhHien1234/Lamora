import Image from "next/image";
import Link from "next/link";
import type { CategoryNode } from "@/features/category";
import { cloudinaryUrl } from "@/lib/cloudinary";

const SHORTCUT_WIDTH = 240;

function Shortcut({ category }: { category: CategoryNode }) {
  const image = category.imagePublicId
    ? cloudinaryUrl(category.imagePublicId, { width: SHORTCUT_WIDTH, ratio: "1:1" })
    : null;
  return (
    <Link
      href={`/danh-muc/${category.slug}`}
      className="group flex w-28 shrink-0 snap-start flex-col items-center gap-3 md:w-auto"
    >
      <span className="relative block aspect-square w-full overflow-hidden bg-ivory-100">
        {image && (
          <Image
            src={image}
            alt={`Danh mục ${category.name}`}
            fill
            sizes="(min-width: 768px) 16vw, 112px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        )}
      </span>
      <span className="type-small text-center">{category.name}</span>
    </Link>
  );
}

/** Các danh mục dạng ô ảnh vuông; cuộn ngang trên điện thoại. */
export function CategoryShortcuts({ categories }: { categories: CategoryNode[] }) {
  if (categories.length === 0) return null;
  return (
    <section aria-label="Danh mục sản phẩm" className="page-container py-12 lg:py-16">
      <ul className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 md:mx-0 md:grid md:grid-cols-5 md:gap-6 md:overflow-visible md:px-0">
        {categories.map((category) => (
          <li key={category.id} className="contents">
            <Shortcut category={category} />
          </li>
        ))}
      </ul>
    </section>
  );
}
