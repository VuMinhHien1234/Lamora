import { formatVnd } from "@/lib/money";
import { formatDate } from "@/lib/date";
import type { NewOrderNotice } from "./types";

/** Telegram (parse_mode HTML) chỉ cần escape ba ký tự này. */
export function escapeHtml(text: string): string {
  return text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function itemLine(item: NewOrderNotice["items"][number]): string {
  const name = escapeHtml(
    item.variantLabel ? `${item.productName} (${item.variantLabel})` : item.productName,
  );
  const lines = [
    `• ${name}`,
    `   ${formatVnd(item.unitPrice)} × ${item.quantity} = ${formatVnd(item.lineTotal)}`,
  ];
  if (item.giftWrap) lines.push("   🎁 Có gói quà");
  if (item.cardMessage) lines.push(`   💌 Thiệp: “${escapeHtml(item.cardMessage)}”`);
  return lines.join("\n");
}

function paymentText(method: NewOrderNotice["paymentMethod"]): string {
  return method === "COD" ? "COD (thu tiền khi giao)" : "Chuyển khoản (chưa thanh toán)";
}

function customerLines(order: NewOrderNotice): string[] {
  return [
    "👤 NGƯỜI ĐẶT",
    `Tên: ${escapeHtml(order.customerName)}`,
    `SĐT: ${order.customerPhone}`,
    `Email: ${order.customerEmail ? escapeHtml(order.customerEmail) : "(không có)"}`,
  ];
}

function deliveryLines(order: NewOrderNotice): string[] {
  const lines = [
    order.isGift ? "📍 NGƯỜI NHẬN (giao cho người khác)" : "📍 GIAO HÀNG",
    `Tên: ${escapeHtml(order.recipientName)}`,
    `SĐT: ${order.recipientPhone}`,
    `Địa chỉ: ${escapeHtml(order.addressLine)}, ${escapeHtml(order.wardName)}, ${escapeHtml(order.provinceName)}`,
  ];
  if (order.preferredDeliveryDate) {
    lines.push(`Ngày muốn nhận: ${formatDate(order.preferredDeliveryDate)}`);
  }
  return lines;
}

function noteLines(order: NewOrderNotice): string[] {
  if (!order.customerNote) return [];
  return ["📝 GHI CHÚ", `Ghi chú của khách: ${escapeHtml(order.customerNote)}`];
}

function totalLines(order: NewOrderNotice): string[] {
  const lines = [`Tạm tính: ${formatVnd(order.subtotal)}`];
  lines.push(`Phí giao hàng: ${formatVnd(order.shippingFee)}`);
  if (order.giftWrapFee > 0) lines.push(`Gói quà: ${formatVnd(order.giftWrapFee)}`);
  lines.push(`Tổng: ${formatVnd(order.total)} · ${paymentText(order.paymentMethod)}`);
  return lines;
}

/** Tin nhắn "đơn mới" gửi chủ shop (docs/07 mục 4.3): đủ thông tin để chuẩn bị và giao hàng. */
export function formatNewOrderMessage(order: NewOrderNotice, siteUrl: string): string {
  const sections = [
    [`🌸 ĐƠN MỚI · ${order.code}`],
    customerLines(order),
    deliveryLines(order),
    ["🛍 SẢN PHẨM", ...order.items.map(itemLine)],
    noteLines(order),
    totalLines(order),
    [`Mở đơn: ${siteUrl.replace(/\/$/, "")}/admin/don-hang/${order.id}`],
  ];
  return sections
    .filter((lines) => lines.length > 0)
    .map((lines) => lines.join("\n"))
    .join("\n\n");
}
