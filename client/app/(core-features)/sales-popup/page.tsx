import SplashElementBuilderSection from "@/components/splash/SplashElementBuilderSection";
import { Metadata } from "next";
import SalesPopupBanner from "@/components/core-features/sales-popup/SalesPopupBanner";
export const metadata: Metadata = {
  title:
    "Sales Popup | Discover premium cosmetics and skincare products at Beauty Station.",
  description:
    "Discover premium cosmetics and skincare products at Beauty Station.",
};
export default function SalesPopupPage() {
  return (
    <>
      <SalesPopupBanner />

      <SplashElementBuilderSection
        sectionTitle="Grab Attention with Limited-Time Offers"
        sectionDescription={
          <>
            Explore our collection of pre-built compare tables designed to help
            you showcase <br />
            product features effectively. Customize each table to fit your
            specific needs.
          </>
        }
        cards={[
          {
            number: "01",
            title: (
              <>
                Sales Popup: Grab <br />
                Attention with Limited- <br />
                Time Offers
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
