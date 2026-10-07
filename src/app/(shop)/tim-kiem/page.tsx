import type { Metadata } from "next";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { SearchBox, ShopListing, type RawSearchParams } from "@/features/product";

export const metadata: Metadata = {
  title: "Tìm kiếm",
  robots: { index: false, follow: true },
};

type PageProps = { searchParams: Promise<RawSearchParams> };

const MAX_QUERY_LENGTH = 100;

function readQuery(raw: RawSearchParams): string {
  const value = Array.isArray(raw.q) ? raw.q[0] : raw.q;
  return (value ?? "").trim().slice(0, MAX_QUERY_LENGTH);
}

/** S5 — Kết quả tìm kiếm. Chưa nhập từ khóa thì chỉ hiện ô tìm. */
export default async function SearchPage({ searchParams }: PageProps) {
  const raw = await searchParams;
  const q = readQuery(raw);
  return (
    <div className="page-container py-8 lg:py-12">
      <Breadcrumb items={[{ label: "Trang chủ", href: "/" }, { label: "Tìm kiếm" }]} />
      <header className="mt-4 mb-8 lg:mb-12">
        <h1 className="type-h1">{q ? `Kết quả cho “${q}”` : "Tìm kiếm"}</h1>
        <div className="mt-6 max-w-xl">
          <SearchBox defaultValue={q} />
        </div>
      </header>
      {q && (
        <ShopListing
          basePath="/tim-kiem"
          fixed={{ q }}
          searchParams={raw}
          emptyDescription="Thử từ khóa ngắn hơn hoặc xem tất cả sản phẩm."
        />
      )}
    </div>
  );
}
