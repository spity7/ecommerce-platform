import Terms from "@/components/other-pages/privacy/Terms";
import Socials from "@/components/other-pages/privacy/Socials";
import Breadcrumb from "@/components/products/Breadcrumb";
import { getStorefrontSiteConfig } from "@/lib/site";
import type { Metadata } from "next";

const site = getStorefrontSiteConfig();

export const metadata: Metadata = {
  title: `Terms & Conditions | ${site.seo.title}`,
  description: `Terms and conditions for shopping at ${site.name}.`,
};

export default function TermsPolicyPage() {
  return (
    <>
      <Breadcrumb title="Terms & Conditions" />
      <Terms />
      <Socials />
    </>
  );
}
