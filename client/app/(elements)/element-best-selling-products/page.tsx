import { Metadata } from "next";
import BestSellingProducts from "@/components/elements/element-best-selling-products/BestSellingProducts";
import ElementsHero from "@/components/elements/ElementsHero";
export const metadata: Metadata = {
  title:
    "Element Best Selling Products | Discover premium cosmetics and skincare products at Beauty Station.",
  description: "Discover premium cosmetics and skincare products at Beauty Station.",
};
export default function ElementBestSellingProductsPage() {
  return (
    <>
      <ElementsHero
        title={
          <>
            Exclusive <span>Best Selling Products</span>
          </>
        }
      />
      <BestSellingProducts />
    </>
  );
}
