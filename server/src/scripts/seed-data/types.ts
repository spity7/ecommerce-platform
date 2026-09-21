export type SeedCategory = {
  name: string;
  slug: string;
  image: string;
  status: "published" | "draft";
};

export type SeedBrand = {
  name: string;
  slug: string;
  website: string;
  initials: string;
  tileClass: string;
  visibility: "Featured" | "Standard";
  status: "published" | "draft";
};

export type SeedAttribute = {
  name: string;
  slug: string;
  displayType: "Dropdown" | "Swatch" | "Text";
  description: string;
  status: "published" | "draft";
  values: string[];
};

export type SeedProduct = {
  name: string;
  slug: string;
  sku: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  status: "published" | "draft";
  images: string[];
  /** Must match a slug in `categories`; resolved to `categoryId` at insert. */
  categorySlug: string;
  brandSlug?: string;
  attributes?: Record<string, string>;
  metadata?: Record<string, unknown>;
  unitsSold?: number;
};

export type SiteSeedData = {
  label: string;
  categories: SeedCategory[];
  brands: SeedBrand[];
  attributes: SeedAttribute[];
  products: SeedProduct[];
  primaryCategorySlug: string;
  primaryBrandSlug: string;
};
