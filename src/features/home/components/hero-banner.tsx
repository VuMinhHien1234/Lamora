import Image from "next/image";
import { ButtonLink } from "@/components/ui/button";
import { HOME_HERO } from "@/config/site";
import { cloudinaryUrl } from "@/lib/cloudinary";

const HERO_WIDTH = 1800;

/** Banner đầu trang chủ: ảnh lớn + tiêu đề + nút. Chưa có ảnh thì hiện nền màu kem. */
export function HeroBanner() {
  const image = HOME_HERO.imagePublicId
    ? cloudinaryUrl(HOME_HERO.imagePublicId, { width: HERO_WIDTH, ratio: "16:9" })
    : null;
  return (
    <section className="relative isolate overflow-hidden bg-ivory-100">
      {image && (
        <Image
          src={image}
          alt={HOME_HERO.imageAlt}
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover"
        />
      )}
      <div className="page-container flex min-h-[26rem] flex-col items-start justify-center gap-5 py-16 md:min-h-[34rem] lg:py-24">
        <p className="type-eyebrow text-rose-700">{HOME_HERO.eyebrow}</p>
        <h1 className="type-display max-w-2xl">{HOME_HERO.title}</h1>
        <p className="type-lead max-w-xl text-stone-500">{HOME_HERO.description}</p>
        <ButtonLink href={HOME_HERO.ctaHref}>{HOME_HERO.ctaLabel}</ButtonLink>
      </div>
    </section>
  );
}
