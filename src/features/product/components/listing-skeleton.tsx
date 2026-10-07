import { Skeleton } from "@/components/ui/skeleton";

const CARD_COUNT = 8;

/** Khung xương của trang danh sách (S2–S5): đúng bố cục để trang không nhảy khi tải xong. */
export function ListingSkeleton() {
  return (
    <div className="page-container py-8 lg:py-12" aria-busy="true" aria-label="Đang tải">
      <Skeleton className="h-4 w-48" />
      <Skeleton className="mt-4 mb-8 h-10 w-72 lg:mb-12" />
      <div className="lg:grid lg:grid-cols-[14rem_1fr] lg:gap-10">
        <Skeleton className="mb-6 hidden h-96 lg:block" />
        <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:gap-x-6 lg:gap-y-12">
          {Array.from({ length: CARD_COUNT }, (_, index) => (
            <li key={index} className="flex flex-col gap-3">
              <Skeleton className="aspect-[4/5] w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/3" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
