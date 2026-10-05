import { Button, ButtonLink } from "@/components/ui/button";
import { KitRow, KitSection } from "./kit-section";

export function KitButtons() {
  return (
    <KitSection
      id="nut"
      title="Nút"
      note="Cao 48px (điện thoại) / 52px (máy tính); admin 40px. Hover primary chuyển sang rose-700."
    >
      <KitRow label="Biến thể">
        <Button variant="primary">Thêm vào giỏ</Button>
        <Button variant="secondary">Mua ngay</Button>
        <Button variant="ghost">Xem tất cả</Button>
        <Button variant="subtle">Nút phụ (admin)</Button>
        <Button variant="danger">Hủy đơn (admin)</Button>
      </KitRow>
      <KitRow label="Trạng thái">
        <Button variant="primary" loading>
          Đang xử lý
        </Button>
        <Button variant="secondary" disabled>
          Đã khóa
        </Button>
        <ButtonLink href="/admin" variant="secondary">
          Liên kết dạng nút
        </ButtonLink>
      </KitRow>
      <KitRow label="Toàn chiều rộng">
        <div className="w-full max-w-sm">
          <Button variant="primary" fullWidth>
            Đặt hàng
          </Button>
        </div>
      </KitRow>
    </KitSection>
  );
}
