import Banner from "@/components/products/Banner";
import Breadcrumb from "@/components/products/Breadcrumb";
import Categories from "@/components/products/Categories";
import ShopDefault from "@/components/products/ShopDefault";

import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Shop Filter Grid Four | Beauty Station | Cosmetics & Skincare",
  description: "Discover premium cosmetics and skincare products at Beauty Station.",
};

const pageTitle = "Shop Filter Grid Four";

export default function page() {
  return (
    <>
      <Breadcrumb title={pageTitle} />
      <Banner />
      <Categories />
      <div className="rbt-component-area ptb--32 ptb_sm--12">
        <div className="container">
          <div className="rbt-separator rbt-separator-gray200" />
        </div>
      </div>
      <ShopDefault column={4} />
    </>
  );
}
