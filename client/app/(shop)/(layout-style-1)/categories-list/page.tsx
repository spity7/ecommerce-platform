import Breadcrumb from "@/components/common/other-components/Breadcrumb";
import Categories3 from "@/components/products/Categories3";

import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Categories List | Beauty Station | Cosmetics & Skincare",
  description: "Discover premium cosmetics and skincare products at Beauty Station.",
};

export default function CategoriesListPage() {
  return (
    <>
      <Breadcrumb
        className="rbt-breadcrumb-two rbt-bg-color-gray-light"
        subtitle=""
        hasHrLine
        title="Categories List"
      />
      <Categories3 />
    </>
  );
}
