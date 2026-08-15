import Features3 from "@/components/common/features/Features3";
import Footer11 from "@/components/footers/Footer11";
import Header2 from "@/components/headers/Header2";
import Banner from "@/components/homes/home-electronics-two/Banner";
import Categories from "@/components/homes/home-electronics-two/Categories";
import Hero from "@/components/homes/home-electronics-two/Hero";
import Products1 from "@/components/homes/home-electronics-two/Products1";
import Testimonials from "@/components/homes/home-electronics-two/Testimonials";

import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Home Electronics 02 | Beauty Station | Cosmetics & Skincare",
  description: "Discover premium cosmetics and skincare products at Beauty Station.",
};
export default function page() {
  return (
    <>
      <Header2 sticky={true} />
      <Hero />
      <Categories />
      <Products1 />
      <Banner />
      <Testimonials />
      <Features3 parentClass="rbt-component-area rbt-quick-inf-area rbt-bg-color-white rbt-section-gap2" />
      <Footer11 discountSlider={true} />
    </>
  );
}
