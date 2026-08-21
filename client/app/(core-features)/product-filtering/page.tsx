import { Metadata } from "next";
import ProductFilteringBanner from "@/components/core-features/product-filtering/ProductFilteringBanner";
import ProductFilteringComponents from "@/components/core-features/product-filtering/ProductFilteringComponents";
export const metadata: Metadata = {
  title:
    "Product Filtering | Discover premium cosmetics and skincare products at Beauty Station.",
  description:
    "Discover premium cosmetics and skincare products at Beauty Station.",
};
export default function ProductFilteringPage() {
  return (
    <>
      <ProductFilteringBanner />

      <ProductFilteringComponents />
    </>
  );
}
