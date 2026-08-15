import Footer10 from "@/components/footers/Footer10";
import BottomStickyProduct from "@/components/product-details/others/BottomStickyProduct";
import CompareSimilerItems from "@/components/product-details/compares/CompareSimilerItems";
import VideoReview from "@/components/product-details/others/VideoReview";
import { allProducts } from "@/data/products";
import SimilerProducts from "@/components/product-details/others/SimilerProducts";
import DetailsGallery from "@/components/product-details/details/DetailsGallery";
import { apparelCompareProducts } from "@/data/products/others";
import BreadCrumb from "@/components/product-details/BreadCrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Product Single Gallery | Beauty Station | Cosmetics & Skincare",
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
      <DetailsGallery product={product} />
      <VideoReview />
      <CompareSimilerItems products={apparelCompareProducts} />
      <SimilerProducts />
      <BottomStickyProduct />
      <Footer10 />
    </>
  );
}
