// Hằng số phí giao hàng (docs/07 mục 3). Chủ shop sửa số ở đây, không sửa trong code xử lý.

export type ShippingZone = "HANOI_INNER" | "NORTH" | "CENTRAL_SOUTH";

export const SHIPPING_FEES: Record<ShippingZone, number> = {
  HANOI_INNER: 25_000,
  NORTH: 35_000,
  CENTRAL_SOUTH: 40_000,
};

export const ESTIMATED_DELIVERY_DAYS: Record<ShippingZone, string> = {
  HANOI_INNER: "1–2 ngày",
  NORTH: "2–3 ngày",
  CENTRAL_SOUTH: "3–5 ngày",
};

/**
 * Bật/tắt việc tính và hiển thị phí giao hàng.
 * false = web không tính phí ship (luôn 0đ) và không hiện dòng phí; shop báo phí khi liên hệ khách.
 * Muốn bật lại: đổi thành true.
 */
export const SHIPPING_FEE_ENABLED = false;

export const FREE_SHIPPING_THRESHOLD = 800_000;
export const GIFT_WRAP_FEE = 20_000;
/** Độ dài tối đa lời nhắn thiệp (dùng ở giỏ hàng, thanh toán và kiểm tra ở server). */
export const GIFT_MESSAGE_MAX = 300;

/** Mã tỉnh (NSO, 2 chữ số) của Hà Nội. */
export const HANOI_PROVINCE_CODE = "01";

/**
 * Các tỉnh/thành thuộc vùng NORTH (miền Bắc ngoài Hà Nội). Tỉnh không nằm ở đây hoặc Hà Nội
 * thì là CENTRAL_SOUTH (từ Thanh Hóa trở vào).
 * 31 Hải Phòng · 22 Quảng Ninh · 24 Bắc Ninh · 33 Hưng Yên · 37 Ninh Bình · 25 Phú Thọ ·
 * 19 Thái Nguyên · 08 Tuyên Quang · 15 Lào Cai · 04 Cao Bằng · 20 Lạng Sơn · 12 Lai Châu ·
 * 11 Điện Biên · 14 Sơn La
 */
export const NORTH_PROVINCE_CODES: readonly string[] = [
  "31",
  "22",
  "24",
  "33",
  "37",
  "25",
  "19",
  "08",
  "15",
  "04",
  "20",
  "12",
  "11",
  "14",
];

/** Đơn vị vận chuyển gợi ý khi chuyển đơn sang "Đang giao" (docs/07 mục 3.5). */
export const CARRIERS: readonly string[] = [
  "Giao Hàng Nhanh",
  "Giao Hàng Tiết Kiệm",
  "Viettel Post",
  "J&T Express",
  "Tự giao",
  "Khác",
];
