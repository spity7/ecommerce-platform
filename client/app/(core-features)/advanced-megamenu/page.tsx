import { Metadata } from "next";
import MegaMenuBanner from "@/components/core-features/advanced-megamenu/MegaMenuBanner";
import MegaMenuPresentation from "@/components/core-features/advanced-megamenu/MegaMenuPresentation";
import MegaMenuComponents from "@/components/core-features/advanced-megamenu/MegaMenuComponents";
export const metadata: Metadata = {
  title:
    "Advanced Megamenu | Discover premium cosmetics and skincare products at Beauty Station.",
  description:
    "Discover premium cosmetics and skincare products at Beauty Station.",
};
export default function AdvancedMegamenuPage() {
  return (
    <>
      <MegaMenuBanner />
      <MegaMenuPresentation />
      <MegaMenuComponents />
    </>
  );
}
