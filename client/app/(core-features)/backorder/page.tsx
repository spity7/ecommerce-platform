import SplashElementBuilderSection from "@/components/splash/SplashElementBuilderSection";
import { Metadata } from "next";
import BackorderBanner from "@/components/core-features/backorder/BackorderBanner";
export const metadata: Metadata = {
  title:
    "Backorder | Discover premium cosmetics and skincare products at Beauty Station.",
  description:
    "Discover premium cosmetics and skincare products at Beauty Station.",
};
export default function BackorderPage() {
  return (
    <>
      <BackorderBanner />

      <SplashElementBuilderSection
        sectionTitle="Flash Sell Management"
        cards={[
          {
            number: "01",
            title: (
              <>
                Manage Your Flash Sell <br />
                with Flash Sell <br />
                Management
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
