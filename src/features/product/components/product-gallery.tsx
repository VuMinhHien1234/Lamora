"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { ShopImageView } from "../shop-types";

type GalleryProps = {
  images: ShopImageView[];
  productName: string;
  /** Ảnh cần đưa vào khung nhìn khi đổi màu (chỉ có tác dụng trên điện thoại). */
  focusImageId: string | null;
};

function useSwipeIndex(images: ShopImageView[], focusImageId: string | null) {
  const track = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const el = track.current;
    const target = images.findIndex((image) => image.id === focusImageId);
    if (!el || target < 0 || el.scrollWidth <= el.clientWidth) return;
    el.scrollTo({ left: target * el.clientWidth, behavior: "smooth" });
  }, [focusImageId, images]);

  const onScroll = (): void => {
    const el = track.current;
    if (el && el.clientWidth > 0) setIndex(Math.round(el.scrollLeft / el.clientWidth));
  };
  return { track, index, onScroll };
}

/** Điện thoại: vuốt ngang từng ảnh kèm chấm vị trí. Máy tính: lưới 2 cột cuộn dọc. */
export function ProductGallery({ images, productName, focusImageId }: GalleryProps) {
  const { track, index, onScroll } = useSwipeIndex(images, focusImageId);
  if (images.length === 0) {
    return (
      <div
        role="img"
        aria-label={`Chưa có ảnh ${productName}`}
        className="aspect-[4/5] bg-ivory-100"
      />
    );
  }
  return (
    <div>
      <ul
        ref={track}
        onScroll={onScroll}
        className="flex snap-x snap-mandatory [scrollbar-width:none] overflow-x-auto lg:grid lg:grid-cols-2 lg:gap-4 lg:overflow-visible [&::-webkit-scrollbar]:hidden"
      >
        {images.map((image, i) => (
          <li
            key={image.id}
            className="relative aspect-[4/5] w-full shrink-0 snap-center bg-ivory-100"
          >
            {image.url && (
              <Image
                src={image.url}
                alt={image.alt || productName}
                fill
                unoptimized
                priority={i === 0}
                sizes="(min-width: 1024px) 28vw, 100vw"
                className="object-cover"
              />
            )}
          </li>
        ))}
      </ul>
      {images.length > 1 && (
        <p aria-hidden className="mt-4 flex justify-center gap-2 lg:hidden">
          {images.map((image, i) => (
            <span
              key={image.id}
              className={cn("size-1.5", i === index ? "bg-ink-900" : "bg-sand-300")}
            />
          ))}
        </p>
      )}
    </div>
  );
}
