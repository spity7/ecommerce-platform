import SplashElementBuilderSection from "@/components/splash/SplashElementBuilderSection";
import { Metadata } from "next";
import FlashSellManagementBanner from "@/components/core-features/flash-sell-management/FlashSellManagementBanner";
export const metadata: Metadata = {
  title:
    "Flash Sell Management | Discover premium cosmetics and skincare products at Beauty Station.",
  description:
    "Discover premium cosmetics and skincare products at Beauty Station.",
};
export default function FlashSellManagementPage() {
  return (
    <>
      <FlashSellManagementBanner />

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
