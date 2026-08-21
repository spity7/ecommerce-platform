import Terms from "@/components/other-pages/privacy/Terms";
import Socials from "@/components/other-pages/privacy/Socials";
import BreadcrumbInner from "@/components/common/other-components/BreadcrumbInner";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Policy | Beauty Station | Cosmetics & Skincare",
  description:
    "Read the terms and policies for using the Beauty Station store.",
};

export default function page() {
  return (
    <>
      <BreadcrumbInner title="Terms & Policy" />
      <Terms />
      <Socials />
    </>
  );
}
