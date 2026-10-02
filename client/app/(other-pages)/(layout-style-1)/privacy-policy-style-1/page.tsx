import BreadcrumbInner from "@/components/common/other-components/BreadcrumbInner";
import PrivacyPolicy from "@/components/other-pages/privacy/PrivacyPolicy";
import Socials from "@/components/other-pages/privacy/Socials";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy (Style 1) | Theme Demo",
  description: "Demo privacy policy layout with Header2 chrome.",
};

export default function PrivacyPolicyStyleOneDemoPage() {
  return (
    <>
      <BreadcrumbInner title="Privacy Policy" />
      <PrivacyPolicy />
      <Socials />
    </>
  );
}
