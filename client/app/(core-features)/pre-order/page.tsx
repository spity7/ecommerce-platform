import { Metadata } from "next";
import SplashElementBuilderSection from "@/components/splash/SplashElementBuilderSection";
import PreOrderBanner from "@/components/core-features/pre-order/PreOrderBanner";
export const metadata: Metadata = {
  title: "Pre Order | Discover premium cosmetics and skincare products at Beauty Station.",
  description: "Discover premium cosmetics and skincare products at Beauty Station.",
};
export default function PreOrderPage() {
  return (
    <>
      <PreOrderBanner />

      <SplashElementBuilderSection
        sectionTitle="Secure Your Purchase in Advance"
        cards={[
          {
            number: "01",
            title: (
              <>
                Pre-Order: Secure Your <br />
                Purchase in Advance
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
