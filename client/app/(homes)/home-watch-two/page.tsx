import Footer2 from "@/components/footers/Footer2";
import Header6 from "@/components/headers/Header6";
import Brands from "@/components/common/other-components/Brands2";
import Collections from "@/components/homes/home-watch-two/Collections";
import Hero from "@/components/homes/home-watch-two/Hero";
import Products1 from "@/components/homes/home-watch-two/Products1";
import Testimonials from "@/components/homes/home-watch-two/Testimonials";
import VideoBanner from "@/components/homes/home-watch-two/VideoBanner";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home Watch 02 | Beauty Station | Cosmetics & Skincare",
  description:
    "Discover premium cosmetics and skincare products at Beauty Station.",
};
export default function page() {
  return (
    <>
      <Header6 sticky={true} />
      <Hero />
      <Products1 />
      <VideoBanner />
      <Collections />
      <Testimonials />
      <Brands />
      <Footer2 />
    </>
  );
}
