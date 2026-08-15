import Wishlist from "@/components/store/Wishlist";
import Breadcrumb from "@/components/common/other-components/Breadcrumb";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wishlist | Beauty Station | Cosmetics & Skincare",
  description: "Discover premium cosmetics and skincare products at Beauty Station.",
};
export default function page() {
  return (
    <>
      <Breadcrumb title="Wishlist" subtitle="Products" />
      <Wishlist />
    </>
  );
}
