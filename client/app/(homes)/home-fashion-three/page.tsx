import Footer7 from "@/components/footers/Footer7";
import Header15 from "@/components/headers/Header15";
import Banner from "@/components/homes/home-fashion-three/Banner";
import Categories from "@/components/homes/home-fashion-three/Categories";
import Hero from "@/components/homes/home-fashion-three/Hero";
import InstagramProducts from "@/components/homes/home-fashion-three/InstagramProducts";
import Products1 from "@/components/homes/home-fashion-three/Products1";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home Fashion 03 | Beauty Station | Cosmetics & Skincare",
  description:
    "Discover premium cosmetics and skincare products at Beauty Station.",
};
export default function page() {
  return (
    <>
      <Header15 containerClass="rbt-full-width-wrapper" sticky={true} />
      <Hero />
      <Categories />
      <Products1 />
      <Banner />
      <InstagramProducts />
      <Footer7 />
    </>
  );
}
