import SplashElementBuilderSection from "@/components/splash/SplashElementBuilderSection";
import { Metadata } from "next";
import OfferManagementBanner from "@/components/core-features/offer-management/OfferManagementBanner";
export const metadata: Metadata = {
  title:
    "Offer Management | Discover premium cosmetics and skincare products at Beauty Station.",
  description:
    "Discover premium cosmetics and skincare products at Beauty Station.",
};
export default function OfferManagementPage() {
  return (
    <>
      <OfferManagementBanner />
      <SplashElementBuilderSection
        sectionTitle="Offers Management: Maximize Deals & Discounts"
        cards={[
          {
            number: "01",
            title: (
              <>
                Offers Management: <br />
                Maximize Deals &amp; <br />
                Discounts
              </>
            ),
            description: (
              <>
                Compare your selected products in a table with Beauty Station
                Compare Table Builder. Choose from a variety of pre-built
                templates.
              </>
            ),
          },
        ]}
      />
    </>
  );
}
