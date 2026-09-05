import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductCatalogForm } from "@/components/catalog/catalog-forms";
import { PageHeader } from "@/components/layout/page-header";
import {
  fetchAttributes,
  fetchBrands,
  fetchCategories,
  fetchProductById,
} from "@platform/api-client";
import { getAdminSiteConfig } from "@/lib/site";

const site = getAdminSiteConfig();

export const metadata: Metadata = {
  title: `Edit Product | ${site.name} Admin`,
};

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let product;
  try {
    product = await fetchProductById(id);
  } catch {
    notFound();
  }

  const [categoriesRes, brandsRes, attributesRes] = await Promise.all([
    fetchCategories({ limit: 100 }),
    fetchBrands({ limit: 100 }),
    fetchAttributes({ limit: 100, status: "active" }),
  ]);

  const categories = categoriesRes.data.map((c) => ({
    id: c.id,
    name: c.name,
  }));
  const brands = brandsRes.data.map((b) => ({ id: b.id, name: b.name }));
  const attributes = attributesRes.data.map((attribute) => ({
    slug: attribute.slug,
    name: attribute.name,
    displayType: attribute.displayType,
    values: attribute.values,
  }));

  return (
    <>
      <PageHeader
        description="Update product details, pricing, and stock."
        eyebrow="Catalog"
        title="Edit Product"
      />
      <ProductCatalogForm
        attributes={attributes}
        brands={brands}
        categories={categories}
        initial={product}
        mode="edit"
      />
    </>
  );
}
