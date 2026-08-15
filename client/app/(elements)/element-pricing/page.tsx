import { Metadata } from "next";
import PricingStyleOne from "@/components/elements/element-pricing/PricingStyleOne";
import PricingStyleTwo from "@/components/elements/element-pricing/PricingStyleTwo";
import PricingStyleThree from "@/components/elements/element-pricing/PricingStyleThree";
import PricingStyleFour from "@/components/elements/element-pricing/PricingStyleFour";
import ElementsHero from "@/components/elements/ElementsHero";
export const metadata: Metadata = {
  title:
    "Element Pricing | Discover premium cosmetics and skincare products at Beauty Station.",
  description: "Discover premium cosmetics and skincare products at Beauty Station.",
};
export default function ElementPricingPage() {
  return (
    <>
      <>
        <ElementsHero
          title={
            <>
              Exclusive <span>Pricing</span>
            </>
          }
        />
        <PricingStyleOne />
        <PricingStyleTwo />
        <PricingStyleThree />
        <PricingStyleFour />
      </>
    </>
  );
}
