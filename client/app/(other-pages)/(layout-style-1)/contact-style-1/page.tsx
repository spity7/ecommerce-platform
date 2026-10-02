import Breadcrumb from "@/components/other-pages/Breadcrumb";
import Contact from "@/components/other-pages/contact/Contact";
import ContactMap from "@/components/other-pages/contact/ContactMap";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us (Style 1) | Theme Demo",
  description: "Demo contact layout with Header2 chrome.",
};

export default function ContactStyleOneDemoPage() {
  return (
    <>
      <Breadcrumb />
      <Contact />
      <ContactMap />
    </>
  );
}
