"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  AssignedProductsSection,
  AttributeValuesEditor,
  CatalogFormFooter,
  ControlledField,
  ControlledSelect,
  ControlledTextarea,
  createAttributeValueRows,
  catalogSubmitErrorState,
  resolveCatalogFieldErrors,
  useFocusFirstCatalogFieldError,
  type AssignedProductPreview,
  type AttributeValueRow,
} from "@/components/catalog/catalog-form-primitives";
import { FormCard } from "@/components/forms/admin-form-primitives";
import { CatalogStatusSelect } from "@/components/products/catalog-status-select";
import { routes } from "@/config/routes";
import { productsListPath } from "@/lib/paths";
import {
  catalogSaveButtonLabel,
  finishCatalogSave,
} from "@/lib/catalog-feedback";
import { useToast } from "@/providers/toast-provider";
import { useCatalogFormLeaveGuard } from "@/components/catalog/use-catalog-form-leave-guard";
import { cn } from "@/utils/cn";
import { isAttributeCatalogFormDirty } from "@/lib/catalog-form-dirty";
import {
  createAttributeApi,
  updateAttributeApi,
  type ApiValidationDetails,
} from "@platform/api-client";
import type { AttributeDto } from "@platform/shared";

type FormState = {
  error: string | null;
  loading: boolean;
  validationDetails: ApiValidationDetails | null;
};

type AttributeCatalogFormProps = {
  assignedProducts?: AssignedProductPreview[];
  initial?: AttributeDto;
  linkedProductCount?: number;
  mode: "add" | "edit";
};

export function AttributeCatalogForm({
  assignedProducts = [],
  initial,
  linkedProductCount,
  mode,
}: AttributeCatalogFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [name, setName] = useState(initial?.name ?? "");
  const [displayType, setDisplayType] = useState<AttributeDto["displayType"]>(
    initial?.displayType ?? "Dropdown"
  );
  const [description, setDescription] = useState(initial?.description ?? "");
  const [status, setStatus] = useState<AttributeDto["status"]>(
    initial?.status ?? "draft"
  );
  const [valueRows, setValueRows] = useState<AttributeValueRow[]>(() =>
    createAttributeValueRows(initial?.values ?? [])
  );
  const [formState, setFormState] = useState<FormState>({
    error: null,
    loading: false,
    validationDetails: null,
  });

  const usesPredefinedValues = displayType !== "Text";

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
      isAttributeCatalogFormDirty({
        description,
        displayType,
        initial,
        mode,
        name,
        status,
        valueRows,
      }),
    [description, displayType, initial, mode, name, status, valueRows]
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormState({ error: null, loading: true, validationDetails: null });

    const values = usesPredefinedValues
      ? valueRows.map((row) => row.value.trim()).filter(Boolean)
      : [];

    const payload = {
      name,
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
      finishCatalogSave({
        entity: "attribute",
        listHref: routes.attributes,
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
      <div
        className={cn(
          "grid min-w-0 max-w-full items-start gap-4 md:grid-cols-2",
          usesPredefinedValues
            ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_280px]"
            : "lg:grid-cols-[minmax(0,1fr)_280px]"
        )}
      >
        <FormCard title="General">
          <div className="grid gap-4 sm:grid-cols-2">
            <ControlledField
              disabled={disabled}
              error={fieldErrors.name}
              fieldKey="name"
              help="Attribute names appear in product option controls."
              label="Attribute name"
              onChange={(value) => {
                setName(value);
                setFormState((current) => ({
                  ...current,
                  error: null,
                  validationDetails: null,
                }));
              }}
              placeholder="e.g. Color"
              required
              value={name}
            />
            <ControlledSelect
              disabled={disabled}
              help="How values should be displayed in admin forms."
              label="Display type"
              onChange={(value) =>
                setDisplayType(value as AttributeDto["displayType"])
              }
              options={[
                { label: "Dropdown", value: "Dropdown" },
                { label: "Swatch", value: "Swatch" },
                { label: "Text", value: "Text" },
              ]}
              value={displayType}
            />
          </div>
          <div className="mt-4">
            <ControlledTextarea
              disabled={disabled}
              label="Description"
              minRows={4}
              onChange={setDescription}
              placeholder="Optional internal note for admins."
              value={description}
            />
          </div>
        </FormCard>
        {usesPredefinedValues ? (
          <AttributeValuesEditor
            disabled={disabled}
            onRowsChange={setValueRows}
            rows={valueRows}
          />
        ) : null}
        <aside className="min-w-0 space-y-4">
          <FormCard title="Status">
            <CatalogStatusSelect
              disabled={disabled}
              onValueChange={(value) =>
                setStatus(value as AttributeDto["status"])
              }
              statuses={["draft", "published"]}
              value={status}
            />
            <p className="mt-2 text-[13px] leading-snug text-ink-500">
              Draft attributes are hidden from product forms. Published
              attributes appear in the product attribute picker.
            </p>
          </FormCard>
        </aside>
      </div>
      <CatalogFormFooter
        cancelHref={routes.attributes}
        error={formState.error}
        loading={formState.loading}
        saveDisabled={!isDirty}
        saveLabel={catalogSaveButtonLabel("attribute", mode)}
        showDividerAboveActions={mode === "add"}
      />
      {mode === "edit" && initial ? (
        <div className="mt-6 border-t border-surface-line pt-6">
          <AssignedProductsSection
            addProductHref={routes.addProduct}
            count={linkedProductCount ?? initial.productCount}
            disabled={disabled}
            emptyDescription="Products will appear here once this attribute is set on a product."
            entityLabel="attribute"
            products={assignedProducts}
            productsHref={productsListPath({ attributeSlug: initial.slug })}
            productsListFilter={{ attributeSlug: initial.slug }}
            title="Product usage"
          />
        </div>
      ) : null}
    </form>
  );
}
