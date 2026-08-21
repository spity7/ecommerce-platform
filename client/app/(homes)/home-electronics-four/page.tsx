import Footer1 from "@/components/footers/Footer1";
import Header8 from "@/components/headers/Header8";
import Banner from "@/components/homes/home-electronics-four/Banner";
import Brands3 from "@/components/homes/home-electronics-four/Brands3";
import Categories from "@/components/homes/home-electronics-four/Categories";
import Hero from "@/components/homes/home-electronics-four/Hero";
import Products1 from "@/components/homes/home-electronics-four/Products1";
import Testimonials from "@/components/homes/home-electronics-four/Testimonials";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home Electronics 04 | Beauty Station | Cosmetics & Skincare",
  description:
    "Discover premium cosmetics and skincare products at Beauty Station.",
};
export default function page() {
  return (
    <>
      <Header8 sticky={true} />
      <Hero />
      <Categories />
      <Products1 />
      <Banner />
      <Testimonials />
      <Brands3 />
      <Footer1 />
    </>
  );
}
