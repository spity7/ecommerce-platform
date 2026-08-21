import type { Metadata } from "next";
import { CategoryCatalogForm } from "@/components/catalog/catalog-forms";
import { PageHeader } from "@/components/layout/page-header";
import { getAdminSiteConfig } from "@/lib/site";

const site = getAdminSiteConfig();

export const metadata: Metadata = {
  title: `Add Category | ${site.name} Admin`,
};

export default function AddCategoryPage() {
  return (
    <>
      <PageHeader
        description="Create a new merchandising category."
        eyebrow="Catalog"
        title="Add Category"
      />
      <CategoryCatalogForm mode="add" />
    </>
  );
}
