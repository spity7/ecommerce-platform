import Banner from "@/components/products/Banner";
import Breadcrumb from "@/components/products/Breadcrumb";
import Categories from "@/components/products/Categories";
import ShopDefault from "@/components/products/ShopDefault";
import { electronicsHoverVideoData2 } from "@/data/products/electronics";

import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Standard Products Shop | Beauty Station | Cosmetics & Skincare",
  description: "Discover premium cosmetics and skincare products at Beauty Station.",
};

export default function page() {
  return (
    <>
      <Breadcrumb title="Standard Products" />
      <Banner />
      <Categories />

      <div className="rbt-component-area ptb--32 ptb_sm--12">
        <div className="container">
          <div className="rbt-separator rbt-separator-gray200" />
        </div>
      </div>

      <ShopDefault
        products={electronicsHoverVideoData2}
        cardVariant="standard"
      />
    </>
  );
}
