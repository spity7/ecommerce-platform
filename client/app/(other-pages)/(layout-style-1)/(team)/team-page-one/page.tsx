import Breadcrumb from "@/components/common/other-components/Breadcrumb";
import About from "@/components/other-pages/team/About";
import IntroVideo from "@/components/other-pages/team/IntroVideo";
import Team1 from "@/components/other-pages/team/Team1";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Team Page 01 | Beauty Station | Cosmetics & Skincare",
  description: "Meet the Beauty Station team with our first team page layout.",
};

export default function page() {
  return (
    <>
      <Breadcrumb subtitle="Pages" title="Team" />
      <About />
      <Team1 />
      <IntroVideo />
    </>
  );
}
