import Footer10 from "@/components/footers/Footer10";
import BottomStickyProduct from "@/components/product-details/others/BottomStickyProduct";
import { allProducts } from "@/data/products";

import DetailsGrid from "@/components/product-details/details/DetailsGrid";
import BreadCrumb from "@/components/product-details/BreadCrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Product Single Grid | Beauty Station | Cosmetics & Skincare",
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
      <DetailsGrid product={product} />

      <BottomStickyProduct />
      <Footer10 />
    </>
  );
}
