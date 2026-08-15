import { Metadata } from "next";
import CategoriesStyleCircle from "@/components/elements/element-catagories-style/CategoriesStyleCircle";
import CategoriesStyleRoundBox from "@/components/elements/element-catagories-style/CategoriesStyleRoundBox";
import CategoriesStyleButtonCircle from "@/components/elements/element-catagories-style/CategoriesStyleButtonCircle";
import CategoriesStyleSimpleBox from "@/components/elements/element-catagories-style/CategoriesStyleSimpleBox";
import CategoriesStyleBentoBox from "@/components/elements/element-catagories-style/CategoriesStyleBentoBox";
import CategoriesStyleLinkedBox from "@/components/elements/element-catagories-style/CategoriesStyleLinkedBox";
import CategoriesStyleLinkedBoxSwiper from "@/components/elements/element-catagories-style/CategoriesStyleLinkedBoxSwiper";
import CategoriesStyleButtonBoxed from "@/components/elements/element-catagories-style/CategoriesStyleButtonBoxed";
import CategoriesStyleSimple from "@/components/elements/element-catagories-style/CategoriesStyleSimple";
import CategoriesStyleClassicBentoBox from "@/components/elements/element-catagories-style/CategoriesStyleClassicBentoBox";
import CategoriesStyleMiniBentoBox from "@/components/elements/element-catagories-style/CategoriesStyleMiniBentoBox";
import CategoriesStylePopularByCategories from "@/components/elements/element-catagories-style/CategoriesStylePopularByCategories";
import ElementsHero from "@/components/elements/ElementsHero";
export const metadata: Metadata = {
  title:
    "Element Categories Style | Discover premium cosmetics and skincare products at Beauty Station.",
  description: "Discover premium cosmetics and skincare products at Beauty Station.",
};
export default function ElementCatagoriesStylePage() {
  return (
    <>
      <ElementsHero
        title={
          <>
            Exclusive <span>Categories Style</span>
          </>
        }
      />
      <CategoriesStyleCircle />
      <CategoriesStyleRoundBox />
      <CategoriesStyleButtonCircle />
      <CategoriesStyleSimpleBox />
      <CategoriesStyleBentoBox />
      <CategoriesStyleLinkedBox />
      <CategoriesStyleLinkedBoxSwiper />
      <CategoriesStyleButtonBoxed />
      <CategoriesStyleSimple />
      <CategoriesStyleClassicBentoBox />
      <CategoriesStyleMiniBentoBox />
      <CategoriesStylePopularByCategories />
    </>
  );
}
