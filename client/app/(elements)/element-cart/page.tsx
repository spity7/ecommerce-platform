import { Metadata } from "next";
import ShoppingCart from "@/components/elements/element-cart/ShoppingCart";
import ElementsHero from "@/components/elements/ElementsHero";
export const metadata: Metadata = {
  title: "Element Cart | Discover premium cosmetics and skincare products at Beauty Station.",
  description: "Discover premium cosmetics and skincare products at Beauty Station.",
};
export default function ElementCartPage() {
  return (
    <>
      <ElementsHero
        title={
          <>
            Exclusive <span>Cart</span>
          </>
        }
      />
      <ShoppingCart />
    </>
  );
}
