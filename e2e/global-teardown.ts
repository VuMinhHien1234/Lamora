import { runSql } from "./db";

/** Dọn đơn do E2E tạo và trả lại tồn kho cho đơn còn giữ hàng. Chỉ chạy được trên database local. */
export default async function globalTeardown(): Promise<void> {
  await runSql(`
    update "ProductVariant" v set "stockQuantity" = v."stockQuantity" + s.qty
    from (
      select i."variantId", sum(i.quantity)::int as qty
      from "OrderItem" i join "Order" o on o.id = i."orderId"
      where o."customerName" like 'E2E %' and o.status not in ('CANCELLED', 'RETURNED')
        and i."variantId" is not null
      group by i."variantId"
    ) s where s."variantId" = v.id
  `);
  await runSql(`delete from "Order" where "customerName" like 'E2E %'`);
}
