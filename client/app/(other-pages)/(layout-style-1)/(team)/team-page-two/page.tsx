import IntroVideo from "@/components/other-pages/team/IntroVideo";
import Team2 from "@/components/other-pages/team/Team2";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Team Page 02 | Beauty Station | Cosmetics & Skincare",
  description:
    "Second team page layout highlighting Beauty Station team members.",
};

export default function page() {
  return (
    <>
      <Team2 />
      <IntroVideo />
    </>
  );
}
