import type { Document } from "mongoose";
import type {
  AttributeDto,
  BrandDto,
  CategoryDto,
  ProductDto,
} from "@platform/shared";
import type { AttributeDocument } from "../models/Attribute.js";
import type { BrandDocument } from "../models/Brand.js";
import type { CategoryDocument } from "../models/Category.js";
import type { ProductDocument } from "../models/Product.js";

function toIsoString(value: Date | string | undefined): string {
  if (!value) {
    return new Date(0).toISOString();
  }
  return value instanceof Date
    ? value.toISOString()
    : new Date(value).toISOString();
}

export function toProductDto(doc: ProductDocument): ProductDto {
  return {
    id: doc._id.toString(),
    name: doc.name,
    slug: doc.slug,
    sku: doc.sku,
    description: doc.description,
    price: doc.price,
    compareAtPrice: doc.compareAtPrice ?? undefined,
    stock: doc.stock,
    status: doc.status,
    categoryId: doc.categoryId?.toString(),
    categoryName: doc.categoryName,
    brandId: doc.brandId?.toString(),
    brandName: doc.brandName,
    images: doc.images,
    attributes: doc.attributes ?? {},
    metadata: doc.metadata ?? {},
    createdAt: toIsoString(doc.createdAt),
    updatedAt: toIsoString(doc.updatedAt),
  };
}

export function toCategoryDto(doc: CategoryDocument): CategoryDto {
  return {
    id: doc._id.toString(),
    name: doc.name,
    slug: doc.slug,
    image: doc.image,
    status: doc.status,
    productCount: doc.productCount,
    createdAt: toIsoString(doc.createdAt),
    updatedAt: toIsoString(doc.updatedAt),
  };
}

export function toBrandDto(doc: BrandDocument): BrandDto {
  return {
    id: doc._id.toString(),
    name: doc.name,
    slug: doc.slug,
    website: doc.website,
    initials: doc.initials,
    tileClass: doc.tileClass,
    visibility: doc.visibility,
    status: doc.status,
    productCount: doc.productCount,
    createdAt: toIsoString(doc.createdAt),
    updatedAt: toIsoString(doc.updatedAt),
  };
}

export function toAttributeDto(doc: AttributeDocument): AttributeDto {
  return {
    id: doc._id.toString(),
    name: doc.name,
    slug: doc.slug,
    displayType: doc.displayType,
    description: doc.description,
    status: doc.status,
    values: doc.values,
    productCount: doc.productCount,
    createdAt: toIsoString(doc.createdAt),
    updatedAt: toIsoString(doc.updatedAt),
  };
}

export function isUniqueKeyError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: number }).code === 11000
  );
}

export type TimestampedDocument = Document & {
  createdAt?: Date;
  updatedAt?: Date;
};
