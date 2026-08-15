import { Metadata } from "next";
import PopupBuilderBanner from "@/components/core-features/popup-builder/PopupBuilderBanner";
import PopupComponents from "@/components/core-features/popup-builder/PopupComponents";
export const metadata: Metadata = {
  title: "Popup Builder | Discover premium cosmetics and skincare products at Beauty Station.",
  description: "Discover premium cosmetics and skincare products at Beauty Station.",
};
export default function PopupBuilderPage() {
  return (
    <>
      <PopupBuilderBanner />
      <PopupComponents />
    </>
  );
}
