"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  AttributeValuesEditor,
  CatalogFormActions,
  CatalogFormError,
  ControlledField,
  ControlledSelect,
  createAttributeValueRows,
  StatusDot,
  type AttributeValueRow,
} from "@/components/catalog/catalog-form-primitives";
import { FormCard } from "@/components/forms/admin-form-primitives";
import { routes } from "@/config/routes";
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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormState({ error: null, loading: true });

    const values = valueRows.map((row) => row.value.trim()).filter(Boolean);

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
    <form
      className="grid min-w-0 max-w-full gap-4 xl:grid-cols-[minmax(0,1fr)_280px]"
      onSubmit={handleSubmit}
    >
      <div className="min-w-0 space-y-4">
        <FormCard title="General">
          <div className="space-y-4">
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
            <label className="block">
              <span className="text-[13px] font-semibold text-ink-700">
                Description
              </span>
              <textarea
                className="mt-1.5 min-h-[88px] w-full rounded-base border border-surface-line bg-surface-body px-3 py-2 text-[14px] placeholder:text-ink-400 focus:border-brand-600"
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Optional internal note for admins."
                value={description}
              />
            </label>
          </div>
        </FormCard>
        <AttributeValuesEditor onRowsChange={setValueRows} rows={valueRows} />
      </div>
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
      <div className="col-span-full">
        <CatalogFormError message={formState.error} />
        <CatalogFormActions
          cancelHref={routes.attributes}
          loading={formState.loading}
        />
      </div>
    </form>
  );
}
