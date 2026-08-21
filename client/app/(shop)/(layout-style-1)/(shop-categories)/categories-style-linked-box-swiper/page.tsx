import CategoryBreadcrumb from "@/components/other-pages/categories/CategoryBreadcrumb";
import CategoryLinkedBoxSwiper from "@/components/other-pages/categories/CategoryLinkedBoxSwiper";

import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Categories Style Linked Box Swiper | Beauty Station | Cosmetics & Skincare",
  description:
    "Discover premium cosmetics and skincare products at Beauty Station.",
};

export default function Page() {
  return (
    <>
      <CategoryBreadcrumb
        title="Categories Style"
        highlighted="Linked Box Swiper"
      />
      <div className="rbt-separator-mid">
        <div className="container">
          <hr className="rbt-separator m-0" />
        </div>
      </div>
      <CategoryLinkedBoxSwiper />
    </>
  );
}
