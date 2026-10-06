// Thuần túy, không dùng node:crypto nên import được ở trình duyệt.
/** Nội dung chuyển khoản: mã đơn bỏ dấu gạch (docs/07 mục 2). */
export function transferContent(code: string): string {
  return code.replaceAll("-", "");
}
