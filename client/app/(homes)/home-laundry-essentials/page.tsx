import Footer12 from "@/components/footers/Footer12";
import Header15 from "@/components/headers/Header15";
import Categories from "@/components/homes/home-laundry-essentials/Categories";
import Collections from "@/components/homes/home-laundry-essentials/Collections";
import Hero from "@/components/homes/home-laundry-essentials/Hero";
import Products1 from "@/components/homes/home-laundry-essentials/Products1";
import Testimonials from "@/components/homes/home-laundry-essentials/Testimonials";

import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Home Laundry Essentials | Beauty Station | Cosmetics & Skincare",
  description: "Discover premium cosmetics and skincare products at Beauty Station.",
};
export default function page() {
  return (
    <>
      <Header15 sticky={true} />
      <Hero />
      <Categories />
      <Collections />
      <Products1 />
      <Testimonials />
      <Footer12 />
    </>
  );
}
