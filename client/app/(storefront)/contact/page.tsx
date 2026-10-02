import ContactMap from "@/components/other-pages/contact/ContactMap";
import ContactProduction from "@/components/other-pages/contact/ContactProduction";
import Breadcrumb from "@/components/products/Breadcrumb";
import { getStorefrontSiteConfig } from "@/lib/site";
import type { Metadata } from "next";

const site = getStorefrontSiteConfig();

export const metadata: Metadata = {
  title: `Contact | ${site.seo.title}`,
  description: `Contact ${site.name} — ${site.tagline}.`,
};

export default function ContactPage() {
  return (
    <>
      <Breadcrumb title="Contact" />
      <ContactProduction />
      <ContactMap />
    </>
  );
}
