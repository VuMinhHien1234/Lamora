import type { ProductDetail } from "../types";

/** Thông tin chung và SEO của sản phẩm trên form. */
export type GeneralValues = {
  name: string;
  slug: string;
  categoryId: string;
  shortDescription: string;
  description: string;
  material: string;
  careInstructions: string;
  isFeatured: boolean;
  seoTitle: string;
  seoDescription: string;
};

export function emptyGeneral(): GeneralValues {
  return {
    name: "",
    slug: "",
    categoryId: "",
    shortDescription: "",
    description: "",
    material: "",
    careInstructions: "",
    isFeatured: false,
    seoTitle: "",
    seoDescription: "",
  };
}

export function generalFromProduct(product: ProductDetail): GeneralValues {
  return {
    name: product.name,
    slug: product.slug,
    categoryId: product.categoryId,
    shortDescription: product.shortDescription ?? "",
    description: product.description ?? "",
    material: product.material ?? "",
    careInstructions: product.careInstructions ?? "",
    isFeatured: product.isFeatured,
    seoTitle: product.seoTitle ?? "",
    seoDescription: product.seoDescription ?? "",
  };
}
