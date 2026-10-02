import PrivacyPolicy from "@/components/other-pages/privacy/PrivacyPolicy";
import Socials from "@/components/other-pages/privacy/Socials";
import Breadcrumb from "@/components/products/Breadcrumb";
import { getStorefrontSiteConfig } from "@/lib/site";
import type { Metadata } from "next";

const site = getStorefrontSiteConfig();

export const metadata: Metadata = {
  title: `Privacy Policy | ${site.seo.title}`,
  description: `How ${site.name} collects and uses your data.`,
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Breadcrumb title="Privacy Policy" />
      <PrivacyPolicy />
      <Socials />
    </>
  );
}
