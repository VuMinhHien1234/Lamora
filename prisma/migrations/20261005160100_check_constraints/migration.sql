-- Ràng buộc mà Prisma schema không diễn tả được (docs/02 mục 5): tồn kho không âm, số lượng 1–99.
ALTER TABLE "ProductVariant" ADD CONSTRAINT "stock_non_negative" CHECK ("stockQuantity" >= 0);
ALTER TABLE "OrderItem" ADD CONSTRAINT "quantity_range" CHECK ("quantity" BETWEEN 1 AND 99);
