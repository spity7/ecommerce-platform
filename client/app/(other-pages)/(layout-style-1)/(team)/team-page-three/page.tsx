import BreadcrumbInner from "@/components/common/other-components/BreadcrumbInner";
import Team3 from "@/components/other-pages/team/Team3";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Team Page 03 | Beauty Station | Cosmetics & Skincare",
  description: "Third team page layout showcasing Beauty Station staff.",
};

export default function page() {
  return (
    <>
      <BreadcrumbInner title="Team Page Three" />
      <Team3 />
    </>
  );
}
