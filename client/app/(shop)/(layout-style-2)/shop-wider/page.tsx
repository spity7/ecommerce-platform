import Banner from "@/components/products/Banner";
import Breadcrumb from "@/components/products/Breadcrumb";
import CategoriesWider from "@/components/products/CategoriesWider";
import ShopDefault from "@/components/products/ShopDefault";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop Wider Three | Beauty Station | Cosmetics & Skincare",
  description:
    "Discover premium cosmetics and skincare products at Beauty Station.",
};

const pageTitle = "Shop Wider Three";

export default function page() {
  return (
    <>
      <Breadcrumb containerFull title={pageTitle} />
      <Banner containerFull />
      <CategoriesWider />
      <div className="rbt-component-area ptb--32 ptb_sm--12">
        <div className="rbt-full-width-wrapper">
          <div className="rbt-separator rbt-separator-gray200"></div>
        </div>
      </div>
      <ShopDefault containerFull wider column={3} />
    </>
  );
}
