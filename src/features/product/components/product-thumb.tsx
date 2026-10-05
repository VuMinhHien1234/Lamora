import Image from "next/image";
import { cloudinaryUrl } from "@/lib/cloudinary";

const WIDTH = 48;
const HEIGHT = 60;

type ProductThumbProps = { publicId: string | null; alt: string | null; name: string };

/** Ảnh nhỏ 4:5 ở bảng. Chưa có ảnh (hoặc chưa cấu hình Cloudinary) thì hiện ô trống cùng kích thước. */
export function ProductThumb({ publicId, alt, name }: ProductThumbProps) {
  const url = publicId ? cloudinaryUrl(publicId, { width: WIDTH * 2 }) : null;
  if (!url) {
    return (
      <div
        aria-hidden
        className="h-[3.75rem] w-12 shrink-0 bg-sand-200"
        title={`Chưa có ảnh: ${name}`}
      />
    );
  }
  return (
    <Image
      src={url}
      alt={alt ?? name}
      width={WIDTH}
      height={HEIGHT}
      unoptimized
      className="h-[3.75rem] w-12 shrink-0 object-cover"
    />
  );
}
