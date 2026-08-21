import BottomStickyProduct from "@/components/product-details/others/BottomStickyProduct";
import { allProducts } from "@/data/products";
import DetailsSportsShoe from "@/components/product-details/details/DetailsSportsShoe";
import BoughtTogether5 from "@/components/product-details/others/BoughtTogether5";
import Footer10 from "@/components/footers/Footer10";
import BreadCrumb from "@/components/product-details/BreadCrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product Single Sports Shoe | Beauty Station | Cosmetics & Skincare",
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
      <DetailsSportsShoe product={product} />
      <BoughtTogether5 />
      <BottomStickyProduct />
      <Footer10 />
    </>
  );
}
