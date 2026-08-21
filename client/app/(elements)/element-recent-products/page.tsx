import { Metadata } from "next";
import RecentProducts from "@/components/elements/element-recent-products/RecentProducts";
import ElementsHero from "@/components/elements/ElementsHero";
export const metadata: Metadata = {
  title:
    "Element Recent Products | Discover premium cosmetics and skincare products at Beauty Station.",
  description:
    "Discover premium cosmetics and skincare products at Beauty Station.",
};
export default function ElementRecentProductsPage() {
  return (
    <>
      <ElementsHero
        title={
          <>
            Exclusive <span>Recent Products</span>
          </>
        }
      />
      <RecentProducts />
    </>
  );
}
