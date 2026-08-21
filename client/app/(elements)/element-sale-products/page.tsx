import { Metadata } from "next";
import SaleProducts from "@/components/elements/element-sale-products/SaleProducts";
import ElementsHero from "@/components/elements/ElementsHero";
export const metadata: Metadata = {
  title:
    "Element Sale Products | Discover premium cosmetics and skincare products at Beauty Station.",
  description:
    "Discover premium cosmetics and skincare products at Beauty Station.",
};
export default function ElementSaleProductsPage() {
  return (
    <>
      <>
        <ElementsHero
          title={
            <>
              Exclusive <span>Sale Products</span>
            </>
          }
        />
        <SaleProducts />
      </>
    </>
  );
}
