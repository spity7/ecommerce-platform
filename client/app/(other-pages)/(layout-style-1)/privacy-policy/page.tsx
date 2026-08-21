import BreadcrumbInner from "@/components/common/other-components/BreadcrumbInner";
import PrivacyPolicy from "@/components/other-pages/privacy/PrivacyPolicy";
import Socials from "@/components/other-pages/privacy/Socials";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Beauty Station | Cosmetics & Skincare",
  description: "Understand how Beauty Station collects and uses your data.",
};

export default function page() {
  return (
    <>
      <BreadcrumbInner title="Privacy Policy" />
      <PrivacyPolicy />
      <Socials />
    </>
  );
}
