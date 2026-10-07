import { NextResponse, type NextRequest } from "next/server";
import { searchSuggestions } from "@/features/product";

export const dynamic = "force-dynamic";

const MAX_QUERY_LENGTH = 100;

/** Gợi ý tìm kiếm cho ô tìm (S5): tối đa 6 sản phẩm đang bán; từ khóa ngắn hơn 2 ký tự trả danh sách rỗng. */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const q = (request.nextUrl.searchParams.get("q") ?? "").slice(0, MAX_QUERY_LENGTH);
  const items = await searchSuggestions(q);
  return NextResponse.json(items, { headers: { "Cache-Control": "public, max-age=30" } });
}
