import Link from "next/link";
import { BrandListTable } from "@/components/catalog/list-pages";
import { ShowcaseStrip } from "@/components/catalog/showcase-strip";
import { Icon } from "@/components/layout/icon";
import { PageHeader } from "@/components/layout/page-header";
import { routes } from "@/config/routes";
import { fetchBrands } from "@platform/api-client";
import { mapBrandDto } from "@/lib/mappers/catalog";
import { getAdminSiteConfig } from "@/lib/site";

const site = getAdminSiteConfig();

export const metadata = {
  title: `Brands | ${site.name} Admin`,
};

export default async function BrandsPage() {
  let brands: ReturnType<typeof mapBrandDto>[] = [];
  let loadError: string | null = null;

  try {
    const response = await fetchBrands({ limit: 100 });
    brands = response.data.map(mapBrandDto);
  } catch (error) {
    loadError =
      error instanceof Error ? error.message : "Unable to load brands.";
  }

  return (
    <>
      <PageHeader
        actions={
          <Link
            className="inline-flex h-10 items-center gap-2 rounded-base bg-brand-600 px-4 text-[14px] font-semibold text-white hover:bg-brand-700"
            href={routes.addBrand}
          >
            <Icon className="h-4 w-4" name="plus" />
            Add Brand
          </Link>
        }
        description="Manage product brands, storefront visibility, and brand merchandising details."
        eyebrow="Catalog"
        title="Brands"
      />
      {loadError ? (
        <div className="mb-4 rounded-base border border-warning-200 bg-warning-50 px-4 py-3 text-[14px] text-warning-700">
          {loadError}
        </div>
      ) : null}
      <ShowcaseStrip items={brands} type="brand" />
      <BrandListTable brands={brands} />
    </>
  );
}
