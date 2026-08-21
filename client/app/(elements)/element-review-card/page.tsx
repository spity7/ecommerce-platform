import { Metadata } from "next";
import ReviewCardOne from "@/components/elements/element-review-card/ReviewCardOne";
import ReviewCardTwo from "@/components/elements/element-review-card/ReviewCardTwo";
import ElementsHero from "@/components/elements/ElementsHero";
export const metadata: Metadata = {
  title:
    "Element Review Card | Discover premium cosmetics and skincare products at Beauty Station.",
  description:
    "Discover premium cosmetics and skincare products at Beauty Station.",
};
export default function ElementReviewCardPage() {
  return (
    <>
      <>
        <ElementsHero
          title={
            <>
              Exclusive <span>Review Card</span>
            </>
          }
        />
        <ReviewCardOne />
        <ReviewCardTwo />
      </>
    </>
  );
}
