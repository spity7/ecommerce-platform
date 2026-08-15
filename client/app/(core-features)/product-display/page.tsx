import { Metadata } from "next";
import ProductDisplayBanner from "@/components/core-features/product-display/ProductDisplayBanner";
import ProductDisplayComponents from "@/components/core-features/product-display/ProductDisplayComponents";
export const metadata: Metadata = {
  title:
    "Product Display | Discover premium cosmetics and skincare products at Beauty Station.",
  description: "Discover premium cosmetics and skincare products at Beauty Station.",
};
export default function ProductDisplayPage() {
  return (
    <>
      <ProductDisplayBanner />
      <ProductDisplayComponents />
    </>
  );
}
