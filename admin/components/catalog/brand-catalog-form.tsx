"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  AssignedProductsSection,
  BrandTileStylePicker,
  CatalogFormFooter,
  ControlledField,
  ControlledSelect,
  catalogSubmitErrorState,
  resolveCatalogFieldErrors,
  useFocusFirstCatalogFieldError,
  type AssignedProductPreview,
} from "@/components/catalog/catalog-form-primitives";
import { FormCard } from "@/components/forms/admin-form-primitives";
import { CatalogStatusSelect } from "@/components/products/catalog-status-select";
import { routes } from "@/config/routes";
import { addProductPath, productsListPath } from "@/lib/paths";
import {
  catalogSaveButtonLabel,
  finishCatalogSave,
} from "@/lib/catalog-feedback";
import { useToast } from "@/providers/toast-provider";
import { useCatalogFormLeaveGuard } from "@/components/catalog/use-catalog-form-leave-guard";
import {
  brandTileClassOptions,
  DEFAULT_BRAND_TILE_CLASS,
  normalizeBrandInitials,
  resolveBrandInitials,
} from "@/lib/brand-tile";
import { isBrandCatalogFormDirty } from "@/lib/catalog-form-dirty";
import {
  createBrandApi,
  updateBrandApi,
  type ApiValidationDetails,
} from "@platform/api-client";
import type { BrandDto } from "@platform/shared";

type FormState = {
  error: string | null;
  loading: boolean;
  validationDetails: ApiValidationDetails | null;
};

type BrandCatalogFormProps = {
  assignedProducts?: AssignedProductPreview[];
  initial?: BrandDto;
  linkedProductCount?: number;
  mode: "add" | "edit";
};

export function BrandCatalogForm({
  assignedProducts = [],
  initial,
  linkedProductCount,
  mode,
}: BrandCatalogFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [name, setName] = useState(initial?.name ?? "");
  const [website, setWebsite] = useState(initial?.website ?? "");
  const [initials, setInitials] = useState(
    normalizeBrandInitials(initial?.initials ?? "")
  );
  const [tileClass, setTileClass] = useState(
    initial?.tileClass ?? DEFAULT_BRAND_TILE_CLASS
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
    validationDetails: null,
  });

  const previewInitials = useMemo(
    () => resolveBrandInitials(initials, name),
    [initials, name]
  );
  const tileClassOptions = useMemo(
    () => brandTileClassOptions(tileClass),
    [tileClass]
  );
  const statusHelp = useMemo(() => {
    switch (status) {
      case "published":
        return "Published brands can appear in storefront catalog views.";
      case "archived":
        return "Archived brands are kept for reference but hidden from storefront views.";
      default:
        return "Draft brands are hidden from published storefront views.";
    }
  }, [status]);
  const selectableStatuses = useMemo((): BrandDto["status"][] => {
    const statuses: BrandDto["status"][] = ["draft", "published"];
    if (mode === "edit") {
      statuses.push("archived");
    }
    return statuses;
  }, [mode]);

  const fieldErrors = useMemo(
    () =>
      resolveCatalogFieldErrors(formState.error, formState.validationDetails),
    [formState.error, formState.validationDetails]
  );

  useFocusFirstCatalogFieldError(fieldErrors);
  const { disabled } = useCatalogFormLeaveGuard({
    loading: formState.loading,
  });
  const isDirty = useMemo(
    () =>
      isBrandCatalogFormDirty({
        initials,
        initial,
        mode,
        name,
        status,
        tileClass,
        visibility,
        website,
      }),
    [initials, initial, mode, name, status, tileClass, visibility, website]
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormState({ error: null, loading: true, validationDetails: null });

    const payload = {
      name,
      website,
      status,
      visibility,
      initials: normalizeBrandInitials(initials) || undefined,
      tileClass,
    };

    try {
      if (mode === "add") {
        await createBrandApi(payload);
      } else if (initial) {
        await updateBrandApi(initial.id, payload);
      }
      finishCatalogSave({
        entity: "brand",
        listHref: routes.brands,
        mode,
        name,
        router,
        showToast,
      });
    } catch (error) {
      setFormState({
        ...catalogSubmitErrorState(error),
        loading: false,
      });
    }
  }

  return (
    <form
      aria-busy={formState.loading}
      className="min-w-0 max-w-full space-y-4"
      onSubmit={handleSubmit}
    >
      <div className="grid min-w-0 max-w-full items-start gap-4 lg:grid-cols-2">
        <FormCard title="General">
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <ControlledField
                disabled={disabled}
                error={fieldErrors.name}
                fieldKey="name"
                label="Brand name"
                onChange={(value) => {
                  setName(value);
                  setFormState((current) => ({
                    ...current,
                    error: null,
                    validationDetails: null,
                  }));
                }}
                placeholder="Brand name"
                required
                value={name}
              />
              <ControlledField
                disabled={disabled}
                help="Leave blank to auto-generate from the brand name."
                label="Initials"
                maxLength={4}
                onChange={(value) => setInitials(normalizeBrandInitials(value))}
                placeholder="e.g. BS"
                value={initials}
              />
            </div>
            <BrandTileStylePicker
              disabled={disabled}
              initials={previewInitials}
              onChange={setTileClass}
              options={tileClassOptions}
              value={tileClass}
            />
          </div>
        </FormCard>
        <FormCard title="Publishing & links">
          <div className="space-y-4">
            <div>
              <span className="mb-1.5 block text-[13px] font-semibold text-ink-700">
                Status
              </span>
              <CatalogStatusSelect
                disabled={disabled}
                onValueChange={(value) =>
                  setStatus(value as BrandDto["status"])
                }
                statuses={selectableStatuses}
                value={status}
              />
              <p className="mt-2 text-[13px] leading-snug text-ink-500">
                {statusHelp}
              </p>
            </div>
            <ControlledSelect
              disabled={disabled}
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
            <ControlledField
              disabled={disabled}
              label="Website"
              onChange={setWebsite}
              placeholder="https://example.com"
              value={website}
            />
          </div>
        </FormCard>
      </div>
      <CatalogFormFooter
        cancelHref={routes.brands}
        error={formState.error}
        loading={formState.loading}
        saveDisabled={!isDirty}
        saveLabel={catalogSaveButtonLabel("brand", mode)}
        showDividerAboveActions={mode === "add"}
      />
      {mode === "edit" && initial ? (
        <div className="mt-6 border-t border-surface-line pt-6">
          <AssignedProductsSection
            addProductHref={addProductPath({ brandId: initial.id })}
            count={linkedProductCount ?? initial.productCount}
            disabled={disabled}
            emptyDescription="Add a product and choose this brand in the product form."
            entityLabel="brand"
            products={assignedProducts}
            productsHref={productsListPath({ brandId: initial.id })}
            productsListFilter={{ brandId: initial.id }}
          />
        </div>
      ) : null}
    </form>
  );
}
