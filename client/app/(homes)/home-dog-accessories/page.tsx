import Footer6 from "@/components/footers/Footer6";
import Header15 from "@/components/headers/Header15";
import Categories from "@/components/homes/home-dog-accessories/Categories";
import Hero from "@/components/homes/home-dog-accessories/Hero";
import Products1 from "@/components/homes/home-dog-accessories/Products1";
import Testimonials from "@/components/homes/home-dog-accessories/Testimonials";
import VideosSection from "@/components/homes/home-dog-accessories/VideosSection";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home Dog Accessories | Beauty Station | Cosmetics & Skincare",
  description:
    "Discover premium cosmetics and skincare products at Beauty Station.",
};
export default function page() {
  return (
    <>
      <Header15 containerClass="rbt-full-width-wrapper" sticky={true} />
      <Hero />
      <Categories />
      <VideosSection />
      <Products1 />
      <Testimonials />
      <Footer6 />
    </>
  );
}
