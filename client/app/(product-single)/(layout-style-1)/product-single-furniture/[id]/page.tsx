import BottomStickyProduct from "@/components/product-details/others/BottomStickyProduct";
import { allProducts } from "@/data/products";

import DetailsFurniture from "@/components/product-details/details/DetailsFurniture";
import Description3 from "@/components/product-details/descriptions/Description3";
import SimmilerProducts3 from "@/components/product-details/others/SimmilerProducts3";
import Footer4 from "@/components/footers/Footer4";
import BreadCrumb from "@/components/product-details/BreadCrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product Single Furniture | Beauty Station | Cosmetics & Skincare",
  description:
    "Discover premium cosmetics and skincare products at Beauty Station.",
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
      <DetailsFurniture product={product} />
      <Description3 />
      <SimmilerProducts3 />
      <BottomStickyProduct />

      <Footer4 />
    </>
  );
}
