import Footer2 from "@/components/footers/Footer2";
import Header16 from "@/components/headers/Header16";
import Banner from "@/components/homes/home-mobile-phone/Banner";
import BatteryFeature from "@/components/homes/home-mobile-phone/BatteryFeature";
import Features from "@/components/homes/home-mobile-phone/Features";
import FeaturesView from "@/components/homes/home-mobile-phone/FeaturesView";
import Hero from "@/components/homes/home-mobile-phone/Hero";
import Testimonials from "@/components/homes/home-mobile-phone/Testimonials";

import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Home Mobile Phone | Beauty Station | Cosmetics & Skincare",
  description: "Discover premium cosmetics and skincare products at Beauty Station.",
};
export default function page() {
  return (
    <>
      <Header16 sticky={true} />
      <Hero />

      <FeaturesView />
      <Features />
      <BatteryFeature />
      <Banner />
      <Testimonials />
      <Footer2 />
    </>
  );
}
