import BottomStickyProduct from "@/components/product-details/others/BottomStickyProduct";
import { allProducts } from "@/data/products";

import DetailsPetAccessories from "@/components/product-details/details/DetailsPetAccessories";
import BoughtTogether4 from "@/components/product-details/others/BoughtTogether4";
import Description4 from "@/components/product-details/descriptions/Description4";
import BreadCrumb from "@/components/product-details/BreadCrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Product Single Animal Accessories | Beauty Station | Cosmetics & Skincare",
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
      <BreadCrumb product={product} />
      <DetailsPetAccessories product={product} />
      <Description4 />
      <BoughtTogether4 />

      <BottomStickyProduct />
    </>
  );
}
