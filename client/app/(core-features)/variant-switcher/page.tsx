import { Metadata } from "next";
import VariantSwitcherBanner from "@/components/core-features/variant-switcher/VariantSwitcherBanner";
import VariantSwitcherComponents from "@/components/core-features/variant-switcher/VariantSwitcherComponents";
export const metadata: Metadata = {
  title:
    "Variant Switcher | Discover premium cosmetics and skincare products at Beauty Station.",
  description:
    "Discover premium cosmetics and skincare products at Beauty Station.",
};
export default function VariantSwitcherPage() {
  return (
    <>
      <VariantSwitcherBanner />
      <VariantSwitcherComponents />
    </>
  );
}
