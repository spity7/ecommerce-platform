import Contact from "@/components/other-pages/faq/Contact";
import Faqs from "@/components/other-pages/faq/Faqs";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ Page 01 | Beauty Station | Cosmetics & Skincare",
  description:
    "Frequently asked questions and contact information for Beauty Station.",
};

export default function page() {
  return (
    <>
      <Faqs />
      <Contact />
    </>
  );
}
