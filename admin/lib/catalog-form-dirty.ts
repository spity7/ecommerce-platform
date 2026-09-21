import type {
  AttributeValueRow,
  CatalogImagePreview,
} from "@/components/catalog/catalog-form-primitives";
import {
  getSavedCatalogImageUrls,
  hasPendingCatalogImages,
} from "@/components/catalog/catalog-form-primitives";
import {
  DEFAULT_BRAND_TILE_CLASS,
  normalizeBrandInitials,
} from "@/lib/brand-tile";
import type {
  AttributeDto,
  BrandDto,
  CategoryDto,
  ProductDto,
  ProductMerchandising,
} from "@platform/shared";

function stableSerialize(value: unknown): string {
  return JSON.stringify(value);
}

function recordsEqual(
  left: Record<string, unknown>,
  right: Record<string, unknown>
): boolean {
  return stableSerialize(left) === stableSerialize(right);
}

function stringArraysEqual(left: string[], right: string[]): boolean {
  if (left.length !== right.length) {
    return false;
  }
  return left.every((entry, index) => entry === right[index]);
}

function attributeValuesFromRows(
  rows: AttributeValueRow[],
  usesPredefinedValues: boolean
): string[] {
  if (!usesPredefinedValues) {
    return [];
  }
  return rows.map((row) => row.value.trim()).filter(Boolean);
}

function trimmedAttributeMap(
  values: Record<string, string>
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(values).filter(([, value]) => value.trim())
  );
}

function attributeSnapshotFromDto(initial: AttributeDto): {
  name: string;
  displayType: AttributeDto["displayType"];
  description: string;
  status: AttributeDto["status"];
  values: string[];
} {
  const usesPredefinedValues = initial.displayType !== "Text";
  return {
    name: initial.name,
    displayType: initial.displayType,
    description: initial.description ?? "",
    status: initial.status,
    values: usesPredefinedValues ? [...(initial.values ?? [])] : [],
  };
}

export function isBrandCatalogFormDirty(options: {
  initials: string;
  mode: "add" | "edit";
  initial?: BrandDto;
  name: string;
  status: BrandDto["status"];
  tileClass: string;
  visibility: BrandDto["visibility"];
  website: string;
}): boolean {
  const current = {
    name: options.name,
    website: options.website,
    status: options.status,
    visibility: options.visibility,
    initials: normalizeBrandInitials(options.initials) || undefined,
    tileClass: options.tileClass,
  };

  const baseline =
    options.mode === "edit" && options.initial
      ? {
          name: options.initial.name,
          website: options.initial.website ?? "",
          status: options.initial.status,
          visibility: options.initial.visibility,
          initials:
            normalizeBrandInitials(options.initial.initials ?? "") || undefined,
          tileClass: options.initial.tileClass ?? DEFAULT_BRAND_TILE_CLASS,
        }
      : {
          name: "",
          website: "",
          status: "draft" as const,
          visibility: "Standard" as const,
          initials: undefined,
          tileClass: DEFAULT_BRAND_TILE_CLASS,
        };

  return !recordsEqual(current, baseline);
}

export function isCategoryCatalogFormDirty(options: {
  initial?: CategoryDto;
  mode: "add" | "edit";
  name: string;
  pendingImageFile: File | null;
  savedImageUrl: string;
  status: CategoryDto["status"];
}): boolean {
  if (options.pendingImageFile) {
    return true;
  }

  const current = {
    name: options.name,
    image: options.savedImageUrl.trim(),
    status: options.status,
  };

  const baseline =
    options.mode === "edit" && options.initial
      ? {
          name: options.initial.name,
          image: options.initial.image ?? "",
          status: options.initial.status,
        }
      : {
          name: "",
          image: "",
          status: "draft" as const,
        };

  return !recordsEqual(current, baseline);
}

export function isAttributeCatalogFormDirty(options: {
  description: string;
  displayType: AttributeDto["displayType"];
  initial?: AttributeDto;
  mode: "add" | "edit";
  name: string;
  status: AttributeDto["status"];
  valueRows: AttributeValueRow[];
}): boolean {
  const usesPredefinedValues = options.displayType !== "Text";
  const current = {
    name: options.name,
    displayType: options.displayType,
    description: options.description,
    status: options.status,
    values: attributeValuesFromRows(options.valueRows, usesPredefinedValues),
  };

  const baseline =
    options.mode === "edit" && options.initial
      ? attributeSnapshotFromDto(options.initial)
      : {
          name: "",
          displayType: "Dropdown" as const,
          description: "",
          status: "draft" as const,
          values: [] as string[],
        };

  return !recordsEqual(current, baseline);
}

export function isProductCatalogFormDirty(options: {
  attributeValues: Record<string, string>;
  brandId: string;
  categoryId: string;
  compareAtPrice: string;
  defaultBrandId?: string;
  defaultCategoryId?: string;
  description: string;
  imageEntries: CatalogImagePreview[];
  initial?: ProductDto;
  merchandising: ProductMerchandising;
  merchandisingBaseline?: ProductMerchandising;
  mode: "add" | "edit";
  name: string;
  price: string;
  status: ProductDto["status"];
  stock: string;
}): boolean {
  if (hasPendingCatalogImages(options.imageEntries)) {
    return true;
  }

  const savedImages = getSavedCatalogImageUrls(options.imageEntries);
  const attributes = trimmedAttributeMap(options.attributeValues);

  if (options.mode === "edit" && options.initial) {
    const initial = options.initial;
    const initialCompareAt =
      initial.compareAtPrice != null ? String(initial.compareAtPrice) : "";
    const initialBrandId = initial.brandId ?? "";
    const initialStock = String(Math.max(0, initial.stock ?? 0));

    if (options.name !== initial.name) {
      return true;
    }
    if (options.price !== String(initial.price)) {
      return true;
    }
    if (options.compareAtPrice !== initialCompareAt) {
      return true;
    }
    if (options.stock !== initialStock) {
      return true;
    }
    if (options.description !== (initial.description ?? "")) {
      return true;
    }
    if (options.status !== initial.status) {
      return true;
    }
    if (options.categoryId !== initial.categoryId) {
      return true;
    }
    if (options.brandId !== initialBrandId) {
      return true;
    }
    if (!stringArraysEqual(savedImages, [...(initial.images ?? [])])) {
      return true;
    }
    if (
      !recordsEqual(
        attributes,
        trimmedAttributeMap(
          Object.fromEntries(
            Object.entries(initial.attributes ?? {}).map(([slug, raw]) => {
              const value =
                typeof raw === "string"
                  ? raw
                  : Array.isArray(raw)
                    ? (raw[0] ?? "")
                    : "";
              return [slug, value];
            })
          )
        )
      )
    ) {
      return true;
    }
    return !recordsEqual(
      options.merchandising,
      options.merchandisingBaseline ?? ({} as ProductMerchandising)
    );
  }

  const baseline = {
    name: "",
    price: "",
    compareAtPrice: "",
    stock: "0",
    description: "",
    status: "draft" as const,
    categoryId: options.defaultCategoryId ?? "",
    brandId: options.defaultBrandId ?? "",
    images: [] as string[],
    attributes: {} as Record<string, string>,
    merchandising:
      options.merchandisingBaseline ?? ({} as ProductMerchandising),
  };

  const current = {
    name: options.name,
    price: options.price,
    compareAtPrice: options.compareAtPrice,
    stock: options.stock,
    description: options.description,
    status: options.status,
    categoryId: options.categoryId,
    brandId: options.brandId,
    images: savedImages,
    attributes,
    merchandising: options.merchandising,
  };

  return !recordsEqual(current, baseline);
}
