import { Metadata } from "next";
import MiniListStyle from "@/components/elements/element-list-styles/MiniListStyle";
import MediumListStyle from "@/components/elements/element-list-styles/MediumListStyle";
import StandardListStyleOne from "@/components/elements/element-list-styles/StandardListStyleOne";
import StandardListStyleTwo from "@/components/elements/element-list-styles/StandardListStyleTwo";
import StandardListStyleThree from "@/components/elements/element-list-styles/StandardListStyleThree";
import StandardListStyleFour from "@/components/elements/element-list-styles/StandardListStyleFour";
import StandardListStyleFive from "@/components/elements/element-list-styles/StandardListStyleFive";
import ElementsHero from "@/components/elements/ElementsHero";
export const metadata: Metadata = {
  title:
    "Element List Styles | Discover premium cosmetics and skincare products at Beauty Station.",
  description:
    "Discover premium cosmetics and skincare products at Beauty Station.",
};
export default function ElementListStylesPage() {
  return (
    <>
      <>
        <ElementsHero
          title={
            <>
              Exclusive <span>List Styles</span>
            </>
          }
        />
        <MiniListStyle />
        <MediumListStyle />
        <StandardListStyleOne />
        <StandardListStyleTwo />
        <StandardListStyleThree />
        <StandardListStyleFour />
        <StandardListStyleFive />
      </>
    </>
  );
}
