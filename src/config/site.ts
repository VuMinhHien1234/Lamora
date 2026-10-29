// Thông tin shop dùng ở header, footer, nút chat, SEO. Sửa ở đây, không sửa trong component.
// Các giá trị đánh dấu "ĐIỀN" là chỗ giữ tạm, chủ shop thay bằng thông tin thật trước khi ra mắt.

export const SITE = {
  name: "Lamora Flower",
  tagline: "Hoa lụa cao cấp",
  description:
    "Lamora Flower — hoa lụa cao cấp, những đóa hoa dịu dàng và bền lâu cho căn nhà và những dịp đặc biệt của bạn.",
  contact: {
    phone: "0357829080", // ĐIỀN: số điện thoại shop
    email: "xinchao@lamoraflower.vn", // ĐIỀN
    hours: "08:00 – 21:00, mỗi ngày",
    address: "Hà Nội", // ĐIỀN: địa chỉ/khu vực hiển thị
    zaloUrl: "https://zalo.me/0357829080", // ĐIỀN: ví dụ https://zalo.me/0900000000 (để trống thì ẩn nút Zalo)
    messengerUrl: "", // ĐIỀN: ví dụ https://m.me/ten-trang (để trống thì ẩn nút Messenger)
  },
  /** Thông tin người bán hiển thị ở chân trang và trang chính sách (docs/08 Phần IV). */
  seller: {
    name: "Lamora Flower", // ĐIỀN: tên chủ shop / hộ kinh doanh
    taxCode: "", // ĐIỀN: mã số thuế (nếu có; để trống thì ẩn)
  },
  social: {
    threads: "", // ĐIỀN: link Threads của shop (để trống thì ẩn)
    instagram: "https://www.instagram.com/lamora.flowers.shop",
    tiktok: "https://www.tiktok.com/@lamora.flower",
  },
} as const;

export type NavLink = { label: string; href: string };

// Menu chính. Mega menu theo danh mục sẽ thay thế mục "Sản phẩm" ở bước B1.
/** Menu dự phòng khi chưa đọc được danh mục từ database; menu thật dựng từ danh mục đang bật. */
export const MAIN_NAV: NavLink[] = [{ label: "Tất cả sản phẩm", href: "/san-pham" }];

export const FOOTER_SUPPORT_LINKS: NavLink[] = [
  { label: "Tra cứu đơn hàng", href: "/tra-cuu-don" },
  { label: "Chính sách đổi trả", href: "/chinh-sach-doi-tra" },
  { label: "Chính sách vận chuyển", href: "/chinh-sach-van-chuyen" },
  { label: "Chính sách bảo mật", href: "/chinh-sach-bao-mat" },
];

export const FOOTER_ABOUT_LINKS: NavLink[] = [
  { label: "Giới thiệu", href: "/gioi-thieu" },
  { label: "Liên hệ", href: "/lien-he" },
];

/** Banner trang chủ (P0 lấy từ đây). Để `imagePublicId` trống thì hiện nền màu kem; điền publicId ảnh Cloudinary khi đã có ảnh. */
export const HOME_HERO = {
  eyebrow: "Hoa lụa cao cấp",
  title: "Những đóa hoa dịu dàng, bền lâu cùng năm tháng",
  description:
    "Bình hoa, giỏ hoa và hoa treo tường làm thủ công, cắm sẵn để bạn chỉ việc đặt lên bàn.",
  ctaLabel: "Xem bộ sưu tập",
  ctaHref: "/san-pham",
  imagePublicId: "", // ĐIỀN: publicId ảnh banner trên Cloudinary
  imageAlt: "Bình hoa lụa Lamora Flower đặt trên bàn gỗ",
} as const;

/** Bốn cam kết dưới trang chủ (docs/05 mục 4). */
export const BRAND_PROMISES: { title: string; description: string }[] = [
  { title: "Hoa lụa cao cấp", description: "Chất liệu mềm, màu tự nhiên, giữ dáng lâu." },
  { title: "Thiệp lời nhắn miễn phí", description: "Gửi tặng người thương kèm lời chúc riêng." },
  { title: "Giao toàn quốc", description: "Đóng gói kỹ, shop báo phí vận chuyển khi liên hệ." },
  { title: "Đổi trả trong 7 ngày", description: "Hoa móp hoặc lỗi do vận chuyển, shop đổi mới." },
];
