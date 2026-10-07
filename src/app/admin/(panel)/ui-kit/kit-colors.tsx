import { KitSection } from "./kit-section";

// Mỗi dòng: tên token, mã màu (chỉ để hiển thị), vai trò, class nền. Class viết đủ để Tailwind nhận diện.
const COLORS = [
  { name: "ivory-50", hex: "#FCFAF6", role: "Nền trang chính", bg: "bg-ivory-50" },
  { name: "ivory-100", hex: "#F6F1EA", role: "Nền khối xen kẽ, nền ảnh", bg: "bg-ivory-100" },
  { name: "sand-200", hex: "#E9E0D4", role: "Đường viền, đường kẻ", bg: "bg-sand-200" },
  { name: "sand-300", hex: "#D9CCBC", role: "Viền khi hover", bg: "bg-sand-300" },
  { name: "stone-500", hex: "#6E625A", role: "Chữ phụ, placeholder", bg: "bg-stone-500" },
  { name: "ink-900", hex: "#2A2422", role: "Chữ chính, nút chính, footer", bg: "bg-ink-900" },
  { name: "blush-100", hex: "#F3E4E0", role: "Nền nhấn nhẹ", bg: "bg-blush-100" },
  { name: "rose-400", hex: "#C08A86", role: "Trang trí (không làm chữ)", bg: "bg-rose-400" },
  { name: "rose-700", hex: "#9A5B58", role: "Giá khuyến mãi, chữ nhấn", bg: "bg-rose-700" },
  { name: "sage-100", hex: "#E7EBE2", role: "Nền thông báo thành công", bg: "bg-sage-100" },
  { name: "sage-700", hex: "#5E6B57", role: "Chữ thành công, còn hàng", bg: "bg-sage-700" },
  { name: "gold-500", hex: "#B39566", role: "Đường kẻ mảnh, viền focus", bg: "bg-gold-500" },
  { name: "error-700", hex: "#A3433B", role: "Lỗi", bg: "bg-error-700" },
  { name: "warning-700", hex: "#8E6420", role: "Cảnh báo", bg: "bg-warning-700" },
];

export function KitColors() {
  return (
    <KitSection
      id="mau"
      title="Màu sắc"
      note="Tỉ lệ mỗi màn hình: khoảng 80% ngà · 15% nâu mực · tối đa 5% hồng/vàng."
    >
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {COLORS.map((color) => (
          <li key={color.name} className="flex items-center gap-4">
            <span className={`size-14 shrink-0 border border-sand-200 ${color.bg}`} />
            <span className="min-w-0">
              <span className="type-small block font-medium">{color.name}</span>
              <span className="type-small block text-stone-500">{color.hex}</span>
              <span className="type-small block text-stone-500">{color.role}</span>
            </span>
          </li>
        ))}
      </ul>
    </KitSection>
  );
}
