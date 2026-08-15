import Features3 from "@/components/common/features/Features3";
import Footer10 from "@/components/footers/Footer10";
import Header3 from "@/components/headers/Header3";
import Banner from "@/components/homes/home-hoodie-stores-two/Banner";
import Hero from "@/components/homes/home-hoodie-stores-two/Hero";
import InstagramPosts from "@/components/homes/home-hoodie-stores-two/InstagramPosts";
import Products1 from "@/components/homes/home-hoodie-stores-two/Products1";

import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Home Hoodie Stores 02 | Beauty Station | Cosmetics & Skincare",
  description: "Discover premium cosmetics and skincare products at Beauty Station.",
};
export default function page() {
  return (
    <>
      <Header3 showFeatures={false} sticky={true} />
      <Hero />
      <Products1 />
      <Banner />
      <Features3 parentClass="rbt-component-area rbt-quick-inf-area rbt-bg-color-white rbt-section-gap" />
      <InstagramPosts />
      <Footer10 />
    </>
  );
}
