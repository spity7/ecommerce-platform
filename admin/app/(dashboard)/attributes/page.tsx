import Link from "next/link";
import { AttributeListTable } from "@/components/catalog/list-pages";
import { Icon } from "@/components/layout/icon";
import { PageHeader } from "@/components/layout/page-header";
import { routes } from "@/config/routes";
import type { Attribute } from "@/data/admin/catalog";
import { fetchAttributes } from "@platform/api-client";
import { mapAttributeDto } from "@/lib/mappers/catalog";
import { getAdminSiteConfig } from "@/lib/site";

const site = getAdminSiteConfig();

export const metadata = {
  title: `Attributes | ${site.name} Admin`,
};

export default async function AttributesPage() {
  let attributes: Attribute[] = [];
  let loadError: string | null = null;

  try {
    const response = await fetchAttributes({ limit: 100 });
    attributes = response.data.map(mapAttributeDto);
  } catch (error) {
    loadError =
      error instanceof Error ? error.message : "Unable to load attributes.";
  }

  return (
    <>
      <PageHeader
        actions={
          <Link
            className="inline-flex h-10 items-center gap-2 rounded-base bg-brand-600 px-4 text-[14px] font-semibold text-white hover:bg-brand-700"
            href={routes.addAttribute}
          >
            <Icon className="h-4 w-4" name="plus" />
            Add Attribute
          </Link>
        }
        description="Manage product options such as size, color, material, and weight."
        eyebrow="Catalog"
        title="Attributes"
      />
      {loadError ? (
        <div className="mb-4 rounded-base border border-warning-200 bg-warning-50 px-4 py-3 text-[14px] text-warning-700">
          {loadError}
        </div>
      ) : null}
      <AttributeListTable attributes={attributes} />
    </>
  );
}
