import Banner from "@/components/products/Banner";
import Breadcrumb from "@/components/products/Breadcrumb";
import Categories from "@/components/products/Categories";
import ShopDefault from "@/components/products/ShopDefault";
import { beautyProductsCarousel } from "@/data/products/beauty";

import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Button On Image Products Shop | Beauty Station | Cosmetics & Skincare",
  description: "Discover premium cosmetics and skincare products at Beauty Station.",
};

export default function page() {
  return (
    <>
      <Breadcrumb title="Button On Image Products" />
      <Banner />
      <Categories />

      <div className="rbt-component-area ptb--32 ptb_sm--12">
        <div className="container">
          <div className="rbt-separator rbt-separator-gray200" />
        </div>
      </div>

      <ShopDefault
        products={beautyProductsCarousel}
        cardVariant="button-on-image"
      />
    </>
  );
}
