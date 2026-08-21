import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryCatalogForm } from "@/components/catalog/catalog-forms";
import { PageHeader } from "@/components/layout/page-header";
import { getCategoryApi } from "@platform/api-client";
import { getAdminSiteConfig } from "@/lib/site";

const site = getAdminSiteConfig();

export const metadata: Metadata = {
  title: `Edit Category | ${site.name} Admin`,
};

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let category;
  try {
    category = await getCategoryApi(id);
  } catch {
    notFound();
  }

  return (
    <>
      <PageHeader
        description="Update category details and publish state."
        eyebrow="Catalog"
        title="Edit Category"
      />
      <CategoryCatalogForm initial={category} mode="edit" />
    </>
  );
}
