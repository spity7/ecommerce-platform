import { Metadata } from "next";
import MiniImageGallary from "@/components/elements/element-image-gallary/MiniImageGallary";
import MediumImageGallary from "@/components/elements/element-image-gallary/MediumImageGallary";
import StandardImageGallary from "@/components/elements/element-image-gallary/StandardImageGallary";
import BentoGridImageGallary from "@/components/elements/element-image-gallary/BentoGridImageGallary";
import ElementsHero from "@/components/elements/ElementsHero";
export const metadata: Metadata = {
  title:
    "Element Image Gallary | Discover premium cosmetics and skincare products at Beauty Station.",
  description: "Discover premium cosmetics and skincare products at Beauty Station.",
};
export default function ElementImageGallaryPage() {
  return (
    <>
      <>
        <ElementsHero
          title={
            <>
              Exclusive <span>Image Gallary</span>
            </>
          }
        />
        <MiniImageGallary />

        <div className="rbt-separator-mid">
          <div className="container">
            <hr className="rbt-separator m-0" />
          </div>
        </div>
        <MediumImageGallary />
        <div className="rbt-separator-mid">
          <div className="container">
            <hr className="rbt-separator m-0" />
          </div>
        </div>
        <StandardImageGallary />
        <div className="rbt-separator-mid">
          <div className="container">
            <hr className="rbt-separator m-0" />
          </div>
        </div>
        <BentoGridImageGallary />
      </>
    </>
  );
}
