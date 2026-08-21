import Footer2 from "@/components/footers/Footer2";
import Header16 from "@/components/headers/Header16";
import Categories from "@/components/homes/home-kids-cloth/Categories";
import Hero from "@/components/homes/home-kids-cloth/Hero";
import InstagramPosts from "@/components/homes/home-kids-cloth/InstagramPosts";
import Products1 from "@/components/homes/home-kids-cloth/Products1";
import Testimonials from "@/components/homes/home-kids-cloth/Testimonials";
import VideoBanner from "@/components/homes/home-kids-cloth/VideoBanner";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home Kids Cloth | Beauty Station | Cosmetics & Skincare",
  description:
    "Discover premium cosmetics and skincare products at Beauty Station.",
};
export default function page() {
  return (
    <>
      <Header16 sticky={true} />
      <Hero />
      <VideoBanner />
      <Categories />
      <Products1 />
      <Testimonials />
      <InstagramPosts />
      <Footer2 />
    </>
  );
}
