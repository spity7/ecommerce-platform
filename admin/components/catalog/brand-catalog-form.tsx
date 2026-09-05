"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  BrandTilePreview,
  CatalogFormActions,
  CatalogFormError,
  CatalogFormLayout,
  ControlledField,
  ControlledSelect,
  deriveInitials,
  ProductCountCard,
  StatusDot,
} from "@/components/catalog/catalog-form-primitives";
import { FormCard } from "@/components/forms/admin-form-primitives";
import { routes } from "@/config/routes";
import { createBrandApi, updateBrandApi } from "@platform/api-client";
import type { BrandDto } from "@platform/shared";

const TILE_CLASS_OPTIONS = [
  { label: "Brand (gold)", value: "bg-brand-50 text-brand-600" },
  { label: "Success (green)", value: "bg-success-50 text-success-600" },
  { label: "Warning (amber)", value: "bg-warning-50 text-warning-600" },
  { label: "Neutral", value: "bg-surface-muted text-ink-600" },
];

type FormState = {
  error: string | null;
  loading: boolean;
};

type BrandCatalogFormProps = {
  initial?: BrandDto;
  mode: "add" | "edit";
};

export function BrandCatalogForm({ initial, mode }: BrandCatalogFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [website, setWebsite] = useState(initial?.website ?? "");
  const [initials, setInitials] = useState(initial?.initials ?? "");
  const [tileClass, setTileClass] = useState(
    initial?.tileClass ?? TILE_CLASS_OPTIONS[0].value
  );
  const [visibility, setVisibility] = useState<BrandDto["visibility"]>(
    initial?.visibility ?? "Standard"
  );
  const [status, setStatus] = useState<BrandDto["status"]>(
    initial?.status ?? "draft"
  );
  const [formState, setFormState] = useState<FormState>({
    error: null,
    loading: false,
  });

  const previewInitials = useMemo(() => {
    if (initials.trim()) {
      return initials.trim().slice(0, 4).toUpperCase();
    }
    return deriveInitials(name);
  }, [initials, name]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormState({ error: null, loading: true });

    const payload = {
      name,
      slug: slug || undefined,
      website,
      status,
      visibility,
      initials: initials.trim() || undefined,
      tileClass,
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
    <form onSubmit={handleSubmit}>
      <CatalogFormLayout
        aside={
          <>
            <BrandTilePreview
              initials={previewInitials}
              tileClass={tileClass}
            />
            <FormCard
              title="Status"
              titleEnd={
                <StatusDot active={status === "published"} variant={status} />
              }
            >
              <ControlledSelect
                help="Draft brands are hidden from published storefront views."
                hideLabel
                label="Status"
                onChange={(value) => setStatus(value as BrandDto["status"])}
                options={[
                  { label: "Draft", value: "draft" },
                  { label: "Published", value: "published" },
                  { label: "Archived", value: "archived" },
                ]}
                value={status}
              />
            </FormCard>
            <FormCard title="Storefront placement">
              <ControlledSelect
                help="Controls how prominently the brand appears in admin merchandising."
                label="Visibility"
                onChange={(value) =>
                  setVisibility(value as BrandDto["visibility"])
                }
                options={[
                  { label: "Featured", value: "Featured" },
                  { label: "Standard", value: "Standard" },
                  { label: "Hidden", value: "Hidden" },
                ]}
                value={visibility}
              />
            </FormCard>
            <FormCard title="Brand links">
              <ControlledField
                label="Website"
                onChange={setWebsite}
                placeholder="https://example.com"
                value={website}
              />
            </FormCard>
            {mode === "edit" && initial ? (
              <ProductCountCard
                count={initial.productCount}
                productsHref={routes.products}
              />
            ) : null}
          </>
        }
      >
        <FormCard title="General">
          <div className="grid gap-4 sm:grid-cols-2">
            <ControlledField
              label="Brand name"
              onChange={setName}
              placeholder="Brand name"
              required
              value={name}
            />
            {mode === "edit" ? (
              <ControlledField
                help="URL path for this brand. Auto-generated from the name when created."
                label="Slug"
                onChange={setSlug}
                placeholder="brand-slug"
                value={slug}
              />
            ) : null}
            <ControlledField
              help="Shown in brand tiles (max 4 characters)."
              label="Initials"
              maxLength={4}
              onChange={setInitials}
              placeholder="e.g. BS"
              value={initials}
            />
            <ControlledSelect
              label="Tile style"
              onChange={setTileClass}
              options={TILE_CLASS_OPTIONS}
              value={tileClass}
            />
          </div>
        </FormCard>
      </CatalogFormLayout>
      <CatalogFormError message={formState.error} />
      <CatalogFormActions
        cancelHref={routes.brands}
        loading={formState.loading}
      />
    </form>
  );
}
