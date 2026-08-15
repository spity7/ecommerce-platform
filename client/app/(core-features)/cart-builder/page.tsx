import { Metadata } from "next";
import CartBuilderBanner from "@/components/core-features/cart-builder/CartBuilderBanner";
import CartBuilderComponents from "@/components/core-features/cart-builder/CartBuilderComponents";
export const metadata: Metadata = {
  title: "Cart Builder | Discover premium cosmetics and skincare products at Beauty Station.",
  description: "Discover premium cosmetics and skincare products at Beauty Station.",
};
export default function CartBuilderPage() {
  return (
    <>
      <CartBuilderBanner />
      <CartBuilderComponents />
    </>
  );
}
