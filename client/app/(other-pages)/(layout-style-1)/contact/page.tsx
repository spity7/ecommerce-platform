import Breadcrumb from "@/components/other-pages/Breadcrumb";
import Contact from "@/components/other-pages/contact/Contact";
import ContactMap from "@/components/other-pages/contact/ContactMap";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Beauty Station | Cosmetics & Skincare",
  description: "Get in touch with the Beauty Station team via our contact page.",
};

export default function page() {
  return (
    <>
      <Breadcrumb />
      <Contact />
      <ContactMap />
    </>
  );
}
