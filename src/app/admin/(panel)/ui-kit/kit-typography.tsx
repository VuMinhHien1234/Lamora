import { KitSection } from "./kit-section";

export function KitTypography() {
  return (
    <KitSection
      id="chu"
      title="Chữ"
      note="Cormorant Garamond cho tiêu đề và giá · Be Vietnam Pro cho nội dung. Kiểm tra dấu tiếng Việt ở cỡ lớn."
    >
      <p className="type-eyebrow text-stone-500">Bộ sưu tập</p>
      <p className="type-display">
        Hoa lụa Lamora — những đóa mẫu đơn <em>ửng hồng</em>, dịu dàng và bền lâu
      </p>
      <div className="flex flex-col gap-4">
        <h1 className="type-h1">H1 · Mẫu đơn hồng phấn ẩn ộ ữ ở</h1>
        <h2 className="type-h2">H2 · Quà tặng mùa Thu</h2>
        <h3 className="type-h3">H3 · Bình hoa hồng champagne</h3>
        <p className="type-lead max-w-prose">
          Lead · Mỗi đóa hoa được làm từ lụa cao cấp, giữ nguyên dáng cánh mềm như hoa tươi mà không
          tàn.
        </p>
        <p className="type-body max-w-prose">
          Body · Hoa lụa không cần tưới nước, không phai màu dưới nắng gián tiếp và chỉ cần lau nhẹ
          bằng khăn mềm khi bám bụi. Bạn có thể đặt ở phòng khách, bàn làm việc hoặc làm quà tặng.
        </p>
        <p className="type-small max-w-prose text-stone-500">
          Small · Chú thích, thông tin phụ, thời gian giao hàng dự kiến.
        </p>
        <p className="type-price">Price · 650.000₫</p>
        <p className="type-eyebrow">Eyebrow · Thêm vào giỏ</p>
      </div>
    </KitSection>
  );
}
