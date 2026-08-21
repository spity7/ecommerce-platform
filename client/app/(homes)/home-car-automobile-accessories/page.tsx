import TextSlider from "@/components/common/other-components/TextSlider";
import Footer7 from "@/components/footers/Footer7";
import Header12 from "@/components/headers/Header12";
import Brands from "@/components/homes/home-car-automobile-accessories/Brands";
import Categories from "@/components/homes/home-car-automobile-accessories/Categories";
import Hero from "@/components/homes/home-car-automobile-accessories/Hero";
import Products1 from "@/components/homes/home-car-automobile-accessories/Products1";
import Testimonials from "@/components/homes/home-car-automobile-accessories/Testimonials";

import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Home Car Automobile Accessories | Beauty Station | Cosmetics & Skincare",
  description:
    "Discover premium cosmetics and skincare products at Beauty Station.",
};
export default function page() {
  return (
    <>
      <Header12 sticky={true} />
      <Hero />
      <TextSlider parentClass="rbt-component-area rbt-categories-scroll-area rbt-bg-color-white" />
      <Categories />
      <Products1 />
      <Brands />
      <Testimonials />
      <Footer7 />
    </>
  );
}
