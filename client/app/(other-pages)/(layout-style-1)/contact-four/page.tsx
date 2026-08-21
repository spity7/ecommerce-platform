import Contact3 from "@/components/other-pages/contact/Contact3";
import ContactMap from "@/components/other-pages/contact/ContactMap";
import Locations2 from "@/components/other-pages/contact/Locations2";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us 03 | Beauty Station | Cosmetics & Skincare",
  description:
    "Contact page variation with multiple Beauty Station locations and map.",
};

export default function page() {
  return (
    <>
      <ContactMap />
      <Locations2 />
      <Contact3 />
    </>
  );
}
