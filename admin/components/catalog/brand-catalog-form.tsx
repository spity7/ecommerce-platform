"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  AssignedProductsSection,
  CatalogFormFooter,
  ControlledField,
  ControlledSelect,
  collectRemovedHostedImages,
  deleteHostedCatalogImages,
  catalogSubmitErrorState,
  resolveCatalogFieldErrors,
  useFocusFirstCatalogFieldError,
  getThumbnailPreviewState,
  isHostedCatalogImageUrl,
  revokeBlobPreviewUrl,
  ThumbnailUploadCard,
  uploadCatalogImage,
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

function hasBrandImage(
  savedImageUrl: string,
  pendingImageFile: File | null
): boolean {
  return Boolean(savedImageUrl.trim() || pendingImageFile);
}

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
  const [savedImageUrl, setSavedImageUrl] = useState(initial?.image ?? "");
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(initial?.image ?? "");
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
  const initialHostedImage =
    mode === "edit" && initial && isHostedCatalogImageUrl(initial.image)
      ? initial.image
      : "";

  const previewState = useMemo(
    () => getThumbnailPreviewState(savedImageUrl, pendingImageFile !== null),
    [pendingImageFile, savedImageUrl]
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
        initial,
        mode,
        name,
        pendingImageFile,
        savedImageUrl,
        status,
        visibility,
        website,
      }),
    [
      initial,
      mode,
      name,
      pendingImageFile,
      savedImageUrl,
      status,
      visibility,
      website,
    ]
  );

  useEffect(() => {
    return () => {
      if (pendingImageFile) {
        revokeBlobPreviewUrl(previewUrl);
      }
    };
  }, [pendingImageFile, previewUrl]);

  function handleImageUpload(file: File) {
    setFormState((current) => ({
      ...current,
      error: null,
      validationDetails: null,
    }));
    if (pendingImageFile) {
      revokeBlobPreviewUrl(previewUrl);
    }
    setPendingImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!hasBrandImage(savedImageUrl, pendingImageFile)) {
      setFormState({
        error: "Brand image is required",
        loading: false,
        validationDetails: null,
      });
      return;
    }

    setFormState({ error: null, loading: true, validationDetails: null });

    let finalImage = savedImageUrl.trim();
    const uploadedInThisAttempt: string[] = [];

    try {
      if (pendingImageFile) {
        finalImage = await uploadCatalogImage(pendingImageFile, "brands");
        uploadedInThisAttempt.push(finalImage);
        revokeBlobPreviewUrl(previewUrl);
        setPendingImageFile(null);
        setPreviewUrl(finalImage);
        setSavedImageUrl(finalImage);
      }

      const payload = {
        name,
        website,
        status,
        visibility,
        image: finalImage,
      };

      if (mode === "add") {
        await createBrandApi(payload);
      } else if (initial) {
        await updateBrandApi(initial.id, payload);
      } else {
        throw new Error("Save failed");
      }

      await deleteHostedCatalogImages(
        collectRemovedHostedImages(
          initialHostedImage ? [initialHostedImage] : [],
          finalImage ? [finalImage] : []
        )
      );

      finishCatalogSave({
        entity: "brand",
        listHref: routes.brands,
        mode,
        name,
        router,
        showToast,
      });
    } catch (error) {
      if (uploadedInThisAttempt.length > 0) {
        await deleteHostedCatalogImages(uploadedInThisAttempt);
      }
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
      <div className="grid min-w-0 max-w-full items-start gap-4 md:grid-cols-2 lg:grid-cols-3">
        <FormCard title="General">
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
        <ThumbnailUploadCard
          alt={name || "Brand logo"}
          disabled={disabled}
          error={fieldErrors.image}
          help="Upload a square logo for brand tiles and filters."
          onUpload={handleImageUpload}
          previewState={previewState}
          previewUrl={previewUrl}
          required
          title="Brand logo"
        />
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
