"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormCard } from "@/components/forms/admin-form-primitives";
import { Icon } from "@/components/layout/icon";
import { routes } from "@/config/routes";
import {
  createAttributeApi,
  createBrandApi,
  createCategoryApi,
  createProductApi,
  platformInstance,
  updateAttributeApi,
  updateBrandApi,
  updateCategoryApi,
  updateProductApi,
} from "@platform/api-client";
import type {
  AttributeDto,
  BrandDto,
  CategoryDto,
  ProductDto,
} from "@platform/shared";

type FormState = {
  error: string | null;
  loading: boolean;
};

function FormActions({
  cancelHref,
  loading,
}: {
  cancelHref: string;
  loading: boolean;
}) {
  return (
    <div className="mt-6 flex items-center justify-end gap-3 border-t border-surface-line pt-5">
      <Link
        className="inline-flex h-10 items-center gap-2 rounded-base border border-surface-line px-5 text-[14px] font-semibold text-ink-700 hover:bg-surface-muted"
        href={cancelHref}
      >
        Cancel
      </Link>
      <button
        className="inline-flex h-10 items-center gap-2 rounded-base bg-brand-600 px-5 text-[14px] font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
        disabled={loading}
        type="submit"
      >
        <Icon className="h-4 w-4" name="save" />
        {loading ? "Saving…" : "Save"}
      </button>
    </div>
  );
}

async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", "products");
  const result = await platformInstance.post<{ publicUrl: string }>(
    "/api/uploads",
    formData
  );
  return result.data.publicUrl;
}

type ProductCatalogFormProps = {
  categories: Array<{ id: string; name: string }>;
  brands: Array<{ id: string; name: string }>;
  initial?: ProductDto;
  mode: "add" | "edit";
};

export function ProductCatalogForm({
  categories,
  brands,
  initial,
  mode,
}: ProductCatalogFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? "");
  const [sku, setSku] = useState(initial?.sku ?? "");
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
  const [formState, setFormState] = useState<FormState>({
    error: null,
    loading: false,
  });

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setFormState({ error: null, loading: true });

    const payload = {
      name,
      sku,
      price: Number(price),
      compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
      stock: Number(stock),
      description,
      status,
      categoryId: categoryId || undefined,
      brandId: brandId || undefined,
      images,
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
    <form className="max-w-3xl space-y-4" onSubmit={handleSubmit}>
      <FormCard title="Product details">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-[14px] font-semibold text-ink-700">Name</span>
            <input
              className="mt-2 h-11 w-full rounded-base border border-surface-line bg-surface-body px-4 text-[14px]"
              onChange={(e) => setName(e.target.value)}
              required
              value={name}
            />
          </label>
          <label className="block">
            <span className="text-[14px] font-semibold text-ink-700">SKU</span>
            <input
              className="mt-2 h-11 w-full rounded-base border border-surface-line bg-surface-body px-4 text-[14px]"
              onChange={(e) => setSku(e.target.value)}
              required
              value={sku}
            />
          </label>
          <label className="block">
            <span className="text-[14px] font-semibold text-ink-700">
              Price
            </span>
            <input
              className="mt-2 h-11 w-full rounded-base border border-surface-line bg-surface-body px-4 text-[14px]"
              onChange={(e) => setPrice(e.target.value)}
              required
              type="number"
              value={price}
            />
          </label>
          <label className="block">
            <span className="text-[14px] font-semibold text-ink-700">
              Compare at price
            </span>
            <input
              className="mt-2 h-11 w-full rounded-base border border-surface-line bg-surface-body px-4 text-[14px]"
              onChange={(e) => setCompareAtPrice(e.target.value)}
              type="number"
              value={compareAtPrice}
            />
          </label>
          <label className="block">
            <span className="text-[14px] font-semibold text-ink-700">
              Stock
            </span>
            <input
              className="mt-2 h-11 w-full rounded-base border border-surface-line bg-surface-body px-4 text-[14px]"
              onChange={(e) => setStock(e.target.value)}
              required
              type="number"
              value={stock}
            />
          </label>
          <label className="block">
            <span className="text-[14px] font-semibold text-ink-700">
              Status
            </span>
            <select
              className="mt-2 h-11 w-full rounded-base border border-surface-line bg-surface-body px-4 text-[14px]"
              onChange={(e) =>
                setStatus(e.target.value as ProductDto["status"])
              }
              value={status}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </label>
          <label className="block">
            <span className="text-[14px] font-semibold text-ink-700">
              Category
            </span>
            <select
              className="mt-2 h-11 w-full rounded-base border border-surface-line bg-surface-body px-4 text-[14px]"
              onChange={(e) => setCategoryId(e.target.value)}
              value={categoryId}
            >
              <option value="">None</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-[14px] font-semibold text-ink-700">
              Brand
            </span>
            <select
              className="mt-2 h-11 w-full rounded-base border border-surface-line bg-surface-body px-4 text-[14px]"
              onChange={(e) => setBrandId(e.target.value)}
              value={brandId}
            >
              <option value="">None</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="mt-4 block">
          <span className="text-[14px] font-semibold text-ink-700">
            Description
          </span>
          <textarea
            className="mt-2 min-h-[100px] w-full rounded-base border border-surface-line bg-surface-body px-4 py-3 text-[14px]"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
          />
        </label>
        <label className="mt-4 block">
          <span className="text-[14px] font-semibold text-ink-700">
            Upload image
          </span>
          <input
            accept="image/*"
            className="mt-2 block text-[14px]"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              try {
                const url = await uploadImage(file);
                setImages((prev) => [...prev, url]);
              } catch {
                setFormState((s) => ({
                  ...s,
                  error: "Image upload failed",
                }));
              }
            }}
            type="file"
          />
        </label>
        {images.length > 0 ? (
          <p className="mt-2 text-[13px] text-ink-500">
            {images.length} image(s) attached
          </p>
        ) : null}
      </FormCard>
      {formState.error ? (
        <p className="text-[14px] text-danger-600">{formState.error}</p>
      ) : null}
      <FormActions cancelHref={routes.products} loading={formState.loading} />
    </form>
  );
}

type CategoryCatalogFormProps = {
  initial?: CategoryDto;
  mode: "add" | "edit";
};

export function CategoryCatalogForm({
  initial,
  mode,
}: CategoryCatalogFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [image, setImage] = useState(initial?.image ?? "");
  const [status, setStatus] = useState<CategoryDto["status"]>(
    initial?.status ?? "draft"
  );
  const [formState, setFormState] = useState<FormState>({
    error: null,
    loading: false,
  });

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setFormState({ error: null, loading: true });
    const payload = { name, slug: slug || undefined, image, status };
    try {
      if (mode === "add") {
        await createCategoryApi(payload);
      } else if (initial) {
        await updateCategoryApi(initial.id, payload);
      }
      router.push(routes.categories);
      router.refresh();
    } catch (error) {
      setFormState({
        error: error instanceof Error ? error.message : "Save failed",
        loading: false,
      });
    }
  }

  return (
    <form className="max-w-xl space-y-4" onSubmit={handleSubmit}>
      <FormCard title="Category">
        <div className="space-y-4">
          <label className="block">
            <span className="text-[14px] font-semibold text-ink-700">Name</span>
            <input
              className="mt-2 h-11 w-full rounded-base border border-surface-line bg-surface-body px-4 text-[14px]"
              onChange={(e) => setName(e.target.value)}
              required
              value={name}
            />
          </label>
          <label className="block">
            <span className="text-[14px] font-semibold text-ink-700">Slug</span>
            <input
              className="mt-2 h-11 w-full rounded-base border border-surface-line bg-surface-body px-4 text-[14px]"
              onChange={(e) => setSlug(e.target.value)}
              value={slug}
            />
          </label>
          <label className="block">
            <span className="text-[14px] font-semibold text-ink-700">
              Image URL
            </span>
            <input
              className="mt-2 h-11 w-full rounded-base border border-surface-line bg-surface-body px-4 text-[14px]"
              onChange={(e) => setImage(e.target.value)}
              value={image}
            />
          </label>
          <label className="block">
            <span className="text-[14px] font-semibold text-ink-700">
              Status
            </span>
            <select
              className="mt-2 h-11 w-full rounded-base border border-surface-line bg-surface-body px-4 text-[14px]"
              onChange={(e) =>
                setStatus(e.target.value as CategoryDto["status"])
              }
              value={status}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </label>
        </div>
      </FormCard>
      {formState.error ? (
        <p className="text-[14px] text-danger-600">{formState.error}</p>
      ) : null}
      <FormActions cancelHref={routes.categories} loading={formState.loading} />
    </form>
  );
}

type BrandCatalogFormProps = {
  initial?: BrandDto;
  mode: "add" | "edit";
};

export function BrandCatalogForm({ initial, mode }: BrandCatalogFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [website, setWebsite] = useState(initial?.website ?? "");
  const [status, setStatus] = useState<BrandDto["status"]>(
    initial?.status ?? "draft"
  );
  const [formState, setFormState] = useState<FormState>({
    error: null,
    loading: false,
  });

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setFormState({ error: null, loading: true });
    const payload = {
      name,
      slug: slug || undefined,
      website,
      status,
    };
    try {
      if (mode === "add") {
        await createBrandApi(payload);
      } else if (initial) {
        await updateBrandApi(initial.id, payload);
      }
      router.push(routes.brands);
      router.refresh();
    } catch (error) {
      setFormState({
        error: error instanceof Error ? error.message : "Save failed",
        loading: false,
      });
    }
  }

  return (
    <form className="max-w-xl space-y-4" onSubmit={handleSubmit}>
      <FormCard title="Brand">
        <div className="space-y-4">
          <label className="block">
            <span className="text-[14px] font-semibold text-ink-700">Name</span>
            <input
              className="mt-2 h-11 w-full rounded-base border border-surface-line bg-surface-body px-4 text-[14px]"
              onChange={(e) => setName(e.target.value)}
              required
              value={name}
            />
          </label>
          <label className="block">
            <span className="text-[14px] font-semibold text-ink-700">Slug</span>
            <input
              className="mt-2 h-11 w-full rounded-base border border-surface-line bg-surface-body px-4 text-[14px]"
              onChange={(e) => setSlug(e.target.value)}
              value={slug}
            />
          </label>
          <label className="block">
            <span className="text-[14px] font-semibold text-ink-700">
              Website
            </span>
            <input
              className="mt-2 h-11 w-full rounded-base border border-surface-line bg-surface-body px-4 text-[14px]"
              onChange={(e) => setWebsite(e.target.value)}
              value={website}
            />
          </label>
          <label className="block">
            <span className="text-[14px] font-semibold text-ink-700">
              Status
            </span>
            <select
              className="mt-2 h-11 w-full rounded-base border border-surface-line bg-surface-body px-4 text-[14px]"
              onChange={(e) => setStatus(e.target.value as BrandDto["status"])}
              value={status}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </label>
        </div>
      </FormCard>
      {formState.error ? (
        <p className="text-[14px] text-danger-600">{formState.error}</p>
      ) : null}
      <FormActions cancelHref={routes.brands} loading={formState.loading} />
    </form>
  );
}

type AttributeCatalogFormProps = {
  initial?: AttributeDto;
  mode: "add" | "edit";
};

export function AttributeCatalogForm({
  initial,
  mode,
}: AttributeCatalogFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [displayType, setDisplayType] = useState<AttributeDto["displayType"]>(
    initial?.displayType ?? "Dropdown"
  );
  const [description, setDescription] = useState(initial?.description ?? "");
  const [status, setStatus] = useState<AttributeDto["status"]>(
    initial?.status ?? "draft"
  );
  const [valuesText, setValuesText] = useState(
    initial?.values?.join(", ") ?? ""
  );
  const [formState, setFormState] = useState<FormState>({
    error: null,
    loading: false,
  });

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setFormState({ error: null, loading: true });
    const values = valuesText
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
    const payload = {
      name,
      slug: slug || undefined,
      displayType,
      description,
      status,
      values,
    };
    try {
      if (mode === "add") {
        await createAttributeApi(payload);
      } else if (initial) {
        await updateAttributeApi(initial.id, payload);
      }
      router.push(routes.attributes);
      router.refresh();
    } catch (error) {
      setFormState({
        error: error instanceof Error ? error.message : "Save failed",
        loading: false,
      });
    }
  }

  return (
    <form className="max-w-xl space-y-4" onSubmit={handleSubmit}>
      <FormCard title="Attribute">
        <div className="space-y-4">
          <label className="block">
            <span className="text-[14px] font-semibold text-ink-700">Name</span>
            <input
              className="mt-2 h-11 w-full rounded-base border border-surface-line bg-surface-body px-4 text-[14px]"
              onChange={(e) => setName(e.target.value)}
              required
              value={name}
            />
          </label>
          <label className="block">
            <span className="text-[14px] font-semibold text-ink-700">Slug</span>
            <input
              className="mt-2 h-11 w-full rounded-base border border-surface-line bg-surface-body px-4 text-[14px]"
              onChange={(e) => setSlug(e.target.value)}
              value={slug}
            />
          </label>
          <label className="block">
            <span className="text-[14px] font-semibold text-ink-700">
              Display type
            </span>
            <select
              className="mt-2 h-11 w-full rounded-base border border-surface-line bg-surface-body px-4 text-[14px]"
              onChange={(e) =>
                setDisplayType(e.target.value as AttributeDto["displayType"])
              }
              value={displayType}
            >
              <option value="Dropdown">Dropdown</option>
              <option value="Swatch">Swatch</option>
              <option value="Text">Text</option>
            </select>
          </label>
          <label className="block">
            <span className="text-[14px] font-semibold text-ink-700">
              Description
            </span>
            <input
              className="mt-2 h-11 w-full rounded-base border border-surface-line bg-surface-body px-4 text-[14px]"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
            />
          </label>
          <label className="block">
            <span className="text-[14px] font-semibold text-ink-700">
              Values (comma-separated)
            </span>
            <input
              className="mt-2 h-11 w-full rounded-base border border-surface-line bg-surface-body px-4 text-[14px]"
              onChange={(e) => setValuesText(e.target.value)}
              value={valuesText}
            />
          </label>
          <label className="block">
            <span className="text-[14px] font-semibold text-ink-700">
              Status
            </span>
            <select
              className="mt-2 h-11 w-full rounded-base border border-surface-line bg-surface-body px-4 text-[14px]"
              onChange={(e) =>
                setStatus(e.target.value as AttributeDto["status"])
              }
              value={status}
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
            </select>
          </label>
        </div>
      </FormCard>
      {formState.error ? (
        <p className="text-[14px] text-danger-600">{formState.error}</p>
      ) : null}
      <FormActions cancelHref={routes.attributes} loading={formState.loading} />
    </form>
  );
}
