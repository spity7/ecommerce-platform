import { Metadata } from "next";
import TeamStandard from "@/components/elements/element-team-styles/TeamStandard";
import TeamHoverStyle from "@/components/elements/element-team-styles/TeamHoverStyle";
import TeamHoverBottomContent from "@/components/elements/element-team-styles/TeamHoverBottomContent";
import TeamCarouselStyle from "@/components/elements/element-team-styles/TeamCarouselStyle";
import TeamGradientStyle from "@/components/elements/element-team-styles/TeamGradientStyle";
import ElementsHero from "@/components/elements/ElementsHero";
export const metadata: Metadata = {
  title:
    "Element Team Styles | Discover premium cosmetics and skincare products at Beauty Station.",
  description: "Discover premium cosmetics and skincare products at Beauty Station.",
};
export default function ElementTeamStylesPage() {
  return (
    <>
      <>
        <ElementsHero
          title={
            <>
              Exclusive <span>Team Styles</span>
            </>
          }
        />
        <TeamStandard />
        <TeamHoverStyle />
        <TeamHoverBottomContent />
        <TeamCarouselStyle />
        <TeamGradientStyle />
      </>
    </>
  );
}
