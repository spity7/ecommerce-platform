import Contact from "@/components/other-pages/contact/Contact";
import ContactMap from "@/components/other-pages/contact/ContactMap";
import Breadcrumb from "@/components/products/Breadcrumb";
import { StorefrontChrome } from "@/components/site/StorefrontChrome";
import { getStorefrontSiteConfig } from "@/lib/site";
import type { Metadata } from "next";

const site = getStorefrontSiteConfig();

export const metadata: Metadata = {
  title: `Contact | ${site.seo.title}`,
  description: `Contact ${site.name} — ${site.tagline}.`,
};

export default function ContactPage() {
  return (
    <StorefrontChrome headerTransparent={false}>
      <Breadcrumb title="Contact" />
      <Contact />
      <ContactMap />
    </StorefrontChrome>
  );
}
