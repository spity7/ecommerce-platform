import { Metadata } from "next";
import ButtonColor from "@/components/elements/element-button/ButtonColor";
import ButtonBorder from "@/components/elements/element-button/ButtonBorder";
import ButtonSize from "@/components/elements/element-button/ButtonSize";
import ButtonRound from "@/components/elements/element-button/ButtonRound";
import ButtonRoundIcon from "@/components/elements/element-button/ButtonRoundIcon";
import MagneticEffect from "@/components/elements/element-button/MagneticEffect";
import ElasticButton from "@/components/elements/element-button/ElasticButton";
import Marquee from "@/components/elements/element-button/Marquee";
import ElementsHero from "@/components/elements/ElementsHero";
export const metadata: Metadata = {
  title:
    "Element Button | Discover premium cosmetics and skincare products at Beauty Station.",
  description: "Discover premium cosmetics and skincare products at Beauty Station.",
};
export default function ElementButtonPage() {
  return (
    <>
      <>
        <ElementsHero
          title={
            <>
              Exclusive <span>Button</span>
            </>
          }
        />
        <ButtonColor />
        <ButtonBorder />
        <ButtonSize />
        <ButtonRound />
        <ButtonRoundIcon />
        <MagneticEffect />
        <ElasticButton />
        <Marquee />
      </>
    </>
  );
}
