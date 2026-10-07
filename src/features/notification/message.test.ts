import { describe, expect, it } from "vitest";
import { escapeHtml, formatNewOrderMessage } from "./message";
import type { NewOrderNotice } from "./types";

const order: NewOrderNotice = {
  id: "ord1",
  code: "LMR-261005-K7QF",
  customerName: "Nguyễn <b>Hà</b> & Co",
  customerPhone: "0912345678",
  customerEmail: "ha@example.com",
  recipientName: "Trần Lan",
  recipientPhone: "0987654321",
  addressLine: "12 Hàng Bông",
  wardName: "Phường Hoàn Kiếm",
  provinceName: "Hà Nội",
  preferredDeliveryDate: new Date("2026-10-08T00:00:00Z"),
  isGift: true,
  customerNote: "Gọi trước khi giao",
  paymentMethod: "BANK_TRANSFER",
  subtotal: 920_000,
  shippingFee: 25_000,
  giftWrapFee: 20_000,
  total: 965_000,
  items: [
    {
      productName: "Mẫu đơn hồng phấn",
      variantLabel: "Hồng / Nhỏ",
      quantity: 1,
      unitPrice: 650_000,
      lineTotal: 650_000,
      cardMessage: "Chúc mừng sinh nhật <3",
      giftWrap: true,
    },
    {
      productName: "Cành hồng lụa trắng",
      variantLabel: null,
      quantity: 3,
      unitPrice: 90_000,
      lineTotal: 270_000,
      cardMessage: null,
      giftWrap: false,
    },
  ],
};

describe("formatNewOrderMessage", () => {
  const text = formatNewOrderMessage(order, "https://lamora.vn/");

  it("có mã đơn, các khoản tiền, hình thức thanh toán và link admin", () => {
    expect(text).toContain("ĐƠN MỚI · LMR-261005-K7QF");
    expect(text).toContain("Tạm tính: 920.000₫");
    expect(text).toContain("Phí giao hàng: 25.000₫");
    expect(text).toContain("Gói quà: 20.000₫");
    expect(text).toContain("Tổng: 965.000₫ · Chuyển khoản (chưa thanh toán)");
    expect(text).toContain("Mở đơn: https://lamora.vn/admin/don-hang/ord1");
  });

  it("có SĐT, email người đặt và người nhận", () => {
    expect(text).toContain("SĐT: 0912345678");
    expect(text).toContain("Email: ha@example.com");
    expect(text).toContain("Tên: Trần Lan");
    expect(text).toContain("SĐT: 0987654321");
  });

  it("có địa chỉ đầy đủ và ngày muốn nhận", () => {
    expect(text).toContain("Địa chỉ: 12 Hàng Bông, Phường Hoàn Kiếm, Hà Nội");
    expect(text).toContain("Ngày muốn nhận: 08/10/2026");
  });

  it("thiệp và gói quà nằm ngay dưới đúng sản phẩm của nó", () => {
    expect(text).toContain(
      "• Mẫu đơn hồng phấn (Hồng / Nhỏ)\n   650.000₫ × 1 = 650.000₫\n   🎁 Có gói quà\n   💌 Thiệp: “Chúc mừng sinh nhật &lt;3”",
    );
    expect(text).toContain("• Cành hồng lụa trắng\n   90.000₫ × 3 = 270.000₫\n\n");
    expect(text.match(/Thiệp:/g)).toHaveLength(1);
  });

  it("có ghi chú của khách", () => {
    expect(text).toContain("Ghi chú của khách: Gọi trước khi giao");
  });

  it("liệt kê sản phẩm kèm đơn giá, số lượng, thành tiền", () => {
    expect(text).toContain("• Mẫu đơn hồng phấn (Hồng / Nhỏ)\n   650.000₫ × 1 = 650.000₫");
    expect(text).toContain("• Cành hồng lụa trắng\n   90.000₫ × 3 = 270.000₫");
  });

  it("escape ký tự HTML trong tên khách", () => {
    expect(text).toContain("Nguyễn &lt;b&gt;Hà&lt;/b&gt; &amp; Co");
    expect(text).not.toContain("<b>");
  });

  it("đơn thường: bỏ khối thiệp, ghi (không có) khi thiếu email", () => {
    const plain = formatNewOrderMessage(
      {
        ...order,
        isGift: false,
        giftWrapFee: 0,
        customerNote: null,
        customerEmail: null,
        items: order.items.map((item) => ({ ...item, cardMessage: null, giftWrap: false })),
      },
      "https://lamora.vn",
    );
    expect(plain).not.toContain("Thiệp:");
    expect(plain).not.toContain("🎁");
    expect(plain).not.toContain("Gói quà:");
    expect(plain).toContain("Email: (không có)");
    expect(plain).toContain("📍 GIAO HÀNG");
  });
});

describe("khác", () => {
  it("escapeHtml", () => expect(escapeHtml("a<b>&")).toBe("a&lt;b&gt;&amp;"));
});
