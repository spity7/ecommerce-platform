import Banner from "@/components/products/Banner";
import Breadcrumb from "@/components/products/Breadcrumb";
import Categories from "@/components/products/Categories";
import ShopFilterCollapse from "@/components/products/ShopFilterCollapse";

import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Shop Collapse Filter Top | Beauty Station | Cosmetics & Skincare",
  description: "Discover premium cosmetics and skincare products at Beauty Station.",
};

const pageTitle = "Shop Collapse Filter Top";

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
      <ShopFilterCollapse />
    </>
  );
}
