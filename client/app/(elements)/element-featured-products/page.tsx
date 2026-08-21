import { Metadata } from "next";
import FeaturedProducts from "@/components/elements/element-featured-products/FeaturedProducts";
import ElementsHero from "@/components/elements/ElementsHero";
export const metadata: Metadata = {
  title:
    "Element Featured Products | Discover premium cosmetics and skincare products at Beauty Station.",
  description:
    "Discover premium cosmetics and skincare products at Beauty Station.",
};
export default function ElementFeaturedProductsPage() {
  return (
    <>
      <ElementsHero
        title={
          <>
            Exclusive <span>Featured Products</span>
          </>
        }
      />
      <FeaturedProducts />
    </>
  );
}
