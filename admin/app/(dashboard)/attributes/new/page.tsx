import type { Metadata } from "next";
import { AttributeCatalogForm } from "@/components/catalog/catalog-forms";
import { PageHeader } from "@/components/layout/page-header";
import { getAdminSiteConfig } from "@/lib/site";

const site = getAdminSiteConfig();

export const metadata: Metadata = {
  title: `Add Attribute | ${site.name} Admin`,
};

export default function AddAttributePage() {
  return (
    <>
      <PageHeader
        description="Create a reusable product attribute."
        eyebrow="Catalog"
        title="Add Attribute"
      />
      <AttributeCatalogForm mode="add" />
    </>
  );
}
