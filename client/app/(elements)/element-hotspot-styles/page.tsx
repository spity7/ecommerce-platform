import { Metadata } from "next";
import HotspotStyleOne from "@/components/elements/element-hotspot-styles/HotspotStyleOne";
import HotspotStyleTwo from "@/components/elements/element-hotspot-styles/HotspotStyleTwo";
import HotspotStyleThree from "@/components/elements/element-hotspot-styles/HotspotStyleThree";
import HotspotStyleFour from "@/components/elements/element-hotspot-styles/HotspotStyleFour";
import HotspotStyleFive from "@/components/elements/element-hotspot-styles/HotspotStyleFive";
import ElementsHero from "@/components/elements/ElementsHero";
export const metadata: Metadata = {
  title:
    "Element Hotspot Styles | Discover premium cosmetics and skincare products at Beauty Station.",
  description:
    "Discover premium cosmetics and skincare products at Beauty Station.",
};
export default function ElementHotspotStylesPage() {
  return (
    <>
      <>
        <ElementsHero
          title={
            <>
              Exclusive <span>Hotspot Styles</span>
            </>
          }
        />
        <HotspotStyleOne />
        <HotspotStyleTwo />
        <HotspotStyleThree />
        <HotspotStyleFour />
        <HotspotStyleFive />
      </>
    </>
  );
}
