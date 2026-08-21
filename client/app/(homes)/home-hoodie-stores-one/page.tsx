import Footer7 from "@/components/footers/Footer7";
import Header16 from "@/components/headers/Header16";
import Hero from "@/components/homes/home-hoodie-stores-one/Hero";
import Lookbook from "@/components/homes/home-hoodie-stores-one/Lookbook";
import Products1 from "@/components/homes/home-hoodie-stores-one/Products1";
import Testimonials from "@/components/homes/home-hoodie-stores-one/Testimonials";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home Hoodie Stores 01 | Beauty Station | Cosmetics & Skincare",
  description:
    "Discover premium cosmetics and skincare products at Beauty Station.",
};
export default function page() {
  return (
    <>
      <Header16 sticky={true} />
      <Hero />
      <Products1 />
      <Lookbook />
      <Testimonials />
      <Footer7 />
    </>
  );
}
