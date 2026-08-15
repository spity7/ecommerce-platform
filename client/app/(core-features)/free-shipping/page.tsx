import SplashElementBuilderSection from "@/components/splash/SplashElementBuilderSection";
import { Metadata } from "next";
import FreeShippingBanner from "@/components/core-features/free-shipping/FreeShippingBanner";
export const metadata: Metadata = {
  title: "Free Shipping | Discover premium cosmetics and skincare products at Beauty Station.",
  description: "Discover premium cosmetics and skincare products at Beauty Station.",
};
export default function FreeShippingPage() {
  return (
    <>
      <FreeShippingBanner />
      <SplashElementBuilderSection
        sectionTitle="Free Shipping Threshold"
        cards={[
          {
            number: "01",
            title: (
              <>
                Manage Your Free <br />
                Shipping with Free <br />
                Shipping Threshold
              </>
            ),
            description: (
              <>
                Compare your selected products in a table with Beauty Station Compare
                Table Builder. Choose from a variety of pre-built templates.
              </>
            ),
          },
        ]}
      />
    </>
  );
}
