"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { FormCard } from "@/components/forms/admin-form-primitives";
import { Icon } from "@/components/layout/icon";
import { platformInstance } from "@platform/api-client";
import { cn } from "@/utils/cn";

const PLACEHOLDER_IMAGE = "/assets/products/oat-biscuit.svg";

export type ThumbnailImageSource = "none" | "upload" | "url";

export function inferThumbnailImageSource(
  imageUrl: string
): ThumbnailImageSource {
  if (!imageUrl.trim()) {
    return "none";
  }
  if (imageUrl.includes("storage.googleapis.com")) {
    return "upload";
  }
  return "url";
}

export async function uploadCatalogImage(
  file: File,
  folder: "categories" | "brands" | "products"
): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);
  const result = await platformInstance.post<{ publicUrl: string }>(
    "/api/uploads",
    formData
  );
  return result.data.publicUrl;
}

export function CatalogFormError({ message }: { message: string | null }) {
  if (!message) {
    return null;
  }
  return <p className="text-[14px] text-danger-600">{message}</p>;
}

export function CatalogFormActions({
  cancelHref,
  loading,
  saveLabel = "Save",
}: {
  cancelHref: string;
  loading: boolean;
  saveLabel?: string;
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
        {loading ? "Saving…" : saveLabel}
      </button>
    </div>
  );
}

export function StatusDot({
  active,
  variant = "published",
}: {
  active: boolean;
  variant?: "published" | "draft" | "archived" | "active";
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "h-2.5 w-2.5 rounded-full",
        !active && "bg-warning-500",
        active &&
          (variant === "archived"
            ? "bg-surface-muted"
            : variant === "draft"
              ? "bg-warning-500"
              : "bg-success-500")
      )}
    />
  );
}

type ControlledFieldProps = {
  help?: string;
  label: string;
  maxLength?: number;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
  value: string;
};

export function ControlledField({
  help,
  label,
  maxLength,
  onChange,
  placeholder,
  required,
  type = "text",
  value,
}: ControlledFieldProps) {
  return (
    <label className="block">
      <span className="text-[13px] font-semibold text-ink-700">
        {label} {required ? <span className="text-danger-500">*</span> : null}
      </span>
      <input
        className="mt-1.5 h-10 w-full rounded-base border border-surface-line bg-surface-body px-3 text-[14px] placeholder:text-ink-400 focus:border-brand-600"
        maxLength={maxLength}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        type={type}
        value={value}
      />
      {help ? <p className="mt-1 text-[12px] text-ink-400">{help}</p> : null}
    </label>
  );
}

type ControlledSelectProps = {
  help?: string;
  hideLabel?: boolean;
  label: string;
  onChange: (value: string) => void;
  options: Array<{ label: string; value: string }>;
  value: string;
};

export function ControlledSelect({
  help,
  hideLabel,
  label,
  onChange,
  options,
  value,
}: ControlledSelectProps) {
  return (
    <label className="block">
      {hideLabel ? (
        <span className="sr-only">{label}</span>
      ) : (
        <span className="text-[13px] font-semibold text-ink-700">{label}</span>
      )}
      <select
        className={cn(
          "h-10 w-full rounded-base border border-surface-line bg-surface-body px-3 text-[14px] focus:border-brand-600",
          hideLabel ? "mt-0" : "mt-1.5"
        )}
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {help ? <p className="mt-1 text-[12px] text-ink-400">{help}</p> : null}
    </label>
  );
}

type ControlledTextareaProps = {
  help?: string;
  label: string;
  minRows?: number;
  onChange: (value: string) => void;
  placeholder?: string;
  value: string;
};

export function ReadOnlyField({
  help,
  label,
  value,
}: {
  help?: string;
  label: string;
  value: string;
}) {
  return (
    <div className="block">
      <span className="text-[13px] font-semibold text-ink-700">{label}</span>
      <p className="mt-1.5 flex h-10 items-center rounded-base border border-surface-line bg-surface-muted px-3 text-[14px] text-ink-600">
        {value}
      </p>
      {help ? <p className="mt-1 text-[12px] text-ink-400">{help}</p> : null}
    </div>
  );
}

export function ControlledTextarea({
  help,
  label,
  minRows = 4,
  onChange,
  placeholder,
  value,
}: ControlledTextareaProps) {
  return (
    <label className="block">
      <span className="text-[13px] font-semibold text-ink-700">{label}</span>
      <textarea
        className="mt-1.5 w-full rounded-base border border-surface-line bg-surface-body px-3 py-2 text-[14px] placeholder:text-ink-400 focus:border-brand-600"
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={minRows}
        value={value}
      />
      {help ? <p className="mt-1 text-[12px] text-ink-400">{help}</p> : null}
    </label>
  );
}

export function ThumbnailUploadCard({
  alt,
  imageSource = "none",
  imageUrl,
  loading,
  onClear,
  onImageUrlChange,
  onUpload,
  title = "Thumbnail",
}: {
  alt: string;
  imageSource?: ThumbnailImageSource;
  imageUrl: string;
  loading?: boolean;
  onClear?: () => void;
  onImageUrlChange?: (url: string) => void;
  onUpload: (file: File) => Promise<void>;
  title?: string;
}) {
  const preview = imageUrl || PLACEHOLDER_IMAGE;
  const isRemote = preview.startsWith("http");
  const hasImage = imageSource !== "none" && Boolean(imageUrl);
  const urlFieldLocked = imageSource === "upload";

  return (
    <FormCard title={title}>
      <div className="flex flex-col items-center text-center">
        <label className="group relative grid h-36 w-36 cursor-pointer place-items-center overflow-hidden rounded-base bg-surface-card shadow-soft transition-shadow hover:shadow-lift">
          <span className="absolute right-2 top-2 z-10 grid h-7 w-7 place-items-center rounded-full bg-surface-card text-ink-400 shadow-card transition-colors group-hover:text-brand-600">
            <Icon className="h-3.5 w-3.5" name="pencil" />
          </span>
          {isRemote || preview.startsWith("/") ? (
            <Image
              alt={alt}
              className="absolute inset-0 h-full w-full object-cover p-2"
              height={144}
              src={preview}
              unoptimized={isRemote}
              width={144}
            />
          ) : (
            <span className="grid h-20 w-20 -rotate-6 place-items-center rounded-base bg-brand-50 text-brand-200">
              <Icon className="h-10 w-10" name="image" />
            </span>
          )}
          <input
            accept=".png,.jpg,.jpeg,.webp"
            aria-label={`Upload ${title.toLowerCase()}`}
            className="sr-only"
            disabled={loading}
            onChange={async (event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              await onUpload(file);
              event.target.value = "";
            }}
            type="file"
          />
        </label>
        <p className="mt-4 text-[12px] text-ink-400">
          {loading
            ? "Uploading…"
            : urlFieldLocked
              ? "Uploaded to storage. Clear the image to paste an external URL."
              : hasImage
                ? "Upload a new file or edit the URL below."
                : "Upload a square image or paste a URL below. PNG, JPG, or WebP."}
        </p>
        {onImageUrlChange ? (
          <label className="mt-4 block w-full text-left">
            <span className="text-[12px] font-semibold text-ink-600">
              {urlFieldLocked ? "Hosted image URL" : "Or paste image URL"}
            </span>
            <input
              className={cn(
                "mt-1.5 h-9 w-full rounded-base border border-surface-line bg-surface-body px-3 text-[13px] placeholder:text-ink-400 focus:border-brand-600",
                urlFieldLocked &&
                  "cursor-not-allowed bg-surface-muted text-ink-500"
              )}
              disabled={loading || urlFieldLocked}
              onChange={(event) => onImageUrlChange(event.target.value)}
              placeholder="https://…"
              readOnly={urlFieldLocked}
              value={imageUrl}
            />
          </label>
        ) : null}
        {hasImage && onClear ? (
          <button
            className="mt-4 inline-flex h-9 items-center gap-2 rounded-base border border-surface-line px-4 text-[13px] font-semibold text-ink-700 hover:bg-surface-muted"
            onClick={onClear}
            type="button"
          >
            <Icon className="h-3.5 w-3.5" name="x" />
            Clear image
          </button>
        ) : null}
      </div>
    </FormCard>
  );
}

export function BrandTilePreview({
  initials,
  tileClass,
}: {
  initials: string;
  tileClass: string;
}) {
  return (
    <FormCard title="Brand tile">
      <div className="flex flex-col items-center text-center">
        <span
          className={cn(
            "grid h-36 w-36 place-items-center rounded-base text-[28px] font-semibold shadow-soft",
            tileClass
          )}
        >
          {initials || "?"}
        </span>
        <p className="mt-4 text-[12px] text-ink-400">
          Preview of how this brand appears in admin lists.
        </p>
      </div>
    </FormCard>
  );
}

export function ProductCountCard({
  count,
  productsHref,
}: {
  count: number;
  productsHref: string;
}) {
  return (
    <FormCard title="Assigned products">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[14px] text-ink-500">Products in catalog</span>
        <span className="text-[18px] font-semibold text-ink-900">{count}</span>
      </div>
      <Link
        className="mt-4 flex h-9 w-full items-center justify-center gap-2 rounded-base bg-brand-50 text-[13px] font-semibold text-brand-600 hover:bg-brand-100"
        href={productsHref}
      >
        View products
        <Icon className="h-3.5 w-3.5" name="arrow-up-right" />
      </Link>
    </FormCard>
  );
}

export type AttributeValueRow = {
  id: string;
  value: string;
};

export function AttributeValuesEditor({
  onRowsChange,
  rows,
}: {
  onRowsChange: (rows: AttributeValueRow[]) => void;
  rows: AttributeValueRow[];
}) {
  return (
    <FormCard title="Values">
      <div className="space-y-3">
        {rows.map((item, index) => (
          <div className="flex items-center gap-2" key={item.id}>
            <input
              aria-label={`Attribute value ${index + 1}`}
              className="h-10 flex-1 rounded-base border border-surface-line bg-surface-body px-3 text-[14px] focus:border-brand-600"
              onChange={(event) => {
                onRowsChange(
                  rows.map((row) =>
                    row.id === item.id
                      ? { ...row, value: event.target.value }
                      : row
                  )
                );
              }}
              placeholder="Value"
              value={item.value}
            />
            <button
              aria-label="Remove value"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-base border border-danger-100 bg-danger-50 text-danger-500 hover:bg-danger-100"
              onClick={() => {
                if (rows.length <= 1) {
                  onRowsChange([{ id: item.id, value: "" }]);
                  return;
                }
                onRowsChange(rows.filter((row) => row.id !== item.id));
              }}
              type="button"
            >
              <Icon className="h-4 w-4" name="x" />
            </button>
          </div>
        ))}
      </div>
      <button
        className="mt-4 inline-flex h-10 items-center gap-2 rounded-base border border-surface-line px-4 text-[13px] font-semibold text-ink-700 hover:bg-surface-muted"
        onClick={() =>
          onRowsChange([...rows, { id: `value-${Date.now()}`, value: "" }])
        }
        type="button"
      >
        <Icon className="h-4 w-4" name="plus" />
        Add value
      </button>
    </FormCard>
  );
}

export function CatalogFormLayout({
  aside,
  children,
}: {
  aside: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="grid min-w-0 max-w-full items-start gap-4 xl:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="min-w-0 space-y-4 xl:order-1">{aside}</aside>
      <div className="min-w-0 space-y-4 xl:order-2">{children}</div>
    </div>
  );
}

export function deriveInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return "";
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

export function createAttributeValueRows(
  values: string[]
): AttributeValueRow[] {
  const normalized = values.length > 0 ? values : [""];
  return normalized.map((value, index) => ({
    id: `value-${index}-${value}`,
    value,
  }));
}

export type ProductFormAttribute = {
  displayType: "Dropdown" | "Swatch" | "Text";
  inactive?: boolean;
  name: string;
  slug: string;
  values: string[];
};

export function toProductFormAttribute(attribute: {
  displayType: ProductFormAttribute["displayType"];
  name: string;
  slug: string;
  values: string[];
}): ProductFormAttribute {
  return {
    displayType: attribute.displayType,
    name: attribute.name,
    slug: attribute.slug,
    values: attribute.values,
  };
}

export function assignedProductAttributeSlugs(
  attributes: Record<string, string | string[]> | undefined
): string[] {
  if (!attributes) {
    return [];
  }

  return Object.entries(attributes)
    .filter(([, value]) => {
      if (Array.isArray(value)) {
        return value.some((item) => String(item).trim().length > 0);
      }
      return String(value).trim().length > 0;
    })
    .map(([slug]) => slug);
}

export function mergeProductFormAttributes(
  activeAttributes: ProductFormAttribute[],
  catalogAttributes: ProductFormAttribute[],
  assignedSlugs: string[]
): ProductFormAttribute[] {
  const activeSlugs = new Set(
    activeAttributes.map((attribute) => attribute.slug)
  );
  const merged = new Map(
    activeAttributes.map((attribute) => [attribute.slug, attribute])
  );

  for (const slug of assignedSlugs) {
    if (merged.has(slug)) {
      continue;
    }
    const definition = catalogAttributes.find(
      (attribute) => attribute.slug === slug
    );
    if (definition) {
      merged.set(slug, { ...definition, inactive: true });
    }
  }

  return Array.from(merged.values());
}

export function ProductImageList({
  images,
  onRemove,
}: {
  images: string[];
  onRemove: (image: string) => void;
}) {
  if (images.length === 0) {
    return null;
  }

  return (
    <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
      {images.map((image) => {
        const fileName = image.split("/").pop() ?? "image";
        const isRemote = image.startsWith("http");

        return (
          <li
            className="group relative overflow-hidden rounded-base border border-surface-line bg-surface-body"
            key={image}
          >
            {isRemote || image.startsWith("/") ? (
              <Image
                alt={fileName}
                className="aspect-square w-full object-cover"
                height={96}
                src={image}
                unoptimized={isRemote}
                width={96}
              />
            ) : (
              <div className="grid aspect-square place-items-center bg-surface-muted text-[12px] text-ink-400">
                {fileName}
              </div>
            )}
            <button
              aria-label={`Remove ${fileName}`}
              className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-full bg-surface-card/95 text-ink-500 opacity-0 shadow-card transition-opacity group-hover:opacity-100 hover:text-danger-500"
              onClick={() => onRemove(image)}
              type="button"
            >
              <Icon className="h-3.5 w-3.5" name="x" />
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export function ProductAttributesFields({
  attributes,
  onChange,
  values,
}: {
  attributes: ProductFormAttribute[];
  onChange: (values: Record<string, string>) => void;
  values: Record<string, string>;
}) {
  if (attributes.length === 0) {
    return null;
  }

  return (
    <FormCard title="Attributes">
      <div className="grid grid-cols-1 gap-4">
        {attributes.map((attribute) => {
          const currentValue = values[attribute.slug] ?? "";
          const inactiveHelp = attribute.inactive
            ? "Inactive attribute — value is preserved on this product."
            : undefined;

          if (attribute.displayType === "Text") {
            return (
              <ControlledField
                help={inactiveHelp}
                key={attribute.slug}
                label={attribute.name}
                onChange={(value) =>
                  onChange({ ...values, [attribute.slug]: value })
                }
                placeholder={`Enter ${attribute.name.toLowerCase()}`}
                value={currentValue}
              />
            );
          }

          return (
            <ControlledSelect
              help={
                inactiveHelp ??
                (attribute.displayType === "Swatch"
                  ? "Choose a predefined swatch value."
                  : undefined)
              }
              key={attribute.slug}
              label={attribute.name}
              onChange={(value) =>
                onChange({ ...values, [attribute.slug]: value })
              }
              options={[
                { label: "None", value: "" },
                ...attribute.values.map((value) => ({
                  label: value,
                  value,
                })),
              ]}
              value={currentValue}
            />
          );
        })}
      </div>
    </FormCard>
  );
}
