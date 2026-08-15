import SplashElementBuilderSection from "@/components/splash/SplashElementBuilderSection";
import { Metadata } from "next";
import MultiStepCheckoutBanner from "@/components/core-features/multi-step-checkout/MultiStepCheckoutBanner";
export const metadata: Metadata = {
  title:
    "Multi Step Checkout | Discover premium cosmetics and skincare products at Beauty Station.",
  description: "Discover premium cosmetics and skincare products at Beauty Station.",
};
export default function MultiStepCheckoutPage() {
  return (
    <>
      <MultiStepCheckoutBanner />
      <SplashElementBuilderSection
        sectionTitle="Multi-Step Checkout"
        cards={[
          {
            number: "01",
            title: (
              <>
                Multi-Step Checkout: <br />
                Streamlined &amp; User- <br />
                Friendly
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
