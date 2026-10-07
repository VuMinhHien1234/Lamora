import { z } from "zod";

export const SHOP_PAGE_SIZE = 24;
export const SHOP_SORTS = ["newest", "price_asc", "price_desc", "featured"] as const;
const MAX_PRICE = 100_000_000;

const optionalSlug = z.string().trim().min(1).max(120).optional();

export const shopListSchema = z.object({
  categorySlug: optionalSlug,
  collectionSlug: optionalSlug,
  q: z.string().trim().max(100).optional(),
  colors: z.array(z.string().trim().min(1).max(40)).max(10).optional(),
  priceMin: z.number().int().min(0).max(MAX_PRICE).optional(),
  priceMax: z.number().int().min(0).max(MAX_PRICE).optional(),
  sort: z.enum(SHOP_SORTS).default("newest"),
  page: z.number().int().min(1).max(1000).default(1),
});

export type ShopListInput = z.infer<typeof shopListSchema>;
export type ShopListQuery = z.input<typeof shopListSchema>;
