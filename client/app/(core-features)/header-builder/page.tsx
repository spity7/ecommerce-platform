import { Metadata } from "next";
import HeaderBuilderBanner from "@/components/core-features/header-builder/HeaderBuilderBanner";
import HeaderImageArea from "@/components/core-features/header-builder/HeaderImageArea";
import HeaderComponents1 from "@/components/core-features/header-builder/HeaderComponents1";
import HeaderComponents2 from "@/components/core-features/header-builder/HeaderComponents2";
import HeaderComponents3 from "@/components/core-features/header-builder/HeaderComponents3";
import HeaderComponents4 from "@/components/core-features/header-builder/HeaderComponents4";
import HeaderComponents5 from "@/components/core-features/header-builder/HeaderComponents5";
export const metadata: Metadata = {
  title:
    "Header Builder | Discover premium cosmetics and skincare products at Beauty Station.",
  description:
    "Discover premium cosmetics and skincare products at Beauty Station.",
};
export default function HeaderBuilderPage() {
  return (
    <>
      <HeaderBuilderBanner />

      <HeaderImageArea />
      <HeaderComponents1 />
      <HeaderComponents2 />
      <HeaderComponents3 />
      <HeaderComponents4 />
      <HeaderComponents5 />
    </>
  );
}
