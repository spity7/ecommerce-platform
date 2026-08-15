import BrandList from "@/components/other-pages/brands/BrandList";
import Breadcrumb from "@/components/common/other-components/Breadcrumb";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Brand List | Beauty Station | Cosmetics & Skincare",
  description: "Browse all brands available in the Beauty Station store.",
};

export default function BrandListPage() {
  return (
    <>
      <Breadcrumb
        className="rbt-breadcrumb-two rbt-bg-color-gray-light"
        subtitle=""
        hasHrLine
        title="Brand List"
      />
      <BrandList />
    </>
  );
}
