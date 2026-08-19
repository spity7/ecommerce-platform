import Link from "next/link";
import { CategoryListTable } from "@/components/catalog/list-pages";
import { ShowcaseStrip } from "@/components/catalog/showcase-strip";
import { Icon } from "@/components/layout/icon";
import { PageHeader } from "@/components/layout/page-header";
import { routes } from "@/config/routes";
import type { Category } from "@/data/admin/catalog";
import { fetchCategories } from "@platform/api-client";
import { mapCategoryDto } from "@/lib/mappers/catalog";
import { getAdminSiteConfig } from "@/lib/site";

const site = getAdminSiteConfig();

export const metadata = {
  title: `Categories | ${site.name} Admin`,
};

export default async function CategoriesPage() {
  let categories: Category[] = [];
  let loadError: string | null = null;

  try {
    const response = await fetchCategories({ limit: 100 });
    categories = response.data.map(mapCategoryDto);
  } catch (error) {
    loadError =
      error instanceof Error ? error.message : "Unable to load categories.";
  }

  return (
    <>
      <PageHeader
        actions={
          <Link
            className="inline-flex h-10 items-center gap-2 rounded-base bg-brand-600 px-4 text-[14px] font-semibold text-white hover:bg-brand-700"
            href={routes.addCategory}
          >
            <Icon className="h-4 w-4" name="plus" />
            Add Category
          </Link>
        }
        description="Organize storefront navigation and merchandising groups."
        eyebrow="Catalog"
        title="Categories"
      />
      {loadError ? (
        <div className="mb-4 rounded-base border border-warning-200 bg-warning-50 px-4 py-3 text-[14px] text-warning-700">
          {loadError}
        </div>
      ) : null}
      <ShowcaseStrip items={categories} type="category" />
      <CategoryListTable categories={categories} />
    </>
  );
}
