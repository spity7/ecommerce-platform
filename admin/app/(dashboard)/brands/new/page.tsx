import type { Metadata } from "next";
import { BrandCatalogForm } from "@/components/catalog/catalog-forms";
import { PageHeader } from "@/components/layout/page-header";
import { getAdminSiteConfig } from "@/lib/site";

const site = getAdminSiteConfig();

export const metadata: Metadata = {
  title: `Add Brand | ${site.name} Admin`,
};

export default function AddBrandPage() {
  return (
    <>
      <PageHeader
        description="Create a new brand profile."
        eyebrow="Catalog"
        title="Add Brand"
      />
      <BrandCatalogForm mode="add" />
    </>
  );
}
