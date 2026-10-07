import {
  ESTIMATED_DELIVERY_DAYS,
  FREE_SHIPPING_THRESHOLD,
  GIFT_WRAP_FEE,
  SHIPPING_FEES,
} from "@/config/shipping";
import { SITE } from "@/config/site";
import { formatVnd } from "@/lib/money";

// Nội dung các trang tĩnh (S11), viết bằng Markdown cơ bản: đoạn, tiêu đề, danh sách, **đậm**, *nghiêng*.
// Chủ shop sửa chữ ở đây, không cần sửa component. Các chỗ cần số liệu thật lấy từ config.

export type StaticPageSlug =
  "gioi-thieu" | "lien-he" | "chinh-sach-doi-tra" | "chinh-sach-van-chuyen" | "chinh-sach-bao-mat";

export type StaticPage = {
  slug: StaticPageSlug;
  title: string;
  description: string;
  body: string;
};

const ABOUT = `
## Câu chuyện của Lamora

Lamora Flower bắt đầu từ một ý nghĩ giản dị: có những đóa hoa đẹp đến mức ta muốn giữ chúng mãi. Hoa lụa cho ta điều đó, hoa không tàn, không cần chăm bẵm, vẫn dịu dàng như ngày đầu.

Mỗi bình hoa, giỏ hoa hay vòng hoa treo tường ở Lamora đều được chọn từng cành, phối màu và cắm sẵn bằng tay, để bạn nhận về là có thể đặt ngay lên bàn, kệ hay cửa nhà.

## Cam kết chất lượng

- Hoa lụa cao cấp, cánh mềm, màu tự nhiên, giữ dáng lâu.
- Kiểm tra từng sản phẩm trước khi đóng gói; đóng gói kỹ để hoa không móp khi vận chuyển.
- Thiệp lời nhắn miễn phí cho mỗi đơn quà tặng.
- Đổi trả trong 7 ngày nếu hoa lỗi hoặc hư hỏng do vận chuyển.

## Cần tư vấn?

Bạn chưa biết chọn hoa nào hợp với căn phòng hay dịp sắp tới? Hãy nhắn cho Lamora qua trang **Liên hệ**, shop sẽ gợi ý giúp bạn.
`;

const RETURNS = `
## Thời hạn và điều kiện

- Shop nhận đổi trả trong vòng **7 ngày** kể từ khi bạn nhận hàng.
- Áp dụng khi sản phẩm bị lỗi từ shop, giao sai mẫu/màu, hoặc hư hỏng trong quá trình vận chuyển.
- Sản phẩm cần còn nguyên trạng, chưa sử dụng, chưa qua chỉnh sửa; còn đủ hộp và phụ kiện đi kèm.

## Cách đổi trả

1. Nhắn cho shop qua Zalo hoặc Messenger, hoặc gọi ${SITE.contact.phone}, kèm **mã đơn** và vài tấm ảnh/video sản phẩm.
2. Shop xác nhận trong giờ làm việc và hướng dẫn cách gửi lại hàng.
3. Sau khi nhận lại hàng và kiểm tra, shop đổi sản phẩm mới hoặc hoàn tiền cho bạn.

## Lưu ý

- Hoa lụa là sản phẩm thủ công, màu sắc thực tế có thể chênh nhẹ so với ảnh do ánh sáng màn hình. Đây không phải là lỗi sản phẩm.
- Chi phí vận chuyển đổi trả do shop chịu khi lỗi thuộc về shop; trường hợp đổi ý, bạn chịu phí vận chuyển hai chiều.
- Tiền hoàn lại được chuyển về đúng phương thức bạn đã thanh toán trong vòng 3–5 ngày làm việc.
`;

const PRIVACY = `
## Thông tin shop thu thập

Khi bạn đặt hàng, shop thu thập: họ tên, số điện thoại, email (nếu có), địa chỉ giao hàng, lời nhắn/ghi chú đơn hàng. Shop không thu thập thông tin thẻ ngân hàng của bạn.

## Mục đích sử dụng

- Xử lý và giao đơn hàng, liên hệ xác nhận đơn.
- Hỗ trợ đổi trả, bảo hành và giải đáp thắc mắc.
- Tra cứu đơn hàng khi bạn nhập đúng mã đơn và số điện thoại.

Shop không bán hay trao đổi thông tin của bạn cho bên thứ ba vì mục đích quảng cáo. Thông tin chỉ chia sẻ với đơn vị vận chuyển ở mức cần thiết để giao hàng.

## Thời gian lưu trữ

Thông tin đơn hàng được lưu để phục vụ đổi trả, đối soát và nghĩa vụ kế toán theo quy định. Sau thời gian này shop sẽ xóa hoặc ẩn danh dữ liệu.

## Quyền của bạn

Bạn có thể yêu cầu xem, chỉnh sửa hoặc xóa thông tin cá nhân bằng cách liên hệ shop qua email ${SITE.contact.email} hoặc số điện thoại ${SITE.contact.phone}. Shop phản hồi trong vòng 7 ngày làm việc.

## Cookie

Website dùng cookie cần thiết để giữ giỏ hàng, xác nhận đơn vừa đặt và đăng nhập quản trị. Shop không dùng cookie quảng cáo.
`;

function shippingBody(): string {
  const rows = (Object.keys(SHIPPING_FEES) as (keyof typeof SHIPPING_FEES)[]).map((zone) => {
    const label = {
      HANOI_INNER: "Hà Nội",
      NORTH: "Miền Bắc (ngoài Hà Nội)",
      CENTRAL_SOUTH: "Từ Thanh Hóa trở vào",
    }[zone];
    return `- **${label}:** ${formatVnd(SHIPPING_FEES[zone])}, dự kiến ${ESTIMATED_DELIVERY_DAYS[zone]}`;
  });
  return `
## Phí vận chuyển theo khu vực

${rows.join("\n")}

**Miễn phí vận chuyển** cho đơn hàng từ ${formatVnd(FREE_SHIPPING_THRESHOLD)}.

## Thời gian giao hàng

Thời gian trên tính từ lúc shop xác nhận đơn, không gồm Chủ nhật và ngày lễ. Bạn có thể chọn **ngày muốn nhận** khi đặt hàng, shop sẽ cố gắng giao đúng ngày.

## Gói quà

Gói quà kèm thiệp lời nhắn có phí ${formatVnd(GIFT_WRAP_FEE)}. Thiệp lời nhắn luôn miễn phí.

## Kiểm tra hàng khi nhận

Bạn vui lòng quay video lúc mở hộp. Nếu sản phẩm móp hoặc hư hỏng, hãy báo shop trong vòng 48 giờ kèm video/ảnh để được hỗ trợ đổi trả.
`;
}

export function getStaticPage(slug: string): StaticPage | null {
  const pages: StaticPage[] = [
    {
      slug: "gioi-thieu",
      title: "Giới thiệu",
      description: "Câu chuyện của Lamora Flower và cam kết chất lượng cho từng đóa hoa lụa.",
      body: ABOUT,
    },
    {
      slug: "lien-he",
      title: "Liên hệ",
      description: "Số điện thoại, Zalo, Messenger, email và giờ làm việc của Lamora Flower.",
      body: "",
    },
    {
      slug: "chinh-sach-doi-tra",
      title: "Chính sách đổi trả",
      description: "Điều kiện, thời hạn 7 ngày và cách đổi trả sản phẩm tại Lamora Flower.",
      body: RETURNS,
    },
    {
      slug: "chinh-sach-van-chuyen",
      title: "Chính sách vận chuyển",
      description: "Bảng phí vận chuyển theo khu vực, thời gian giao dự kiến và miễn phí ship.",
      body: shippingBody(),
    },
    {
      slug: "chinh-sach-bao-mat",
      title: "Chính sách bảo mật",
      description: "Dữ liệu cá nhân Lamora Flower thu thập, mục đích sử dụng và quyền của bạn.",
      body: PRIVACY,
    },
  ];
  return pages.find((page) => page.slug === slug) ?? null;
}

export const STATIC_PAGE_SLUGS: StaticPageSlug[] = [
  "gioi-thieu",
  "lien-he",
  "chinh-sach-doi-tra",
  "chinh-sach-van-chuyen",
  "chinh-sach-bao-mat",
];
