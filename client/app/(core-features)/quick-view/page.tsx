import SplashElementBuilderSection from "@/components/splash/SplashElementBuilderSection";
import { Metadata } from "next";
import QuickViewBanner from "@/components/core-features/quick-view/QuickViewBanner";
export const metadata: Metadata = {
  title: "Quick View | Discover premium cosmetics and skincare products at Beauty Station.",
  description: "Discover premium cosmetics and skincare products at Beauty Station.",
};
export default function QuickViewPage() {
  return (
    <>
      <QuickViewBanner />

      <SplashElementBuilderSection
        sectionTitle="Instant Product Preview"
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
                Quick View: Instant <br />
                Product Preview
              </>
            ),
            description: (
              <>
                Compare your selected products in a table with Beauty Station Compare
                Table Builder. Choose from a variety of pre-built templates and
                customize them to match your brand.
              </>
            ),
          },
        ]}
      />
    </>
  );
}
