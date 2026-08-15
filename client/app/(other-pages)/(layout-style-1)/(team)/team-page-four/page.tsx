import Contact from "@/components/other-pages/team/Contact";
import Team4 from "@/components/other-pages/team/Team4";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Team Page 04 | Beauty Station | Cosmetics & Skincare",
  description: "Fourth team page layout with team and contact section.",
};

export default function page() {
  return (
    <>
      <Team4 />
      <Contact />
    </>
  );
}
