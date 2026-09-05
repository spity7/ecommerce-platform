"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  CatalogFormActions,
  CatalogFormError,
  CatalogFormLayout,
  ControlledField,
  ControlledSelect,
  ControlledTextarea,
  ProductAttributesFields,
  ProductImageList,
  ReadOnlyField,
  StatusDot,
  uploadCatalogImage,
  type ProductFormAttribute,
} from "@/components/catalog/catalog-form-primitives";
import { FormCard } from "@/components/forms/admin-form-primitives";
import { routes } from "@/config/routes";
import { createProductApi, updateProductApi } from "@platform/api-client";
import type { ProductDto } from "@platform/shared";

export { AttributeCatalogForm } from "./attribute-catalog-form";
export { BrandCatalogForm } from "./brand-catalog-form";
export { CategoryCatalogForm } from "./category-catalog-form";

type FormState = {
  error: string | null;
  loading: boolean;
};

type ProductCatalogFormProps = {
  attributes: ProductFormAttribute[];
  categories: Array<{ id: string; name: string }>;
  brands: Array<{ id: string; name: string }>;
  initial?: ProductDto;
  mode: "add" | "edit";
};

function initialAttributeValues(
  attributes: ProductFormAttribute[],
  initial?: ProductDto
): Record<string, string> {
  const source = initial?.attributes ?? {};
  return Object.fromEntries(
    attributes.map((attribute) => {
      const raw = source[attribute.slug];
      const value =
        typeof raw === "string"
          ? raw
          : Array.isArray(raw)
            ? (raw[0] ?? "")
            : "";
      return [attribute.slug, value];
    })
  );
}

export function ProductCatalogForm({
  attributes,
  categories,
  brands,
  initial,
  mode,
}: ProductCatalogFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? "");
  const [price, setPrice] = useState(String(initial?.price ?? ""));
  const [compareAtPrice, setCompareAtPrice] = useState(
    initial?.compareAtPrice != null ? String(initial.compareAtPrice) : ""
  );
  const [stock, setStock] = useState(String(initial?.stock ?? 0));
  const [description, setDescription] = useState(initial?.description ?? "");
  const [status, setStatus] = useState<ProductDto["status"]>(
    initial?.status ?? "draft"
  );
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? "");
  const [brandId, setBrandId] = useState(initial?.brandId ?? "");
  const [images, setImages] = useState(initial?.images ?? []);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [attributeValues, setAttributeValues] = useState(() =>
    initialAttributeValues(attributes, initial)
  );
  const [formState, setFormState] = useState<FormState>({
    error: null,
    loading: false,
  });

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setFormState({ error: null, loading: true });

    const attributesPayload = Object.fromEntries(
      Object.entries(attributeValues).filter(([, value]) => value.trim())
    );

    const payload = {
      name,
      price: Number(price),
      compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
      stock: Number(stock),
      description,
      status,
      categoryId: categoryId || undefined,
      brandId: brandId || undefined,
      images,
      attributes: attributesPayload,
    };

    try {
      if (mode === "add") {
        await createProductApi(payload);
        router.push(routes.products);
      } else if (initial) {
        await updateProductApi(initial.id, payload);
        router.push(routes.products);
      }
      router.refresh();
    } catch (error) {
      setFormState({
        error: error instanceof Error ? error.message : "Save failed",
        loading: false,
      });
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <CatalogFormLayout
        aside={
          <>
            <FormCard
              title="Status"
              titleEnd={
                <StatusDot active={status === "published"} variant={status} />
              }
            >
              <ControlledSelect
                help="Draft products are hidden from published storefront views."
                hideLabel
                label="Status"
                onChange={(value) => setStatus(value as ProductDto["status"])}
                options={[
                  { label: "Draft", value: "draft" },
                  { label: "Published", value: "published" },
                  { label: "Archived", value: "archived" },
                ]}
                value={status}
              />
            </FormCard>
            <ProductAttributesFields
              attributes={attributes}
              onChange={setAttributeValues}
              values={attributeValues}
            />
          </>
        }
      >
        <FormCard title="General">
          <ControlledField
            label="Product name"
            onChange={setName}
            placeholder="Product name"
            required
            value={name}
          />
          {mode === "edit" && initial ? (
            <div className="mt-4">
              <ReadOnlyField
                help="Generated on create and used for inventory tracking."
                label="SKU"
                value={initial.sku}
              />
            </div>
          ) : (
            <p className="mt-2 text-[12px] text-ink-400">
              SKU will be generated automatically when you save.
            </p>
          )}
        </FormCard>
        <div className="grid gap-4 md:grid-cols-2">
          <FormCard title="Pricing & inventory">
            <div className="grid gap-4 sm:grid-cols-3">
              <ControlledField
                label="Price"
                onChange={setPrice}
                placeholder="0.00"
                required
                type="number"
                value={price}
              />
              <ControlledField
                help="Optional strikethrough price."
                label="Compare at price"
                onChange={setCompareAtPrice}
                placeholder="0.00"
                type="number"
                value={compareAtPrice}
              />
              <ControlledField
                label="Stock"
                onChange={setStock}
                placeholder="0"
                required
                type="number"
                value={stock}
              />
            </div>
          </FormCard>
          <FormCard title="Merchandising">
            <div className="grid gap-4 sm:grid-cols-2">
              <ControlledSelect
                label="Category"
                onChange={setCategoryId}
                options={[
                  { label: "None", value: "" },
                  ...categories.map((category) => ({
                    label: category.name,
                    value: category.id,
                  })),
                ]}
                value={categoryId}
              />
              <ControlledSelect
                label="Brand"
                onChange={setBrandId}
                options={[
                  { label: "None", value: "" },
                  ...brands.map((brand) => ({
                    label: brand.name,
                    value: brand.id,
                  })),
                ]}
                value={brandId}
              />
            </div>
          </FormCard>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <FormCard title="Media">
            <label className="block">
              <span className="text-[13px] font-semibold text-ink-700">
                Product images
              </span>
              <input
                accept=".png,.jpg,.jpeg,.webp"
                className="mt-1.5 block w-full text-[13px] text-ink-600 file:mr-3 file:rounded-base file:border-0 file:bg-brand-50 file:px-3 file:py-2 file:text-[13px] file:font-semibold file:text-brand-600 hover:file:bg-brand-100"
                disabled={uploadingImage}
                onChange={async (event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  setUploadingImage(true);
                  setFormState((current) => ({ ...current, error: null }));
                  try {
                    const url = await uploadCatalogImage(file, "products");
                    setImages((previous) => [...previous, url]);
                  } catch {
                    setFormState((current) => ({
                      ...current,
                      error: "Image upload failed",
                    }));
                  } finally {
                    setUploadingImage(false);
                    event.target.value = "";
                  }
                }}
                type="file"
              />
            </label>
            <p className="mt-2 text-[12px] text-ink-400">
              {uploadingImage
                ? "Uploading…"
                : images.length > 0
                  ? `${images.length} image${images.length === 1 ? "" : "s"} attached. Upload more or save to persist.`
                  : "Upload PNG, JPG, or WebP images."}
            </p>
            {images.length > 0 ? (
              <ProductImageList
                images={images}
                onRemove={(image) =>
                  setImages((previous) =>
                    previous.filter((item) => item !== image)
                  )
                }
              />
            ) : null}
          </FormCard>
          <FormCard title="Description">
            <ControlledTextarea
              help="Shown on the product detail page."
              label="Product description"
              minRows={5}
              onChange={setDescription}
              placeholder="Describe the product…"
              value={description}
            />
          </FormCard>
        </div>
      </CatalogFormLayout>
      <CatalogFormError message={formState.error} />
      <CatalogFormActions
        cancelHref={routes.products}
        loading={formState.loading}
      />
    </form>
  );
}
