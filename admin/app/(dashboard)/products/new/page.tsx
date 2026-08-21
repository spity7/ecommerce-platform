import type { Metadata } from "next";
import { ProductCatalogForm } from "@/components/catalog/catalog-forms";
import { PageHeader } from "@/components/layout/page-header";
import { fetchBrands, fetchCategories } from "@platform/api-client";
import { getAdminSiteConfig } from "@/lib/site";

const site = getAdminSiteConfig();

export const metadata: Metadata = {
  title: `Add Product | ${site.name} Admin`,
};

export default async function AddProductPage() {
  const [categoriesRes, brandsRes] = await Promise.all([
    fetchCategories({ limit: 100 }),
    fetchBrands({ limit: 100 }),
  ]);

  const categories = categoriesRes.data.map((c) => ({
    id: c.id,
    name: c.name,
  }));
  const brands = brandsRes.data.map((b) => ({ id: b.id, name: b.name }));

  return (
    <>
      <PageHeader
        description="Create a new catalog product."
        eyebrow="Catalog"
        title="Add Product"
      />
      <ProductCatalogForm brands={brands} categories={categories} mode="add" />
    </>
  );
}
