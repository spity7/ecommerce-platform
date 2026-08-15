import Features3 from "@/components/common/features/Features3";
import Footer1 from "@/components/footers/Footer1";
import Header6 from "@/components/headers/Header6";
import Blogs from "@/components/homes/home-jewellery/Blogs";
import Categories from "@/components/homes/home-jewellery/Categories";
import Collections from "@/components/homes/home-jewellery/Collections";
import Hero from "@/components/homes/home-jewellery/Hero";
import Products1 from "@/components/homes/home-jewellery/Products1";
import Products2 from "@/components/homes/home-jewellery/Products2";
import Products3 from "@/components/homes/home-jewellery/Products3";
import VideoBackground from "@/components/homes/home-jewellery/VideoBackground";

import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Home Jwellery 01 | Beauty Station | Cosmetics & Skincare",
  description: "Discover premium cosmetics and skincare products at Beauty Station.",
};
export default function page() {
  return (
    <>
      <Header6 sticky={true} />
      <Hero />
      <Categories />
      <Products1 />
      <Features3 parentClass="rbt-component-area rbt-quick-inf-area rbt-bg-color-white rbt-section-gap2 pb--0" />
      <Collections />
      <Products2 />
      <VideoBackground />
      <Products3 />
      <Blogs />
      <Footer1 />
    </>
  );
}
