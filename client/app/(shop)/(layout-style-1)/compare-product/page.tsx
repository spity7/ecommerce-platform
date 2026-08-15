import Breadcrumb from "@/components/common/other-components/Breadcrumb";

import CompareProducts4 from "@/components/product-details/compares/CompareProducts4";

import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Compare Product | Beauty Station | Cosmetics & Skincare",
  description: "Discover premium cosmetics and skincare products at Beauty Station.",
};

const pageTitle = "Compare Product";

export default function page() {
  return (
    <>
      <Breadcrumb title={pageTitle} subtitle="Shop" />
      <CompareProducts4 />
    </>
  );
}
