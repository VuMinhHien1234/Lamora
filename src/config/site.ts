// Thông tin shop dùng ở header, footer, nút chat, SEO. Sửa ở đây, không sửa trong component.
// Các giá trị đánh dấu "ĐIỀN" là chỗ giữ tạm, chủ shop thay bằng thông tin thật trước khi ra mắt.

export const SITE = {
  name: "Lamora Flower",
  tagline: "Hoa lụa cao cấp",
  description:
    "Lamora Flower — hoa lụa cao cấp, những đóa hoa dịu dàng và bền lâu cho căn nhà và những dịp đặc biệt của bạn.",
  contact: {
    phone: "0900 000 000", // ĐIỀN: số điện thoại shop
    email: "xinchao@lamoraflower.vn", // ĐIỀN
    hours: "08:00 – 21:00, mỗi ngày",
    address: "Hà Nội", // ĐIỀN: địa chỉ/khu vực hiển thị
    zaloUrl: "", // ĐIỀN: ví dụ https://zalo.me/0900000000 (để trống thì ẩn nút Zalo)
    messengerUrl: "", // ĐIỀN: ví dụ https://m.me/ten-trang (để trống thì ẩn nút Messenger)
  },
  social: {
    facebook: "", // ĐIỀN (để trống thì ẩn)
    instagram: "", // ĐIỀN
    tiktok: "", // ĐIỀN
  },
} as const;

export type NavLink = { label: string; href: string };

// Menu chính. Mega menu theo danh mục sẽ thay thế mục "Sản phẩm" ở bước B1.
export const MAIN_NAV: NavLink[] = [
  { label: "Sản phẩm", href: "/san-pham" },
  { label: "Bộ sưu tập", href: "/san-pham" },
  { label: "Quà tặng", href: "/san-pham" },
];

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
