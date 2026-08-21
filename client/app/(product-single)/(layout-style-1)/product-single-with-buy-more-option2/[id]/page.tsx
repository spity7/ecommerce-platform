import Footer10 from "@/components/footers/Footer10";
import BottomStickyProduct from "@/components/product-details/others/BottomStickyProduct";
import BoughtTogether from "@/components/product-details/others/BoughtTogether";
import CompareSimilerItems from "@/components/product-details/compares/CompareSimilerItems";
import VideoReview from "@/components/product-details/others/VideoReview";
import { allProducts } from "@/data/products";
import SimilerProducts from "@/components/product-details/others/SimilerProducts";
import DetailsBuyMoreOptions2 from "@/components/product-details/details/DetailsBuyMoreOptions2";
import { apparelCompareProducts } from "@/data/products/others";
import BreadCrumb from "@/components/product-details/BreadCrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Product Single Buy More Option 02 | Beauty Station | Cosmetics & Skincare",
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
      <DetailsBuyMoreOptions2 product={product} />
      <VideoReview />
      <CompareSimilerItems products={apparelCompareProducts} />
      <SimilerProducts />
      <BoughtTogether />
      <BottomStickyProduct />
      <Footer10 />
    </>
  );
}
