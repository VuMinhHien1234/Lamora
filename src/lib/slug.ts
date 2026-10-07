/** Bỏ dấu tiếng Việt: "Bình hoa Mẫu đơn" → "Binh hoa Mau don". */
export function removeVietnameseTones(text: string): string {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D");
}

/** "Bình hoa Mẫu đơn Lamora!" → "binh-hoa-mau-don-lamora". Rỗng nếu không còn ký tự hợp lệ. */
export function slugify(text: string): string {
  return removeVietnameseTones(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Chuỗi tìm kiếm không dấu, chữ thường, gộp khoảng trắng (cột Product.searchText). */
export function toSearchText(...parts: Array<string | null | undefined>): string {
  return removeVietnameseTones(parts.filter(Boolean).join(" "))
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}
