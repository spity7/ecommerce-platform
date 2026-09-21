"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  AssignedProductsSection,
  CatalogFormFooter,
  ControlledField,
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
import { useCatalogFormLeaveGuard } from "@/components/catalog/use-catalog-form-leave-guard";
import { useToast } from "@/providers/toast-provider";
import { isCategoryCatalogFormDirty } from "@/lib/catalog-form-dirty";
import {
  createCategoryApi,
  updateCategoryApi,
  type ApiValidationDetails,
} from "@platform/api-client";
import type { CategoryDto } from "@platform/shared";

type FormState = {
  error: string | null;
  loading: boolean;
  validationDetails: ApiValidationDetails | null;
};

type CategoryCatalogFormProps = {
  assignedProducts?: AssignedProductPreview[];
  initial?: CategoryDto;
  linkedProductCount?: number;
  mode: "add" | "edit";
};

function hasCategoryImage(
  savedImageUrl: string,
  pendingImageFile: File | null
): boolean {
  return Boolean(savedImageUrl.trim() || pendingImageFile);
}

export function CategoryCatalogForm({
  assignedProducts = [],
  initial,
  linkedProductCount,
  mode,
}: CategoryCatalogFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [name, setName] = useState(initial?.name ?? "");
  const [savedImageUrl, setSavedImageUrl] = useState(initial?.image ?? "");
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(initial?.image ?? "");
  const [status, setStatus] = useState<CategoryDto["status"]>(
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
      isCategoryCatalogFormDirty({
        initial,
        mode,
        name,
        pendingImageFile,
        savedImageUrl,
        status,
      }),
    [initial, mode, name, pendingImageFile, savedImageUrl, status]
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

    if (!hasCategoryImage(savedImageUrl, pendingImageFile)) {
      setFormState({
        error: "Category image is required",
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
        finalImage = await uploadCatalogImage(pendingImageFile, "categories");
        uploadedInThisAttempt.push(finalImage);
        revokeBlobPreviewUrl(previewUrl);
        setPendingImageFile(null);
        setPreviewUrl(finalImage);
        setSavedImageUrl(finalImage);
      }

      const payload = { name, image: finalImage, status };

      if (mode === "add") {
        await createCategoryApi(payload);
      } else if (initial) {
        await updateCategoryApi(initial.id, payload);
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
        entity: "category",
        listHref: routes.categories,
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
            help="A category name is required and should be unique."
            label="Category name"
            onChange={(value) => {
              setName(value);
              setFormState((current) => ({
                ...current,
                error: null,
                validationDetails: null,
              }));
            }}
            placeholder="Category name"
            required
            value={name}
          />
        </FormCard>
        <FormCard title="Status">
          <CatalogStatusSelect
            disabled={disabled}
            onValueChange={(value) => setStatus(value as CategoryDto["status"])}
            statuses={["draft", "published"]}
            value={status}
          />
          <p className="mt-2 text-[13px] leading-snug text-ink-500">
            Draft categories are hidden from published storefront views.
          </p>
        </FormCard>
        <ThumbnailUploadCard
          alt={name || "Category thumbnail"}
          disabled={disabled}
          error={fieldErrors.image}
          onUpload={handleImageUpload}
          previewState={previewState}
          previewUrl={previewUrl}
          required
        />
      </div>
      <CatalogFormFooter
        cancelHref={routes.categories}
        error={formState.error}
        loading={formState.loading}
        saveDisabled={!isDirty}
        saveLabel={catalogSaveButtonLabel("category", mode)}
        showDividerAboveActions={mode === "add"}
      />
      {mode === "edit" && initial ? (
        <div className="mt-6 border-t border-surface-line pt-6">
          <AssignedProductsSection
            addProductHref={addProductPath({ categoryId: initial.id })}
            count={linkedProductCount ?? initial.productCount}
            disabled={disabled}
            emptyDescription="Add a product and choose this category in the product form."
            entityLabel="category"
            products={assignedProducts}
            productsHref={productsListPath({ categoryId: initial.id })}
            productsListFilter={{ categoryId: initial.id }}
          />
        </div>
      ) : null}
    </form>
  );
}
