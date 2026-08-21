import Footer2 from "@/components/footers/Footer2";
import Header6 from "@/components/headers/Header6";
import Categories from "@/components/homes/home-sneakers/Categories";
import Collections from "@/components/homes/home-sneakers/Collections";
import Hero from "@/components/homes/home-sneakers/Hero";
import InstagramPosts from "@/components/homes/home-sneakers/InstagramPosts";
import Products1 from "@/components/homes/home-sneakers/Products1";
import Testimonials from "@/components/homes/home-sneakers/Testimonials";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home Sneakers | Beauty Station | Cosmetics & Skincare",
  description:
    "Discover premium cosmetics and skincare products at Beauty Station.",
};
export default function page() {
  return (
    <>
      <Header6 sticky={true} />
      <Hero />
      <Categories />
      <Products1 />
      <Collections />
      <Testimonials />
      <InstagramPosts />
      <Footer2 />
    </>
  );
}
