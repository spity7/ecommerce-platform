import Features from "@/components/other-pages/about/Features";
import Facts from "@/components/other-pages/about/Facts";
import VideoSection from "@/components/other-pages/about/VideoSection";
import AboutUs from "@/components/other-pages/about/AboutUs";
import OurMission from "@/components/other-pages/about/OurMission";
import BreadcrumbInner from "@/components/common/other-components/BreadcrumbInner";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us 02 | Beauty Station | Cosmetics & Skincare",
  description: "Alternate about page layout for the Beauty Station store.",
};

export default function page() {
  return (
    <>
      <BreadcrumbInner title="About Us" />
      <AboutUs />
      <OurMission />
      <Features />
      <Facts />
      <VideoSection />
    </>
  );
}
