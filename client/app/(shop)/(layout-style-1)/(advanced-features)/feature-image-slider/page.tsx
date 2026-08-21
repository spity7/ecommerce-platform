import ElementsHero from "@/components/elements/ElementsHero";
import ImageCompare from "@/components/products/ImageCompare";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop Image Slider | Beauty Station | Cosmetics & Skincare",
  description:
    "Discover premium cosmetics and skincare products at Beauty Station.",
};

export default function page() {
  return (
    <>
      <ElementsHero
        title={
          <>
            Exclusive <span>Image Slider</span>
          </>
        }
      />
      <ImageCompare />
    </>
  );
}
