"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  AttributeValuesEditor,
  CatalogFormActions,
  CatalogFormError,
  ControlledField,
  ControlledSelect,
  ControlledTextarea,
  createAttributeValueRows,
  StatusDot,
  type AttributeValueRow,
} from "@/components/catalog/catalog-form-primitives";
import { FormCard } from "@/components/forms/admin-form-primitives";
import { routes } from "@/config/routes";
import { cn } from "@/utils/cn";
import { createAttributeApi, updateAttributeApi } from "@platform/api-client";
import type { AttributeDto } from "@platform/shared";

type FormState = {
  error: string | null;
  loading: boolean;
};

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
  });

  const usesPredefinedValues = displayType !== "Text";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormState({ error: null, loading: true });

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
    <form className="min-w-0 max-w-full space-y-4" onSubmit={handleSubmit}>
      <div
        className={cn(
          "grid min-w-0 max-w-full items-start gap-4 md:grid-cols-2",
          usesPredefinedValues
            ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_280px]"
            : "lg:grid-cols-[minmax(0,1fr)_280px]"
        )}
      >
        <FormCard title="General">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
            <ControlledField
              help="Attribute names appear in product option controls."
              label="Attribute name"
              onChange={setName}
              placeholder="e.g. Color"
              required
              value={name}
            />
            <ControlledSelect
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
              help="Optional internal note for admins."
              label="Description"
              minRows={4}
              onChange={setDescription}
              placeholder="Optional internal note for admins."
              value={description}
            />
          </div>
        </FormCard>
        {usesPredefinedValues ? (
          <AttributeValuesEditor onRowsChange={setValueRows} rows={valueRows} />
        ) : null}
        <aside className="min-w-0 space-y-4">
          <FormCard
            title="Status"
            titleEnd={
              <StatusDot
                active={status === "active"}
                variant={status === "active" ? "active" : "draft"}
              />
            }
          >
            <ControlledSelect
              help="Draft attributes are hidden from product forms."
              hideLabel
              label="Status"
              onChange={(value) => setStatus(value as AttributeDto["status"])}
              options={[
                { label: "Draft", value: "draft" },
                { label: "Active", value: "active" },
              ]}
              value={status}
            />
          </FormCard>
          {mode === "edit" && initial ? (
            <FormCard title="Usage">
              <p className="text-[30px] font-semibold leading-none text-ink-900">
                {initial.productCount}
              </p>
              <p className="mt-2 text-[13px] text-ink-400">
                Products referencing this attribute definition
              </p>
            </FormCard>
          ) : null}
        </aside>
      </div>
      <CatalogFormError message={formState.error} />
      <CatalogFormActions
        cancelHref={routes.attributes}
        loading={formState.loading}
      />
    </form>
  );
}
