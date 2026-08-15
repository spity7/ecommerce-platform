import Breadcrumb from "@/components/common/other-components/Breadcrumb";
import Testimonials from "@/components/homes/home-phone-case/Testimonials";
import SimilerProducts from "@/components/product-details/others/SimilerProducts";
import Cart from "@/components/store/Cart";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Shopping Cart | Beauty Station | Cosmetics & Skincare",
  description: "Discover premium cosmetics and skincare products at Beauty Station.",
};

export default function page() {
  return (
    <>
      <Breadcrumb title="Shopping Cart" subtitle="Pages" />
      <Cart />
      <Testimonials />
      <SimilerProducts parentClass="rbt-component-area rbt-section-gap rbt-bg-color-gray-white" />
    </>
  );
}
