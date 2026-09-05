"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  CatalogFormActions,
  CatalogFormError,
  CatalogFormLayout,
  ControlledField,
  ControlledSelect,
  inferThumbnailImageSource,
  ProductCountCard,
  StatusDot,
  ThumbnailUploadCard,
  type ThumbnailImageSource,
  uploadCatalogImage,
} from "@/components/catalog/catalog-form-primitives";
import { FormCard } from "@/components/forms/admin-form-primitives";
import { routes } from "@/config/routes";
import { createCategoryApi, updateCategoryApi } from "@platform/api-client";
import type { CategoryDto } from "@platform/shared";

type FormState = {
  error: string | null;
  loading: boolean;
};

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
  const [image, setImage] = useState(initial?.image ?? "");
  const [imageSource, setImageSource] = useState<ThumbnailImageSource>(() =>
    inferThumbnailImageSource(initial?.image ?? "")
  );
  const [status, setStatus] = useState<CategoryDto["status"]>(
    initial?.status ?? "draft"
  );
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formState, setFormState] = useState<FormState>({
    error: null,
    loading: false,
  });

  async function handleImageUpload(file: File) {
    setUploadingImage(true);
    setFormState((current) => ({ ...current, error: null }));
    try {
      const url = await uploadCatalogImage(file, "categories");
      setImage(url);
      setImageSource("upload");
    } catch (error) {
      setFormState((current) => ({
        ...current,
        error: error instanceof Error ? error.message : "Image upload failed",
      }));
    } finally {
      setUploadingImage(false);
    }
  }

  function handleImageUrlChange(url: string) {
    setImage(url);
    setImageSource(url.trim() ? "url" : "none");
  }

  function handleClearImage() {
    setImage("");
    setImageSource("none");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormState({ error: null, loading: true });

    const payload = { name, image, status };

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
    <form onSubmit={handleSubmit}>
      <CatalogFormLayout
        aside={
          <>
            <ThumbnailUploadCard
              alt={name || "Category thumbnail"}
              imageSource={imageSource}
              imageUrl={image}
              loading={uploadingImage}
              onClear={handleClearImage}
              onImageUrlChange={handleImageUrlChange}
              onUpload={handleImageUpload}
            />
            <FormCard
              title="Status"
              titleEnd={
                <StatusDot active={status === "published"} variant={status} />
              }
            >
              <ControlledSelect
                hideLabel
                label="Status"
                onChange={(value) => setStatus(value as CategoryDto["status"])}
                options={[
                  { label: "Draft", value: "draft" },
                  { label: "Published", value: "published" },
                ]}
                value={status}
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
          <div className="space-y-4">
            <ControlledField
              help="A category name is required and should be unique."
              label="Category name"
              onChange={setName}
              placeholder="Category name"
              required
              value={name}
            />
          </div>
        </FormCard>
      </CatalogFormLayout>
      <CatalogFormError message={formState.error} />
      <CatalogFormActions
        cancelHref={routes.categories}
        loading={formState.loading}
      />
    </form>
  );
}
