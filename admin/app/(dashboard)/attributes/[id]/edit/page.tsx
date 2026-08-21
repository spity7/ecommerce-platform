import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AttributeCatalogForm } from "@/components/catalog/catalog-forms";
import { PageHeader } from "@/components/layout/page-header";
import { getAttributeApi } from "@platform/api-client";
import { getAdminSiteConfig } from "@/lib/site";

const site = getAdminSiteConfig();

export const metadata: Metadata = {
  title: `Edit Attribute | ${site.name} Admin`,
};

export default async function EditAttributePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let attribute;
  try {
    attribute = await getAttributeApi(id);
  } catch {
    notFound();
  }

  return (
    <>
      <PageHeader
        description="Update attribute values and display settings."
        eyebrow="Catalog"
        title="Edit Attribute"
      />
      <AttributeCatalogForm initial={attribute} mode="edit" />
    </>
  );
}
