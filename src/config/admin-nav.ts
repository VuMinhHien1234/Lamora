export type AdminNavItem = {
  label: string;
  href: string;
  /** false: màn hình chưa làm, menu hiện mờ và ghi "Sắp có". Chuyển true khi xong bước tương ứng. */
  ready: boolean;
};

export const ADMIN_NAV: AdminNavItem[] = [
  { label: "Tổng quan", href: "/admin", ready: true },
  { label: "Đơn hàng", href: "/admin/don-hang", ready: false },
  { label: "Sản phẩm", href: "/admin/san-pham", ready: true },
  { label: "Danh mục", href: "/admin/danh-muc", ready: true },
  { label: "Bộ sưu tập", href: "/admin/bo-suu-tap", ready: true },
  { label: "Tài khoản", href: "/admin/tai-khoan", ready: true },
  { label: "Bộ component", href: "/admin/ui-kit", ready: true },
];
