export const PRODUCT_STATUSES = ["draft", "published", "archived"] as const;
export type ProductStatus = (typeof PRODUCT_STATUSES)[number];

export const CATEGORY_STATUSES = ["draft", "published"] as const;
export type CategoryStatus = (typeof CATEGORY_STATUSES)[number];

export const BRAND_STATUSES = ["draft", "published", "archived"] as const;
export type BrandStatus = (typeof BRAND_STATUSES)[number];

export const BRAND_VISIBILITY = ["Featured", "Standard", "Hidden"] as const;
export type BrandVisibility = (typeof BRAND_VISIBILITY)[number];

export const ATTRIBUTE_STATUSES = ["active", "draft"] as const;
export type AttributeStatus = (typeof ATTRIBUTE_STATUSES)[number];

export const ATTRIBUTE_DISPLAY_TYPES = ["Dropdown", "Swatch", "Text"] as const;
export type AttributeDisplayType = (typeof ATTRIBUTE_DISPLAY_TYPES)[number];

export type ProductDto = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  status: ProductStatus;
  categoryId?: string;
  categoryName?: string;
  brandId?: string;
  brandName?: string;
  images: string[];
  attributes: Record<string, string | string[]>;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};

export type CategoryDto = {
  id: string;
  name: string;
  slug: string;
  image: string;
  status: CategoryStatus;
  productCount: number;
  createdAt: string;
  updatedAt: string;
};

export type BrandDto = {
  id: string;
  name: string;
  slug: string;
  website: string;
  initials: string;
  tileClass: string;
  visibility: BrandVisibility;
  status: BrandStatus;
  productCount: number;
  createdAt: string;
  updatedAt: string;
};

export type AttributeDto = {
  id: string;
  name: string;
  slug: string;
  displayType: AttributeDisplayType;
  description: string;
  status: AttributeStatus;
  values: string[];
  productCount: number;
  createdAt: string;
  updatedAt: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
};
