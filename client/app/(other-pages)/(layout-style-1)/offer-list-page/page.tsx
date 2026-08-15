import Breadcrumb from "@/components/common/other-components/Breadcrumb";
import OfferList from "@/components/other-pages/OfferList";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Offer List | Beauty Station | Cosmetics & Skincare",
  description: "Offer list page layout for Beauty Station.",
};

export default function page() {
  return (
    <>
      <Breadcrumb
        className="rbt-breadcrumb-two rbt-bg-color-gray-light"
        subtitle=""
        hasHrLine
        title="Offer List"
      />
      <OfferList />
    </>
  );
}
