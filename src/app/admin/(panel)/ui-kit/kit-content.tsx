import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Divider } from "@/components/ui/divider";
import { Tabs } from "@/components/ui/tabs";
import { KitRow, KitSection } from "./kit-section";

const TABS = [
  {
    id: "mota",
    label: "Mô tả",
    content: <p className="type-body text-stone-500">Hoa lụa cao cấp, cành thép bọc nhựa.</p>,
  },
  {
    id: "chamsoc",
    label: "Bảo quản",
    content: <p className="type-body text-stone-500">Lau nhẹ bằng khăn mềm, tránh nắng gắt.</p>,
  },
  {
    id: "giaohang",
    label: "Giao hàng",
    content: <p className="type-body text-stone-500">Giao 1–3 ngày tùy khu vực.</p>,
  },
];

export function KitContent() {
  return (
    <KitSection id="noi-dung" title="Điều hướng và nội dung">
      <KitRow label="Breadcrumb">
        <Breadcrumb
          items={[
            { label: "Trang chủ", href: "/" },
            { label: "Bình hoa cắm sẵn", href: "/" },
            { label: "Mẫu đơn hồng phấn" },
          ]}
        />
      </KitRow>
      <Tabs items={TABS} />
      <Accordion>
        <AccordionItem title="Chất liệu" defaultOpen>
          Lụa cao cấp, cành thép bọc nhựa, bình gốm men rạn.
        </AccordionItem>
        <AccordionItem title="Hướng dẫn bảo quản">
          Lau bụi bằng khăn mềm hoặc máy sấy chế độ mát.
        </AccordionItem>
        <AccordionItem title="Đổi trả">Đổi trong 7 ngày nếu sản phẩm lỗi.</AccordionItem>
      </Accordion>
      <KitRow label="Đường phân cách">
        <div className="w-full space-y-6">
          <Divider />
          <Divider variant="ornament" />
        </div>
      </KitRow>
    </KitSection>
  );
}
