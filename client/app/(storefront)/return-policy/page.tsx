import Socials from "@/components/other-pages/privacy/Socials";
import Breadcrumb from "@/components/products/Breadcrumb";
import ReturnPolicy from "@/components/store/ReturnPolicy";
import { getStorefrontSiteConfig } from "@/lib/site";
import type { Metadata } from "next";

const site = getStorefrontSiteConfig();

export const metadata: Metadata = {
  title: `Return Policy | ${site.seo.title}`,
  description: `Returns and refunds policy for ${site.name}.`,
};

export default function ReturnPolicyPage() {
  return (
    <>
      <Breadcrumb title="Return Policy" />
      <ReturnPolicy />
      <Socials />
    </>
  );
}
