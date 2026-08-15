import { Metadata } from "next";
import BoostFeaturesBanner from "@/components/core-features/boost-features/BoostFeaturesBanner";
import BoostFeaturesComponents from "@/components/core-features/boost-features/BoostFeaturesComponents";
export const metadata: Metadata = {
  title:
    "Boost Features | Discover premium cosmetics and skincare products at Beauty Station.",
  description: "Discover premium cosmetics and skincare products at Beauty Station.",
};
export default function BoostFeaturesPage() {
  return (
    <>
      <BoostFeaturesBanner />
      <BoostFeaturesComponents />
    </>
  );
}
