import Banner from "@/components/products/Banner";
import Breadcrumb from "@/components/products/Breadcrumb";
import Categories from "@/components/products/Categories";
import ShopDefault from "@/components/products/ShopDefault";
import { StorefrontChrome } from "@/components/site/StorefrontChrome";
import { cosmeticProducts } from "@/data/products/beauty";
import { mapProductDtosToStorefront } from "@/lib/mappers/product";
import { getStorefrontSiteConfig } from "@/lib/site";
import { fetchProducts } from "@platform/api-client";
import type { Metadata } from "next";
import type { Product } from "@/types/product";

const site = getStorefrontSiteConfig();

export const metadata: Metadata = {
  title: `Shop | ${site.seo.title}`,
  description: site.seo.description,
};

async function loadShopProducts(): Promise<Product[]> {
  try {
    const response = await fetchProducts({
      status: "published",
      limit: 100,
    });
    if (response.data.length > 0) {
      return mapProductDtosToStorefront(response.data);
    }
  } catch {
    // fall through to static data
  }
  return cosmeticProducts;
}

export default async function ShopPage() {
  const products = await loadShopProducts();

  return (
    <StorefrontChrome>
      <Breadcrumb title="Shop" />
      <Banner />
      <Categories />
      <div className="rbt-component-area ptb--32 ptb_sm--12">
        <div className="container">
          <div className="rbt-separator rbt-separator-gray200" />
        </div>
      </div>
      <ShopDefault
        cardVariant="standard"
        detailsPageUrl="/product"
        products={products}
      />
    </StorefrontChrome>
  );
}
