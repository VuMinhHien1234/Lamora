import { AdminPageHeader } from "@/components/layout/admin-page-header";
import { EmptyState } from "@/components/ui/empty-state";

// Trang tạm: tổng quan thật (đơn chờ, doanh thu…) làm ở bước G8 (docs/06, M2).
export default function AdminHomePage() {
  return (
    <>
      <AdminPageHeader title="Tổng quan" />
      <EmptyState
        title="Chào mừng bạn đến khu quản trị"
        description="Số liệu đơn hàng và doanh thu sẽ hiện ở đây khi các màn hình quản lý được hoàn thiện."
      />
    </>
  );
}
