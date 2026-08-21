import Footer5 from "@/components/footers/Footer5";
import Header15 from "@/components/headers/Header15";
import Banner from "@/components/homes/home-bedding-shop/Banner";
import Hero from "@/components/homes/home-bedding-shop/Hero";
import Lookbook from "@/components/homes/home-bedding-shop/Lookbook";
import Products1 from "@/components/homes/home-bedding-shop/Products1";
import Testimonials from "@/components/homes/home-bedding-shop/Testimonials";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home Bedding Shop | Beauty Station | Cosmetics & Skincare",
  description:
    "Discover premium cosmetics and skincare products at Beauty Station.",
};
export default function page() {
  return (
    <>
      <Header15 containerClass="rbt-full-width-wrapper" sticky={true} />
      <Hero />
      <Banner />
      <Products1 />
      <Lookbook />
      <Testimonials />
      <Footer5 />
    </>
  );
}
