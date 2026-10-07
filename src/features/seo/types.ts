export type SitemapRow = { slug: string; updatedAt: Date };

export type SitemapSource = {
  products: SitemapRow[];
  categories: SitemapRow[];
  collections: SitemapRow[];
};

export type SitemapEntry = {
  path: string;
  lastModified?: Date;
  changeFrequency: "daily" | "weekly" | "monthly";
  priority: number;
};
