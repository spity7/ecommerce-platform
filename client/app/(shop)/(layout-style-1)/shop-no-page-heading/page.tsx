import Breadcrumb from "@/components/products/Breadcrumb";
import ShopDefault from "@/components/products/ShopDefault";

import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Shop No Page Heading | Beauty Station | Cosmetics & Skincare",
  description: "Discover premium cosmetics and skincare products at Beauty Station.",
};

const pageTitle = "Shop No Page Heading";

export default function page() {
  return (
    <>
      <Breadcrumb title={pageTitle} />
      <ShopDefault />
    </>
  );
}
