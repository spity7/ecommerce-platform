import Footer2 from "@/components/footers/Footer2";
import Header13 from "@/components/headers/Header13";
import Blogs from "@/components/homes/home-tea-stores/Blogs";
import Categories from "@/components/homes/home-tea-stores/Categories";
import Hero from "@/components/homes/home-tea-stores/Hero";
import LeafsCategories from "@/components/homes/home-tea-stores/LeafsCategories";
import Products1 from "@/components/homes/home-tea-stores/Products1";
import Testimonials from "@/components/homes/home-tea-stores/Testimonials";

import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Home Tea Stores | Beauty Station | Cosmetics & Skincare",
  description: "Discover premium cosmetics and skincare products at Beauty Station.",
};
export default function page() {
  return (
    <>
      <Header13 sticky={true} />
      <Hero />
      <LeafsCategories />
      <Categories />
      <Products1 />
      <Testimonials />
      <Blogs />
      <Footer2 />
    </>
  );
}
