export type AdminUser = {
  id: string;
  email: string;
  name: string;
  mustChangePassword: boolean;
};

/** Phần của người dùng trong phiên đăng nhập mà logic phân quyền cần xem. */
export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role?: string | null;
  mustChangePassword?: boolean | null;
};
