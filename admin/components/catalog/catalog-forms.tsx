"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormCard } from "@/components/forms/admin-form-primitives";
import { Icon } from "@/components/layout/icon";
import { routes } from "@/config/routes";
import {
  createProductApi,
  platformInstance,
  updateProductApi,
} from "@platform/api-client";
import type { ProductDto } from "@platform/shared";

export { AttributeCatalogForm } from "./attribute-catalog-form";
export { BrandCatalogForm } from "./brand-catalog-form";
export { CategoryCatalogForm } from "./category-catalog-form";

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
