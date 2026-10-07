-- Thiệp và gói quà theo từng dòng hàng (mỗi sản phẩm một lời nhắn riêng).
-- Thêm cột, tương thích ngược: các cột giftMessage/giftWrap trên "Order" được giữ nguyên.
ALTER TABLE "OrderItem" ADD COLUMN "cardMessage" TEXT,
ADD COLUMN "giftWrap" BOOLEAN NOT NULL DEFAULT false;
