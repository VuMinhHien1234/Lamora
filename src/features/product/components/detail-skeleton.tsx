import { Skeleton } from "@/components/ui/skeleton";

/** Khung xương của trang chi tiết sản phẩm (S6): ảnh bên trái, thông tin bên phải. */
export function DetailSkeleton() {
  return (
    <div className="page-container py-6 lg:py-10" aria-busy="true" aria-label="Đang tải">
      <Skeleton className="h-4 w-56" />
      <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-14">
        <Skeleton className="aspect-[4/5] w-full" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  );
}
