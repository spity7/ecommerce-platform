import BottomStickyProduct from "@/components/product-details/others/BottomStickyProduct";
import { allProducts } from "@/data/products";
import Footer4 from "@/components/footers/Footer4";
import DetailsAccessories2 from "@/components/product-details/details/DetailsAccessories2";
import BoughtTogether6 from "@/components/product-details/others/BoughtTogether6";
import BreadCrumb from "@/components/product-details/BreadCrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Product Single Accessories 02 | Beauty Station | Cosmetics & Skincare",
  description: "Discover premium cosmetics and skincare products at Beauty Station.",
};
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product =
    allProducts.filter((p) => p.id === parseInt(id))[0] || allProducts[0];
  return (
    <>
      <BreadCrumb isFullWidth product={product} />
      <DetailsAccessories2 product={product} />
      <BoughtTogether6 />
      <BottomStickyProduct />
      <Footer4 />
    </>
  );
}
